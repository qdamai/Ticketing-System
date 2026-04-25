import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI SDK
const apiKey = import.meta.env.VITE_GEMINI_API_KEY
let genAI = null
let model = null

if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey)
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    console.log("Berhasil inisialisasi model Gemini:", model.model)
  } catch (err) {
    console.error("Gagal inisialisasi Gemini AI:", err)
  }
} else {
  console.warn("VITE_GEMINI_API_KEY tidak ditemukan di .env")
}

/**
 * Fungsi untuk membuat ringkasan tiket otomatis untuk Admin
 * @param {string} title - Judul tiket
 * @param {string} description - Deskripsi lengkap tiket
 * @returns {Promise<string>} - Ringkasan dalam 1 kalimat
 */
export const generateTicketSummary = async (title, description) => {
  if (!model) return "Ringkasan gagal dibuat."

  try {
    const prompt = `Anda adalah asisten helpdesk. Buat ringkasan sangat singkat (max 1 kalimat) dari tiket ini untuk Admin:
Subjek: ${title}
Masalah: ${description}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  } catch (error) {
    console.warn("Gemini Error:", error)
    return "Ringkasan gagal dibuat."
  }
}
