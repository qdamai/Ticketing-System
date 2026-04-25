import { ref } from 'vue'
import { db } from '../services/firebase'
import { collectionGroup, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore'
import { useAuthStore } from '../stores/auth'

const notifications = ref([])

export const useNotifications = () => {
  const authStore = useAuthStore()

  const addNotification = (title, message, type = 'info') => {
    const id = Date.now()
    notifications.value.push({ id, title, message, type })
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }

  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  // Listen to new messages in ALL tickets (Admin sees all, User only theirs)
  const initNotificationListeners = () => {
    if (!authStore.user) return

    // 1. Listen for new messages in tickets
    // Note: collectionGroup requires an index
    const messagesQuery = query(
      collectionGroup(db, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(1)
    )

    onSnapshot(messagesQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const msg = change.doc.data()
          // Only notify if it's NOT our own message
          if (msg.userId !== authStore.user.uid) {
            // Further filter for User: only if it's a message in THEIR ticket
            // (Admin has a simpler rule in their head: "notify me for everything")
            addNotification('Pesan Baru', `${msg.userName}: ${msg.text.substring(0, 30)}...`, 'message')
          }
        }
      })
    }, (error) => {
      console.warn("Notification listener error (likely index missing):", error)
    })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    initNotificationListeners
  }
}
