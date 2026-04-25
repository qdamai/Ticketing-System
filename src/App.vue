<template>
  <div :class="{ 'dark': isDark }">
    <div class="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
      <router-view></router-view>
      
      <!-- Global Notification System -->
      <NotificationToast />

      <!-- Dark Mode Toggle Floating Button -->
      <button @click="toggleDarkMode" 
        class="fixed bottom-6 left-6 z-50 p-4 bg-white dark:bg-slate-800 shadow-xl rounded-full border border-slate-200 dark:border-slate-700 hover:scale-110 transition-all duration-300 text-slate-500 dark:text-amber-400">
        <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from './stores/auth'
import { useNotifications } from './composables/useNotifications'
import NotificationToast from './components/NotificationToast.vue'

const authStore = useAuthStore()
const { initNotificationListeners } = useNotifications()

// --- Dark Mode Logic ---
const isDark = ref(localStorage.getItem('theme') === 'dark')

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

// --- Heartbeat & Notifications ---
let heartbeatInterval = null

const startHeartbeat = () => {
  heartbeatInterval = setInterval(() => {
    if (authStore.isLoggedIn && document.visibilityState === 'visible') {
      authStore.updateOnlineStatus(true)
    }
  }, 5 * 60 * 1000)
}

const handleVisibilityChange = () => {
  if (authStore.isLoggedIn) {
    const isOnline = document.visibilityState === 'visible'
    authStore.updateOnlineStatus(isOnline)
  }
}

onMounted(async () => {
  startHeartbeat()
  window.addEventListener('visibilitychange', handleVisibilityChange)
  
  // Initialize notifications after auth is ready
  await authStore.init()
  if (authStore.isLoggedIn) {
    initNotificationListeners()
  }
})

onUnmounted(() => {
  if (heartbeatInterval) clearInterval(heartbeatInterval)
  window.removeEventListener('visibilitychange', handleVisibilityChange)
})

// Re-init listeners if user logs in
watch(() => authStore.isLoggedIn, (newVal) => {
  if (newVal) initNotificationListeners()
})
</script>

<style>
/* Global Dark Mode Smooth Transition */
html.dark {
  background-color: #0f172a; /* bg-slate-900 */
}
</style>
