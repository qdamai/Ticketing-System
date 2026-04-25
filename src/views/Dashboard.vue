<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
    <!-- Navbar -->
    <nav class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-2">
            <div :class="authStore.isAdmin ? 'bg-slate-900 dark:bg-emerald-600' : 'bg-emerald-600'" class="p-2 rounded-lg text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
              </svg>
            </div>
            <span class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Dame<span class="text-emerald-600">Desk</span></span>
          </div>
          <div class="flex items-center space-x-4">
            <div class="hidden md:block text-right mr-2">
              <p class="text-sm font-bold text-slate-900 dark:text-white">{{ authStore.displayName }}</p>
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{{ authStore.userData?.role || 'User' }}</p>
            </div>
            <button @click="handleLogout" class="p-2 text-slate-400 hover:text-red-600 transition-all hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative">
      <!-- Admin Header -->
      <div v-if="authStore.isAdmin" class="mb-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-1">Enterprise Console</h1>
            <p class="text-slate-500 dark:text-slate-400 text-sm">Pemantauan SLA dan performa tim secara real-time.</p>
          </div>
          <div class="flex space-x-3">
            <router-link to="/analytics" class="px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </router-link>
            <router-link to="/create-ticket" class="px-5 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 dark:shadow-none flex items-center">
              + Tiket Baru
            </router-link>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div v-for="stat in adminStats" :key="stat.label" class="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-3xl shadow-sm">
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ stat.label }}</p>
            <p class="text-3xl font-black" :class="stat.color">{{ stat.value }}</p>
          </div>
        </div>
      </div>

      <!-- User Header -->
      <div v-else class="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Halo, {{ authStore.displayName.split(' ')[0] }}!</h1>
          <p class="text-slate-500 dark:text-slate-400">Punya kendala? Kami di sini untuk membantu.</p>
        </div>
        <div class="flex space-x-3 w-full md:w-auto">
          <router-link to="/help" class="flex-1 md:flex-none px-6 py-4 rounded-2xl font-black text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-xs uppercase tracking-widest text-center hover:bg-slate-50 transition-all">
            Pusat Bantuan
          </router-link>
          <router-link to="/create-ticket" class="flex-1 md:flex-none px-6 py-4 rounded-2xl font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100 dark:shadow-none text-xs uppercase tracking-widest text-center transition-all transform hover:scale-105">
            Buat Tiket
          </router-link>
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar Filter -->
        <div class="lg:w-64 space-y-6">
          <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Search & Filter</h3>
            <div class="space-y-4">
              <input v-model="searchQuery" type="text" placeholder="Cari tiket..." 
                class="w-full bg-slate-50 dark:bg-slate-900/50 border-none text-xs rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white">
              
              <div class="space-y-2">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Departemen</label>
                <select v-model="filterDept" class="w-full bg-slate-50 dark:bg-slate-900/50 border-none text-xs rounded-xl px-4 py-3 outline-none dark:text-white">
                  <option value="All">Semua Dept</option>
                  <option value="IT">IT Support</option>
                  <option value="HR">Human Resources</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status</label>
                <select v-model="filterStatus" class="w-full bg-slate-50 dark:bg-slate-900/50 border-none text-xs rounded-xl px-4 py-3 outline-none dark:text-white">
                  <option value="All">Semua Status</option>
                  <option value="Open">Open</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Global Activity Feed (Admin Only) -->
          <div v-if="authStore.isAdmin" class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Activity Feed</h3>
            <div v-if="globalLogs.length === 0" class="text-center py-4">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Belum ada aktivitas</p>
            </div>
            <div v-else class="space-y-4">
              <div v-for="log in globalLogs" :key="log.id" class="flex items-start space-x-3">
                <div class="mt-0.5">
                  <svg v-if="log.type === 'create'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <svg v-else-if="log.type === 'status'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-tight">
                    <span class="text-emerald-600 dark:text-emerald-500">{{ log.actor }}</span> {{ log.action }}
                  </p>
                  <p class="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">{{ formatDate(log.createdAt) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1">
          <div v-if="loading">
            <SkeletonLoader :count="3" />
          </div>

          <div v-else class="space-y-4">
            <div v-if="filteredTickets.length === 0" class="text-center py-20 bg-white/50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
              <p class="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Tidak ada tiket ditemukan.</p>
            </div>

            <div v-for="ticket in filteredTickets" :key="ticket.id" 
              @click="router.push(`/ticket/${ticket.id}`)"
              class="group relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 transition-all duration-300 shadow-md hover:shadow-2xl cursor-pointer hover:border-emerald-500 hover:-translate-y-1 overflow-hidden">
              
              <div class="p-6 md:p-8">
                <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <div class="flex items-center space-x-3">
                    <span :class="statusBadge(ticket.status)" class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                      {{ ticket.status }}
                    </span>
                    <span class="px-3 py-1.5 bg-slate-100 dark:bg-slate-900 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-slate-200 dark:border-slate-700">
                      {{ ticket.department || 'General' }}
                    </span>
                    <!-- SLA Timer Component -->
                    <TicketTimer :createdAt="ticket.createdAt" :status="ticket.status" />
                  </div>
                  <div class="flex items-center space-x-2 text-slate-400">
                    <span class="text-[10px] font-bold">{{ formatDate(ticket.createdAt) }}</span>
                  </div>
                </div>

                <div class="mb-6">
                  <div class="flex items-center space-x-2 mb-1">
                    <span :class="priorityBadge(ticket.priority)" class="text-[9px] font-black uppercase tracking-tighter">{{ ticket.priority || 'Normal' }}</span>
                    <h3 class="text-xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-emerald-600 transition-colors">{{ ticket.title }}</h3>
                  </div>
                  <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-1">{{ ticket.description }}</p>
                  
                  <!-- AI Summary Badge -->
                  <div v-if="ticket.aiSummary && authStore.isAdmin" class="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 flex items-start space-x-3">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <p class="text-xs text-emerald-800 dark:text-emerald-400 font-medium italic">{{ ticket.aiSummary }}</p>
                  </div>
                </div>

                <div class="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-700">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 font-black border border-slate-200 dark:border-slate-800">
                      {{ ticket.userName?.charAt(0) || 'U' }}
                    </div>
                    <div>
                      <p class="text-xs font-black text-slate-900 dark:text-white">{{ ticket.userName || 'Anonymous' }}</p>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ ticket.category }}</p>
                    </div>
                  </div>

                  <div class="flex items-center space-x-4">
                    <div v-if="authStore.isAdmin" class="flex items-center space-x-2">
                      <button @click.stop="deleteTicket(ticket.id)" class="p-2 text-slate-300 hover:text-red-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-300 group-hover:text-emerald-500 transition-all group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { db } from '../services/firebase'
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc, collectionGroup, limit } from 'firebase/firestore'
import SkeletonLoader from '../components/SkeletonLoader.vue'
import TicketTimer from '../components/TicketTimer.vue'

const authStore = useAuthStore()
const router = useRouter()

const tickets = ref([])
const loading = ref(true)
const searchQuery = ref('')
const filterDept = ref('All')
const filterStatus = ref('All')
const sortBy = ref('newest')
const globalLogs = ref([]) // State untuk Global Activity Feed

const priorityScore = { 'High': 3, 'Medium': 2, 'Normal': 1, undefined: 1 }

const filteredTickets = computed(() => {
  let result = tickets.value.filter(ticket => {
    const matchesSearch = ticket.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          ticket.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesDept = filterDept.value === 'All' || ticket.department === filterDept.value
    const matchesStatus = filterStatus.value === 'All' || ticket.status === filterStatus.value
    return matchesSearch && matchesDept && matchesStatus
  })

  if (sortBy.value === 'priority') {
    result.sort((a, b) => priorityScore[b.priority] - priorityScore[a.priority])
  } else {
    result.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt)
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt)
      return dateB - dateA
    })
  }

  return result
})

const adminStats = computed(() => [
  { label: 'Tiket Masuk', value: tickets.value.length, color: 'text-slate-900 dark:text-white' },
  { label: 'Open', value: tickets.value.filter(t => t.status === 'Open').length, color: 'text-amber-500' },
  { label: 'Selesai', value: tickets.value.filter(t => t.status === 'Resolved').length, color: 'text-emerald-500' },
  { label: 'Overdue', value: calculateOverdue(), color: 'text-red-500' }
])

const calculateOverdue = () => {
  const now = new Date()
  return tickets.value.filter(t => {
    if (t.status === 'Resolved') return false
    const createdDate = t.createdAt?.toDate ? t.createdAt.toDate() : new Date(t.createdAt)
    const deadline = new Date(createdDate.getTime() + 4 * 60 * 60 * 1000)
    return now > deadline
  }).length
}

let unsubscribe = null
let logsUnsubscribe = null

const fetchGlobalLogs = () => {
  if (!authStore.isAdmin) return
  const q = query(
    collectionGroup(db, 'logs'),
    orderBy('createdAt', 'desc'),
    limit(5)
  )
  logsUnsubscribe = onSnapshot(q, (snapshot) => {
    globalLogs.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }, (error) => {
    console.warn('Global logs require an index. Activity feed hidden until created.', error)
  })
}

const fetchTickets = () => {
  loading.value = true
  const ticketsCol = collection(db, 'tickets')
  let q

  if (authStore.isAdmin) {
    q = query(ticketsCol, orderBy('createdAt', 'desc'))
  } else {
    q = query(ticketsCol, where('userId', '==', authStore.user.uid), orderBy('createdAt', 'desc'))
  }

  unsubscribe = onSnapshot(q, (snapshot) => {
    tickets.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    loading.value = false
  }, (error) => {
    console.error("Snapshot error:", error)
    loading.value = false
  })
}

const deleteTicket = async (id) => {
  if (!confirm('Hapus tiket ini?')) return
  try {
    await deleteDoc(doc(db, 'tickets', id))
  } catch (error) {
    alert('Error: ' + error.message)
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

const statusBadge = (status) => {
  switch (status) {
    case 'Open': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500'
    case 'In-Progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500'
    case 'Resolved': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-500'
    default: return 'bg-slate-100 text-slate-500 dark:bg-slate-900 dark:text-slate-500'
  }
}

const priorityBadge = (priority) => {
  switch (priority) {
    case 'High': return 'text-red-500'
    case 'Medium': return 'text-amber-500'
    default: return 'text-slate-400'
  }
}

const formatDate = (ts) => {
  if (!ts) return '...'
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

onMounted(() => {
  fetchTickets()
  fetchGlobalLogs()
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
  if (logsUnsubscribe) logsUnsubscribe()
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
