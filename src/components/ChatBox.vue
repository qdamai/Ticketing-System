<template>
  <div class="flex flex-col h-[500px] bg-slate-50 rounded-3xl overflow-hidden border border-slate-200">
    <!-- Messages Area -->
    <div ref="messageContainer" class="flex-1 overflow-y-auto p-6 space-y-4">
      <div v-if="loading" class="flex justify-center py-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
      
      <transition-group name="list" tag="div" class="space-y-4">
        <div v-for="msg in messages" :key="msg.id" 
          :class="msg.userId === authStore.user.uid ? 'items-end' : 'items-start'"
          class="flex flex-col">
          
          <div class="flex items-center space-x-2 mb-1">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {{ msg.userName }}
            </span>
            <span class="text-[10px] font-bold text-slate-300">
              {{ formatTime(msg.createdAt) }}
            </span>
          </div>

          <div :class="msg.userId === authStore.user.uid ? 'bg-emerald-600 text-white rounded-l-2xl rounded-tr-2xl' : 'bg-white text-slate-700 rounded-r-2xl rounded-tl-2xl shadow-sm border border-slate-100'"
            class="max-w-[80%] p-4 text-sm leading-relaxed">
            
            <!-- File Attachment if exists -->
            <div v-if="msg.fileUrl" class="mb-3 rounded-xl overflow-hidden bg-black/5 p-2">
              <template v-if="isImage(msg.fileUrl)">
                <img :src="msg.fileUrl" class="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90" @click="openFile(msg.fileUrl)">
              </template>
              <template v-else>
                <div @click="openFile(msg.fileUrl)" class="flex items-center space-x-3 p-3 bg-white/10 rounded-lg cursor-pointer hover:bg-white/20 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span class="text-xs font-bold truncate">Download Document</span>
                </div>
              </template>
            </div>

            <p class="whitespace-pre-line">{{ msg.text }}</p>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Input Area -->
    <div class="p-4 bg-white border-t border-slate-100">
      <!-- File Preview with Cancel Button -->
      <div v-if="pendingFile" class="mb-3 flex items-center justify-between bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
        <div class="flex items-center space-x-3 overflow-hidden">
          <div class="bg-emerald-600 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span class="text-xs font-bold text-emerald-800 truncate">{{ pendingFile.name }}</span>
        </div>
        <button @click="pendingFile = null" class="p-1 hover:bg-emerald-100 rounded-full text-emerald-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <div v-if="uploadProgress > 0" class="mb-4">
        <div class="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full bg-emerald-500 transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
        </div>
        <p class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Uploading... {{ Math.round(uploadProgress) }}%</p>
      </div>

      <form @submit.prevent="sendMessage" class="flex items-end space-x-2">
        <div class="flex-1 relative">
          <textarea v-model="newMessage" rows="1" @keydown.enter.prevent="sendMessage"
            placeholder="Ketik pesan..."
            class="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"></textarea>
          
          <label class="absolute right-3 bottom-3 cursor-pointer text-slate-400 hover:text-emerald-600 transition-colors">
            <input type="file" class="hidden" @change="handleFileUpload" accept="image/*,.pdf">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </label>
        </div>
        
        <button type="submit" :disabled="!newMessage.trim() && !pendingFile"
          class="p-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-lg shadow-emerald-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { db } from '../services/firebase'
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuthStore } from '../stores/auth'
import { uploadFile } from '../services/storage'

const props = defineProps({
  ticketId: {
    type: String,
    required: true
  }
})

const authStore = useAuthStore()
const messages = ref([])
const newMessage = ref('')
const loading = ref(true)
const messageContainer = ref(null)
const uploadProgress = ref(0)
const pendingFile = ref(null)

let unsubscribe = null

const scrollToBottom = () => {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  })
}

const fetchMessages = () => {
  const messagesCol = collection(db, 'tickets', props.ticketId, 'messages')
  const q = query(messagesCol, orderBy('createdAt', 'asc'))

  unsubscribe = onSnapshot(q, (snapshot) => {
    messages.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    loading.value = false
    scrollToBottom()
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim() && !pendingFile.value) return
  
  const text = newMessage.value
  newMessage.value = ''
  let fileUrl = null

  if (pendingFile.value) {
    try {
      // Membersihkan nama file dari karakter aneh/emoji agar tidak error di Cloudinary
      const safeName = pendingFile.value.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const path = `tickets/${props.ticketId}/chat/${Date.now()}_${safeName}`;
      
      fileUrl = await uploadFile(pendingFile.value, path, (prog) => {
        uploadProgress.value = prog
      })
      pendingFile.value = null
      uploadProgress.value = 0
    } catch (error) {
      alert('Upload gagal: ' + error.message)
      return
    }
  }

  try {
    await addDoc(collection(db, 'tickets', props.ticketId, 'messages'), {
      text,
      fileUrl,
      userId: authStore.user.uid,
      userName: authStore.displayName,
      createdAt: serverTimestamp()
    })
  } catch (error) {
    alert('Gagal mengirim pesan: ' + error.message)
  }
}

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    pendingFile.value = file
    // Tidak langsung kirim, tapi tampilkan preview dulu
  }
}

const isImage = (url) => {
  return /\.(jpg|jpeg|png|webp|avif|gif)$/.test(url.split('?')[0].toLowerCase())
}

const openFile = (url) => {
  window.open(url, '_blank')
}

const formatTime = (timestamp) => {
  if (!timestamp) return 'Sending...'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(date)
}

onMounted(() => {
  fetchMessages()
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

watch(messages, () => {
  scrollToBottom()
}, { deep: true })
</script>

<style scoped>
.list-enter-active, .list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Hide scrollbar but keep functionality */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.1) transparent;
}
</style>
