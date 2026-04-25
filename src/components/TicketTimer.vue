<template>
  <div v-if="status !== 'Resolved'" class="flex items-center space-x-2">
    <div :class="[
      'px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest flex items-center space-x-2 transition-all duration-500',
      isOverdue 
        ? 'bg-red-100 text-red-600 animate-pulse border border-red-200' 
        : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
    ]">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ isOverdue ? 'OVERDUE' : timeLeft }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  createdAt: [Object, String, Number],
  status: String
})

const now = ref(Date.now())
let timer = null

const isOverdue = computed(() => {
  const createdDate = props.createdAt?.toDate ? props.createdAt.toDate() : new Date(props.createdAt)
  const deadline = new Date(createdDate.getTime() + 4 * 60 * 60 * 1000) // 4 Jam SLA
  return now.value > deadline.getTime()
})

const timeLeft = computed(() => {
  const createdDate = props.createdAt?.toDate ? props.createdAt.toDate() : new Date(props.createdAt)
  const deadline = new Date(createdDate.getTime() + 4 * 60 * 60 * 1000)
  const diff = deadline.getTime() - now.value
  
  if (diff <= 0) return '00:00:00'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
