<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900">
    <nav class="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex items-center px-6">
      <router-link to="/" class="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </router-link>
      <h1 class="text-xl font-black text-slate-900 dark:text-white tracking-tighter">Pusat <span class="text-emerald-600">Bantuan</span></h1>
    </nav>

    <main class="max-w-4xl mx-auto py-12 px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-4">Ada yang bisa kami bantu?</h2>
        <div class="relative max-w-xl mx-auto">
          <input v-model="searchQuery" type="text" placeholder="Cari solusi masalah Anda (misal: password)..."
            class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-12 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none shadow-xl shadow-slate-200/50 dark:shadow-none transition-all dark:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-4 top-4.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="article in filteredArticles" :key="article.id" 
          class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 hover:border-emerald-500 transition-all cursor-pointer group">
          <div class="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
            <span class="text-lg group-hover:scale-125 transition-transform">{{ article.icon }}</span>
          </div>
          <h3 class="font-black text-slate-900 dark:text-white mb-2">{{ article.title }}</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{{ article.excerpt }}</p>
          <div class="mt-4 flex items-center text-emerald-600 text-[10px] font-black uppercase tracking-widest">
            Baca Selengkapnya
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      <div class="mt-16 text-center bg-emerald-600 rounded-3xl p-8 text-white shadow-2xl shadow-emerald-200 dark:shadow-none">
        <h3 class="text-xl font-black mb-2">Masalah tidak ditemukan?</h3>
        <p class="text-sm opacity-90 mb-6">Jangan ragu untuk langsung menghubungi tim support kami dengan membuat tiket baru.</p>
        <router-link to="/create-ticket" class="inline-block bg-white text-emerald-600 px-8 py-3 rounded-xl font-black text-xs hover:bg-emerald-50 transition-colors uppercase tracking-widest">Buat Tiket Sekarang</router-link>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

const articles = [
  { id: 1, title: 'Lupa Password Akun', excerpt: 'Langkah-langkah reset password dan cara mengamankan akun Anda kembali.', icon: '🔑', category: 'Account' },
  { id: 2, title: 'Masalah Koneksi VPN', excerpt: 'Panduan troubleshooting jika VPN kantor tidak bisa terhubung di perangkat Anda.', icon: '🌐', category: 'Technical' },
  { id: 3, title: 'Cara Klaim Reimbursement', excerpt: 'Alur pengajuan klaim biaya operasional melalui sistem internal terbaru.', icon: '💰', category: 'Finance' },
  { id: 4, title: 'Izin dan Cuti Karyawan', excerpt: 'Informasi mengenai jatah cuti tahunan dan prosedur izin sakit atau mendesak.', icon: '📅', category: 'HR' },
]

const filteredArticles = computed(() => {
  return articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    a.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>
