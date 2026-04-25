<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
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
            <span class="text-xl font-black text-slate-900 dark:text-white tracking-tighter">Detail <span class="text-emerald-600">Tiket</span></span>
          </div>
          <div class="flex items-center space-x-3">
            <TicketTimer v-if="ticket" :createdAt="ticket.createdAt" :status="ticket.status" />
            <span :class="statusBadge(ticket?.status)" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
              {{ ticket?.status || 'Loading...' }}
            </span>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>

      <div v-else-if="ticket" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Ticket Info -->
        <div class="lg:col-span-1 space-y-6">
          <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
            <div class="flex items-center space-x-2 mb-6">
              <span :class="priorityBadge(ticket.priority)" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-600">
                {{ ticket.priority || 'Normal' }}
              </span>
              <span class="text-[10px] font-bold text-slate-400">#{{ ticket.id.toUpperCase().substring(0, 8) }}</span>
            </div>

            <h1 class="text-2xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{{ ticket.title }}</h1>
            
            <!-- AI Summary (Admin Only) -->
            <div v-if="authStore.isAdmin && ticket.aiSummary" class="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
              <div class="flex items-center space-x-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">Smart AI Summary</p>
              </div>
              <p class="text-xs text-emerald-800 dark:text-emerald-400 italic">"{{ ticket.aiSummary }}"</p>
            </div>

            <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 whitespace-pre-line">{{ ticket.description }}</p>

            <!-- Attachment -->
            <div v-if="ticket.fileUrl" class="mb-8">
              <h3 class="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Lampiran Utama</h3>
              <div @click="openFile(ticket.fileUrl)" class="flex items-center space-x-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span class="text-xs font-bold text-slate-600 dark:text-slate-300 truncate">Lihat Lampiran</span>
              </div>
            </div>

            <div class="space-y-4 pt-8 border-t border-slate-50 dark:border-slate-700">
              <div class="flex justify-between items-center text-xs">
                <span class="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Kategori</span>
                <span class="font-black text-slate-900 dark:text-white">{{ ticket.category }} / {{ ticket.department || 'IT' }}</span>
              </div>
              <div class="flex justify-between items-center text-xs">
                <span class="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Dibuat Oleh</span>
                <div class="flex flex-col items-end">
                  <span class="font-black text-slate-900 dark:text-white">{{ ticket.userName }}</span>
                  <div class="flex items-center space-x-1.5 mt-1">
                    <span :class="ownerStatus.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'" class="w-2 h-2 rounded-full"></span>
                    <span class="text-[10px] font-bold" :class="ownerStatus.isOnline ? 'text-emerald-600' : 'text-slate-500'">
                      {{ ownerStatus.isOnline ? 'Online Now' : 'Offline' }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex justify-between items-center text-xs">
                <span class="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Tanggal</span>
                <span class="font-black text-slate-900 dark:text-white">{{ formatDate(ticket.createdAt) }}</span>
              </div>
            </div>

            <!-- Admin Actions -->
            <div v-if="authStore.isAdmin && ticket.status !== 'Resolved'" class="mt-8 pt-8 border-t border-slate-50 dark:border-slate-700">
              <button @click="markAsResolved" class="w-full py-4 bg-emerald-600 text-white font-black text-sm rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 dark:shadow-none">
                MARK AS RESOLVED
              </button>
            </div>
          </div>

          <!-- Internal Notes (Admin Only) -->
          <div v-if="authStore.isAdmin">
            <InternalNotes :ticketId="ticket.id" />
          </div>
        </div>

        <!-- Chat & Timeline Area -->
        <div class="lg:col-span-2 flex flex-col h-[800px]">
          <!-- Tabs -->
          <div class="flex space-x-1 mb-4 p-1 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
            <button @click="activeTab = 'chat'" 
              :class="activeTab === 'chat' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-black' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'"
              class="flex-1 py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Live Chat
            </button>
            <button @click="activeTab = 'timeline'" 
              :class="activeTab === 'timeline' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-black' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'"
              class="flex-1 py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Audit Trail
            </button>
          </div>

          <!-- Tab Content -->
          <div class="flex-1 overflow-y-auto">
            <ChatBox v-if="activeTab === 'chat'" :ticket-id="ticket.id" class="h-full" />
            <TicketTimeline v-else :ticket-id="ticket.id" />
          </div>
        </div>
      </div>
    </main>

    <!-- Feedback Modal for User -->
    <RatingModal 
      :show="showRatingModal" 
      :ticketId="ticket?.id" 
      @close="showRatingModal = false"
      @success="handleRatingSuccess" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { db } from '../services/firebase'
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore'
import { useAuthStore } from '../stores/auth'
import ChatBox from '../components/ChatBox.vue'
import TicketTimer from '../components/TicketTimer.vue'
import InternalNotes from '../components/InternalNotes.vue'
import RatingModal from '../components/RatingModal.vue'
import TicketTimeline from '../components/TicketTimeline.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const ticket = ref(null)
const loading = ref(true)
const ownerStatus = ref({ isOnline: false, lastSeen: null })
const showRatingModal = ref(false)
const activeTab = ref('chat')

let ticketUnsubscribe = null
let ownerUnsubscribe = null

const fetchTicket = async () => {
  loading.value = true
  try {
    const docRef = doc(db, 'tickets', route.params.id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      ticket.value = { id: docSnap.id, ...docSnap.data() }
      
      // Watch Owner Status
      ownerUnsubscribe = onSnapshot(doc(db, 'users', ticket.value.userId), (doc) => {
        if (doc.exists()) ownerStatus.value = doc.data()
      })

      // Security Check
      if (!authStore.isAdmin && ticket.value.userId !== authStore.user.uid) {
        alert('Akses ditolak.')
        router.push('/')
        return
      }

      // Show Rating Modal if Resolved and not yet rated (for user)
      if (!authStore.isAdmin && ticket.value.status === 'Resolved' && !ticket.value.rating) {
        showRatingModal.value = true
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleRatingSuccess = () => {
  showRatingModal.value = false
  fetchTicket() // Refresh data
}

onUnmounted(() => {
  if (ownerUnsubscribe) ownerUnsubscribe()
})

const markAsResolved = async () => {
  if (!confirm('Tandai tiket ini sebagai Selesai (Resolved)?')) return
  try {
    await updateDoc(doc(db, 'tickets', ticket.value.id), {
      status: 'Resolved',
      resolvedAt: new Date().toISOString()
    })
    ticket.value.status = 'Resolved'

    // Log Activity
    import('../services/logger').then(({ logTicketActivity }) => {
      logTicketActivity(ticket.value.id, 'Mengubah status menjadi Resolved', 'status')
    })

    alert('Tiket berhasil diselesaikan!')
  } catch (error) {
    alert('Gagal update status: ' + error.message)
  }
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
    case 'High': return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800'
    case 'Medium': return 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800'
    default: return 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
  }
}

const formatDate = (ts) => {
  if (!ts) return '...'
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' }).format(date)
}

const openFile = (url) => {
  window.open(url, '_blank')
}

onMounted(() => fetchTicket())
</script>
