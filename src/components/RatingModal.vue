<template>
  <div v-if="show" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div class="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md p-8 shadow-2xl transform transition-all border border-slate-100 dark:border-slate-700">
      <div class="text-center">
        <div class="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <span class="text-4xl">🎉</span>
        </div>
        <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Bantu Kami Berkembang!</h3>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-2">Tiket Anda telah diselesaikan. Bagaimana penilaian Anda terhadap pelayanan kami?</p>
      </div>

      <div class="flex justify-center space-x-2 my-8">
        <button v-for="star in 5" :key="star" @click="rating = star"
          class="text-4xl transition-transform hover:scale-125 focus:outline-none"
          :class="rating >= star ? 'grayscale-0' : 'grayscale opacity-30'">
          ⭐
        </button>
      </div>

      <div class="space-y-4">
        <textarea v-model="feedback" rows="3" placeholder="Tuliskan feedback singkat (opsional)..."
          class="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-slate-200 transition-all"></textarea>
        
        <div class="flex space-x-3">
          <button @click="$emit('close')" class="flex-1 py-4 text-slate-400 dark:text-slate-500 font-bold text-sm hover:text-slate-600 dark:hover:text-slate-300">Nanti Saja</button>
          <button @click="submitRating" :disabled="!rating || loading"
            class="flex-[2] py-4 bg-emerald-600 text-white font-black text-sm rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 dark:shadow-none disabled:opacity-50">
            {{ loading ? 'MENGIRIM...' : 'KIRIM PENILAIAN' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '../services/firebase'
import { doc, updateDoc } from 'firebase/firestore'

const props = defineProps({
  show: Boolean,
  ticketId: String
})

const emit = defineEmits(['close', 'success'])

const rating = ref(0)
const feedback = ref('')
const loading = ref(false)

const submitRating = async () => {
  if (!rating.value) return
  loading.value = true
  try {
    await updateDoc(doc(db, 'tickets', props.ticketId), {
      rating: rating.value,
      feedback: feedback.value,
      ratedAt: new Date().toISOString()
    })
    emit('success')
  } catch (error) {
    alert('Gagal mengirim rating: ' + error.message)
  } finally {
    loading.value = false
  }
}
</script>
