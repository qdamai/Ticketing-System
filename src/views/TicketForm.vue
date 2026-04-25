<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Navbar -->
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center space-x-4">
            <router-link to="/" class="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </router-link>
            <span class="text-xl font-black text-slate-900 tracking-tighter">Buat <span class="text-emerald-600">Tiket Baru</span></span>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Title -->
          <div class="space-y-2">
            <label class="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Subjek Masalah</label>
            <input v-model="form.title" type="text" placeholder="Apa yang bisa kami bantu?" required
              class="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white">
          </div>

          <!-- Knowledge Base Suggestions -->
          <div v-if="suggestions.length > 0" class="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800/50 animate-fade-in">
            <div class="flex items-center space-x-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p class="text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest">Saran Solusi Cepat</p>
            </div>
            <div class="space-y-2">
              <div v-for="s in suggestions" :key="s.id" class="flex items-center justify-between group cursor-pointer" @click="router.push('/help')">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-emerald-600 transition-colors">{{ s.title }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-slate-400 group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Category -->
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Kategori</label>
              <select v-model="form.category" class="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white">
                <option>Technical Support</option>
                <option>Bug Report</option>
                <option>Feature Request</option>
                <option>Billing/Account</option>
              </select>
            </div>
            <!-- Department -->
            <div class="space-y-2">
              <label class="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Departemen</label>
              <select v-model="form.department" class="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white">
                <option>IT</option>
                <option>HR</option>
                <option>Finance</option>
                <option>General</option>
              </select>
            </div>
          </div>
          
          <!-- Priority -->
          <div class="space-y-2">
            <label class="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Prioritas</label>
            <div class="flex space-x-2">
              <button v-for="p in ['Normal', 'Medium', 'High']" :key="p" type="button"
                @click="form.priority = p"
                :class="form.priority === p ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400'"
                class="flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                {{ p }}
              </button>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <label class="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Detail Masalah</label>
            <textarea v-model="form.description" rows="4" placeholder="Jelaskan masalah Anda secara detail..." required
              class="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all dark:text-white resize-none"></textarea>
          </div>

          <!-- File Upload -->
          <div class="space-y-2">
            <div class="flex justify-between items-center px-1">
              <label class="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Lampiran (Screenshot/PDF)</label>
              <button v-if="selectedFile" @click="selectedFile = null; uploadProgress = 0" type="button" class="text-[10px] font-black text-red-500 hover:text-red-700 uppercase tracking-widest flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                Batal
              </button>
            </div>
            <div class="relative group">
              <input type="file" @change="handleFileChange" accept="image/*,.pdf" 
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10">
              <div class="w-full bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-all"
                :class="selectedFile ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-700'">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mb-2 transition-colors" 
                  :class="selectedFile ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600 group-hover:text-emerald-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-xs font-bold text-center px-4" :class="selectedFile ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'">
                  {{ selectedFile ? selectedFile.name : 'Klik atau seret file ke sini' }}
                </p>
              </div>
            </div>
            
            <div v-if="uploadProgress > 0" class="mt-4">
              <div class="h-1.5 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-500 transition-all duration-300" :style="{ width: uploadProgress + '%' }"></div>
              </div>
              <p class="text-[10px] font-bold text-slate-400 mt-2 tracking-widest uppercase text-center">Uploading: {{ Math.round(uploadProgress) }}%</p>
            </div>
          </div>

          <button type="submit" :disabled="submitting"
            class="w-full py-5 bg-emerald-600 text-white font-black text-base rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 dark:shadow-none disabled:opacity-50">
            {{ submitting ? 'SEDANG MEMPROSES...' : 'KIRIM TIKET SEKARANG' }}
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { db } from '../services/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { uploadFile } from '../services/storage'
import { GoogleGenerativeAI } from '@google/generative-ai'

const router = useRouter()
const authStore = useAuthStore()

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-pro" })

const form = reactive({
  title: '',
  description: '',
  category: 'Technical Support',
  department: 'IT',
  priority: 'Normal'
})

const selectedFile = ref(null)
const uploadProgress = ref(0)
const submitting = ref(false)
const suggestions = ref([])

// Mock Knowledge Base for Suggestions
const kbArticles = [
  { id: 1, title: 'Lupa Password Akun' },
  { id: 2, title: 'Masalah Koneksi VPN' },
  { id: 3, title: 'Cara Klaim Reimbursement' },
  { id: 4, title: 'Izin dan Cuti Karyawan' }
]

watch(() => form.title, (newVal) => {
  if (newVal.length > 3) {
    suggestions.value = kbArticles.filter(a => a.title.toLowerCase().includes(newVal.toLowerCase()))
  } else {
    suggestions.value = []
  }
})

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('File terlalu besar! Maksimal 5MB.')
      return
    }
    selectedFile.value = file
  }
}

const handleSubmit = async () => {
  if (submitting.value) return
  submitting.value = true

  let fileUrl = null
  let aiSummary = "Menunggu ringkasan AI..."
  
  try {
    // 1. Generate AI Summary directly on Frontend
    try {
      const prompt = `Anda adalah asisten helpdesk profesional. Ringkas masalah tiket berikut dalam maksimal 1 kalimat yang sangat padat untuk admin. Tiket: "${form.title} - ${form.description}"`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      aiSummary = response.text();
    } catch (aiError) {
      console.warn("Gemini Error:", aiError);
      aiSummary = "Gagal memproses ringkasan otomatis.";
    }

    // 2. Upload File
    if (selectedFile.value) {
      const safeName = selectedFile.value.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const path = `tickets/main/${Date.now()}_${safeName}`;
      
      fileUrl = await uploadFile(selectedFile.value, path, (prog) => {
        uploadProgress.value = prog
      })
    }

    // 3. Save to Firestore
    await addDoc(collection(db, 'tickets'), {
      ...form,
      fileUrl,
      aiSummary, // Save the generated summary
      userId: authStore.user.uid,
      userName: authStore.displayName,
      status: 'Open',
      createdAt: serverTimestamp()
    })

    alert('Tiket berhasil dibuat!')
    router.push('/')
  } catch (error) {
    alert('Gagal membuat tiket: ' + error.message)
  } finally {
    submitting.value = false
  }
}
</script>
