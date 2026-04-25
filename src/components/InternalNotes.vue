<template>
  <div class="flex flex-col h-[400px] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
    <div class="bg-slate-800 px-6 py-3 border-b border-slate-700 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
        <span class="text-[10px] font-black text-white uppercase tracking-widest">Internal Notes (Admin Only)</span>
      </div>
      <span class="text-[9px] text-slate-500 font-bold uppercase italic">Confidential</span>
    </div>

    <!-- Notes Area -->
    <div ref="container" class="flex-1 overflow-y-auto p-6 space-y-4">
      <div v-for="note in notes" :key="note.id" class="space-y-1">
        <div class="flex items-center space-x-2">
          <span class="text-[10px] font-black text-emerald-500 uppercase">{{ note.userName }}</span>
          <span class="text-[9px] text-slate-600 font-bold">{{ formatTime(note.createdAt) }}</span>
        </div>
        <div class="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
          <p class="text-xs text-slate-300 leading-relaxed">{{ note.text }}</p>
        </div>
      </div>
      <div v-if="notes.length === 0" class="text-center py-10">
        <p class="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Belum ada catatan internal.</p>
      </div>
    </div>

    <!-- Input Area -->
    <form @submit.prevent="addNote" class="p-4 bg-slate-800/50 border-t border-slate-800">
      <div class="flex space-x-2">
        <input v-model="newNote" placeholder="Tambah catatan rahasia..."
          class="flex-1 bg-slate-900 border-none rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-amber-500 outline-none text-white transition-all">
        <button type="submit" :disabled="!newNote.trim()"
          class="p-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-all disabled:opacity-30">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { db } from '../services/firebase'
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  ticketId: { type: String, required: true }
})

const authStore = useAuthStore()
const notes = ref([])
const newNote = ref('')
const container = ref(null)
let unsubscribe = null

const scrollToBottom = () => {
  nextTick(() => {
    if (container.value) container.value.scrollTop = container.value.scrollHeight
  })
}

const fetchNotes = () => {
  const notesCol = collection(db, 'tickets', props.ticketId, 'internal_notes')
  const q = query(notesCol, orderBy('createdAt', 'asc'))
  
  unsubscribe = onSnapshot(q, (snapshot) => {
    notes.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    scrollToBottom()
  })
}

const addNote = async () => {
  if (!newNote.value.trim()) return
  const text = newNote.value
  newNote.value = ''
  
  try {
    await addDoc(collection(db, 'tickets', props.ticketId, 'internal_notes'), {
      text,
      userId: authStore.user.uid,
      userName: authStore.displayName,
      createdAt: serverTimestamp()
    })
  } catch (e) {
    alert('Gagal menambah note: ' + e.message)
  }
}

const formatTime = (ts) => {
  if (!ts) return '...'
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => fetchNotes())
onUnmounted(() => unsubscribe && unsubscribe())
</script>
