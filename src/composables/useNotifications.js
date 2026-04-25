import { ref } from 'vue'
import { db } from '../services/firebase'
import { collectionGroup, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore'
import { useAuthStore } from '../stores/auth'
import { useNativeNotification } from './useNativeNotification'

const notifications = ref([])

export const useNotifications = () => {
  const authStore = useAuthStore()
  const { sendNotification, requestPermission } = useNativeNotification()

  const addNotification = (title, message, type = 'info') => {
    const id = Date.now()
    notifications.value.push({ id, title, message, type })
    
    // Trigger Desktop Notification
    sendNotification(title, { body: message })

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }

  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  // Listen to new messages or ticket updates
  const initNotificationListeners = async () => {
    if (!authStore.user) return

    // Request desktop permission
    await requestPermission()

    if (authStore.isAdmin) {
      // 1. ADMIN MODE: Listen for new messages in ALL tickets
      const messagesQuery = query(
        collectionGroup(db, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(1)
      )

      onSnapshot(messagesQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const msg = change.doc.data()
            if (msg.userId !== authStore.user.uid) {
              addNotification('Pesan Baru (Admin)', `${msg.userName}: ${msg.text.substring(0, 30)}...`, 'message')
            }
          }
        })
      }, (error) => {
        console.warn("Notification listener error (Admin):", error)
      })
    } else {
      // 2. CUSTOMER MODE: Listen to specific tickets owned by user
      // Assuming 'tickets' collection updates when a message is sent (e.g. lastMessage field)
      // If not, at least they can be notified of status changes securely.
      const ticketsQuery = query(
        collection(db, 'tickets'),
        where('userId', '==', authStore.user.uid)
      )

      onSnapshot(ticketsQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'modified') {
            const ticket = change.doc.data()
            addNotification('Pembaruan Tiket', `Tiket "${ticket.title}" telah diperbarui.`, 'info')
          }
        })
      }, (error) => {
        console.warn("Notification listener error (Customer):", error)
      })
    }
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    initNotificationListeners
  }
}
