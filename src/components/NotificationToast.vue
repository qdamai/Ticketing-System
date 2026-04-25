<template>
  <div class="fixed bottom-6 right-6 z-[100] flex flex-col space-y-3 pointer-events-none">
    <transition-group name="toast">
      <div v-for="n in notifications" :key="n.id" 
        class="pointer-events-auto bg-white dark:bg-slate-800 border-l-4 rounded-xl shadow-2xl p-4 flex items-start space-x-3 w-80 transform transition-all duration-300"
        :class="typeClass(n.type)">
        
        <div class="flex-1">
          <p class="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">{{ n.title }}</p>
          <p class="text-sm font-bold text-slate-700 dark:text-slate-200">{{ n.message }}</p>
        </div>

        <button @click="removeNotification(n.id)" class="text-slate-400 hover:text-slate-600 dark:hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useNotifications } from '../composables/useNotifications'

const { notifications, removeNotification } = useNotifications()

const typeClass = (type) => {
  switch (type) {
    case 'message': return 'border-emerald-500'
    case 'status': return 'border-blue-500'
    case 'error': return 'border-red-500'
    default: return 'border-slate-400'
  }
}
</script>

<style scoped>
.toast-enter-from { opacity: 0; transform: translateX(100px); }
.toast-leave-to { opacity: 0; transform: scale(0.9); }
</style>
