import { ref } from 'vue'

export function useNativeNotification() {
  const permissionGranted = ref(Notification.permission === 'granted')

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      console.warn('Browser ini tidak mendukung desktop notification')
      return false
    }

    if (Notification.permission === 'granted') {
      permissionGranted.value = true
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      permissionGranted.value = permission === 'granted'
      return permissionGranted.value
    }

    return false
  }

  const sendNotification = (title, options = {}) => {
    if (!permissionGranted.value || document.visibilityState === 'visible') {
      return // Hanya kirim jika tab tidak aktif
    }

    const notification = new Notification(title, {
      icon: '/favicon.svg', // Pastikan icon ada
      ...options
    })

    notification.onclick = () => {
      window.focus()
      if (options.data && options.data.url) {
        window.location.href = options.data.url
      }
      notification.close()
    }
  }

  return {
    permissionGranted,
    requestPermission,
    sendNotification
  }
}
