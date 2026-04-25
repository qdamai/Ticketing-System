<template>
  <div class="animate-pulse space-y-4">
    <div v-for="i in count" :key="i" class="bg-white shadow rounded-lg p-6 border border-slate-100">
      <div class="flex justify-between items-start mb-4">
        <div class="h-6 bg-slate-200 rounded w-1/3"></div>
        <div class="h-6 bg-slate-200 rounded-full w-20"></div>
      </div>
      <div class="space-y-2 mb-4">
        <div class="h-4 bg-slate-100 rounded w-full"></div>
        <div class="h-4 bg-slate-100 rounded w-5/6"></div>
      </div>
      <div class="flex justify-between items-center pt-4 border-t border-slate-50">
        <div class="h-4 bg-slate-100 rounded w-1/4"></div>
        <div class="h-8 bg-slate-200 rounded w-24"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 3
  }
})
</script>
