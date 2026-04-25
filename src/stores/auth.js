import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth, db } from '../services/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const userData = ref(null)
  const loading = ref(true)

  const isAdmin = computed(() => userData.value?.role === 'admin')
  const isLoggedIn = computed(() => !!user.value)
  const displayName = computed(() => userData.value?.name || user.value?.email || 'Pengguna')

  let initialized = false

  const init = () => {
    if (initialized) return Promise.resolve()
    initialized = true
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          user.value = firebaseUser
          await fetchUserData(firebaseUser.uid)
        } else {
          user.value = null
          userData.value = null
        }
        loading.value = false
        resolve()
      })
    })
  }

  const fetchUserData = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        userData.value = docSnap.data()
        await updateOnlineStatus(true)
      }
    } catch (e) {
      console.error('Gagal mengambil data user:', e)
    }
  }

  const updateOnlineStatus = async (status) => {
    if (!user.value) return
    try {
      await updateDoc(doc(db, 'users', user.value.uid), {
        isOnline: status,
        lastSeen: serverTimestamp()
      })
    } catch (error) {
      console.error("Error updating online status:", error)
    }
  }

  const register = async (name, email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    const userData_ = {
      name,
      email,
      role: 'customer',
      createdAt: new Date().toISOString()
    }
    await setDoc(doc(db, 'users', cred.user.uid), userData_)
    user.value = cred.user
    userData.value = userData_
  }

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    user.value = cred.user
    await fetchUserData(cred.user.uid)
  }

  const logout = async () => {
    await updateOnlineStatus(false)
    await signOut(auth)
    user.value = null
    userData.value = null
  }

  return {
    user, userData, loading,
    isAdmin, isLoggedIn, displayName,
    init, register, login, logout, fetchUserData, updateOnlineStatus
  }
})
