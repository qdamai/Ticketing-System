import { db } from './firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useAuthStore } from '../stores/auth'

/**
 * Logs an activity to a specific ticket's subcollection 'logs'
 * @param {string} ticketId - The ID of the ticket
 * @param {string} action - The action description (e.g., 'Tiket dibuat', 'Status diubah menjadi In-Progress')
 * @param {string} type - Action type ('create', 'update', 'status', 'department', 'note')
 */
export const logTicketActivity = async (ticketId, action, type = 'update') => {
  try {
    const authStore = useAuthStore()
    
    // Determine the actor
    let actorName = 'System'
    let actorRole = 'system'
    
    if (authStore.user) {
      actorName = authStore.displayName || 'Unknown User'
      actorRole = authStore.isAdmin ? 'Admin' : 'User'
    }

    await addDoc(collection(db, 'tickets', ticketId, 'logs'), {
      action,
      type,
      actor: actorName,
      actorRole,
      createdAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Failed to write audit log:', error)
  }
}
