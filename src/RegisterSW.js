import { registerSW } from 'virtual:pwa-register'

export const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Update tersedia! Reload untuk memperbarui?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})
