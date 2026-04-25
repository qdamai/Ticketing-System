<template>
  <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm">
    <h3 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Audit Trail
    </h3>
    
    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-10 bg-slate-100 dark:bg-slate-700 rounded-xl w-full"></div>
      <div class="h-10 bg-slate-100 dark:bg-slate-700 rounded-xl w-5/6"></div>
    </div>

    <div v-else-if="logs.length === 0" class="text-center py-8">
      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Belum ada aktivitas</p>
    </div>

    <div v-else class="relative border-l-2 border-slate-100 dark:border-slate-700 ml-3 space-y-8">
      <div v-for="log in logs" :key="log.id" class="relative pl-6">
        <!-- Icon Node -->
        <span class="absolute -left-[11px] top-1 h-5 w-5 rounded-full ring-4 ring-white dark:ring-slate-800 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
          <svg v-if="log.type === 'create'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <svg v-else-if="log.type === 'status'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        
        <!-- Content -->
        <div class="flex flex-col">
          <p class="text-xs font-bold text-slate-900 dark:text-white leading-relaxed">
            <span class="text-emerald-600 dark:text-emerald-500">{{ log.actor }}</span> {{ log.action }}
          </p>
          <span class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{{ formatDate(log.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { db } from '../services/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'

const props = defineProps({
  ticketId: { type: String, required: true }
})

const logs = ref([])
const loading = ref(true)
let unsubscribe = null

const fetchLogs = () => {
  const q = query(
    collection(db, 'tickets', props.ticketId, 'logs'),
    orderBy('createdAt', 'desc')
  )

  unsubscribe = onSnapshot(q, (snapshot) => {
    logs.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    loading.value = false
  }, (error) => {
    console.error('Error fetching logs:', error)
    loading.value = false
  })
}

const formatDate = (timestamp) => {
  if (!timestamp) return '...'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

onMounted(() => {
  fetchLogs()
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>
