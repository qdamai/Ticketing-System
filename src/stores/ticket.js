import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '../services/firebase'
import {
  collection, addDoc, getDocs, updateDoc,
  deleteDoc, doc, query, where, orderBy, serverTimestamp
} from 'firebase/firestore'

export const useTicketStore = defineStore('ticket', () => {
  const tickets = ref([])
  const loading = ref(false)

  const fetchAllTickets = async () => {
    loading.value = true
    try {
      const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      tickets.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    } finally {
      loading.value = false
    }
  }

  const fetchMyTickets = async (userId) => {
    loading.value = true
    try {
      const q = query(
        collection(db, 'tickets'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
      const snap = await getDocs(q)
      tickets.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    } finally {
      loading.value = false
    }
  }

  const addTicket = async ({ title, description, category, userId, userName }) => {
    const docRef = await addDoc(collection(db, 'tickets'), {
      title, description, category,
      userId, userName,
      status: 'open',
      createdAt: serverTimestamp()
    })
    return docRef.id
  }

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, 'tickets', id), { status })
    const t = tickets.value.find(t => t.id === id)
    if (t) t.status = status
  }

  const deleteTicket = async (id) => {
    await deleteDoc(doc(db, 'tickets', id))
    tickets.value = tickets.value.filter(t => t.id !== id)
  }

  return { tickets, loading, fetchAllTickets, fetchMyTickets, addTicket, updateStatus, deleteTicket }
})
