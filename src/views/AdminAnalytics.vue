<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12">
    <!-- Navbar -->
    <nav class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-4">
            <router-link to="/" class="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </router-link>
            <span class="text-xl font-black text-slate-900 dark:text-white tracking-tighter">Admin <span class="text-emerald-600">Analytics</span></span>
          </div>
          <div class="flex items-center">
            <button @click="exportData" class="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>EXPORT EXCEL</span>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>

      <div v-else class="space-y-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div v-for="stat in stats" :key="stat.label" class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <p class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{{ stat.label }}</p>
            <p class="text-3xl font-black text-slate-900 dark:text-white mt-1">{{ stat.value }}</p>
            <div class="flex items-center mt-2" :class="stat.trend > 0 ? 'text-emerald-500' : 'text-slate-400'">
              <span class="text-[10px] font-bold">{{ stat.desc }}</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Line Chart -->
          <div class="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">Tren Tiket (7 Hari Terakhir)</h3>
            <div class="h-64">
              <Line :data="lineChartData" :options="chartOptions" />
            </div>
          </div>

          <!-- Pie Chart -->
          <div class="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
            <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">Distribusi Kategori</h3>
            <div class="h-64">
              <Pie :data="pieChartData" :options="chartOptions" />
            </div>
          </div>
        </div>

        <!-- Latest Feedback -->
        <div class="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6">Feedback Terbaru</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="f in latestFeedback" :key="f.id" class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
              <div class="flex items-center justify-between mb-2">
                <div class="flex text-xs text-orange-400">
                  <span v-for="i in 5" :key="i" :class="i <= f.rating ? 'opacity-100' : 'opacity-20'">⭐</span>
                </div>
                <span class="text-[10px] font-bold text-slate-400 uppercase">{{ f.userName }}</span>
              </div>
              <p class="text-xs text-slate-600 dark:text-slate-400 italic">"{{ f.feedback || 'Tanpa komentar' }}"</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '../services/firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { exportTicketsToExcel } from '../services/exportService'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import { Line, Pie } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const tickets = ref([])
const loading = ref(true)

const stats = computed(() => {
  const total = tickets.value.length
  const open = tickets.value.filter(t => t.status === 'Open').length
  const resolved = tickets.value.filter(t => t.status === 'Resolved').length
  const avgRating = tickets.value.filter(t => t.rating).reduce((acc, t) => acc + t.rating, 0) / (tickets.value.filter(t => t.rating).length || 1)

  return [
    { label: 'Total Tiket', value: total, desc: 'Semua waktu', trend: 0 },
    { label: 'Tiket Open', value: open, desc: 'Butuh penanganan', trend: 1 },
    { label: 'Tiket Selesai', value: resolved, desc: 'Case closed', trend: 1 },
    { label: 'Rata-rata Rating', value: avgRating.toFixed(1), desc: 'Kepuasan user', trend: 1 }
  ]
})

const latestFeedback = computed(() => {
  return tickets.value
    .filter(t => t.rating)
    .sort((a, b) => (b.ratedAt || 0) - (a.ratedAt || 0))
    .slice(0, 3)
})

// --- Chart Data ---

const lineChartData = computed(() => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })

  const counts = last7Days.map(date => {
    return tickets.value.filter(t => {
      const tDate = t.createdAt?.toDate ? t.createdAt.toDate().toISOString().split('T')[0] : t.createdAt?.split('T')[0]
      return tDate === date
    }).length
  })

  return {
    labels: last7Days.map(d => d.split('-').slice(1).reverse().join('/')),
    datasets: [{
      label: 'Tiket Baru',
      backgroundColor: '#10b981',
      borderColor: '#10b981',
      data: counts,
      tension: 0.4
    }]
  }
})

const pieChartData = computed(() => {
  const categories = ['Technical Support', 'Bug Report', 'Feature Request', 'Billing/Account']
  const counts = categories.map(cat => tickets.value.filter(t => t.category === cat).length)

  return {
    labels: categories,
    datasets: [{
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'],
      data: counts
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: {
        font: { size: 10, weight: 'bold' },
        color: document.documentElement.classList.contains('dark') ? '#94a3b8' : '#64748b'
      }
    }
  },
  scales: {
    y: {
      ticks: { color: '#94a3b8', font: { size: 10 } },
      grid: { color: 'rgba(0,0,0,0.05)' }
    },
    x: {
      ticks: { color: '#94a3b8', font: { size: 10 } },
      grid: { display: false }
    }
  }
}

const exportData = () => {
  exportTicketsToExcel(tickets.value)
}

onMounted(async () => {
  try {
    const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    tickets.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>
