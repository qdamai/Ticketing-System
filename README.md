<div align="center">
  <h1>🚀 DameDesk: Enterprise Ticketing System</h1>
  <p>Sistem helpdesk modern dengan manajemen peran, pelacakan SLA, real-time chat, dan analitik dashboard. Dirancang untuk kecepatan, efisiensi, dan keamanan skala Enterprise.</p>
</div>

---

## 🌟 Key Features

*   **⏱️ SLA Timer & Tracking:** Memastikan setiap keluhan pelanggan ditangani sesuai dengan batas waktu Service Level Agreement (SLA). Indikator warna dinamis untuk tiket yang mendekati batas waktu.
*   **🤖 AI Smart Summarizer:** Integrasi dengan Google Gemini AI untuk merangkum deskripsi tiket yang panjang menjadi satu kalimat padat, menghemat waktu Admin dalam membaca masalah.
*   **🔒 Role-Based Access Control (RBAC):** Sistem manajemen peran yang tegas antara Admin (memproses tiket) dan User (membuat tiket), dengan perlindungan *route* di sisi frontend dan backend (Firestore Rules).
*   **💬 Real-time Chat System:** Komunikasi instan antara Admin dan User dalam memecahkan masalah tiket tanpa perlu me-refresh halaman.
*   **📝 Internal Notes:** Ruang diskusi rahasia khusus sesama Admin di dalam tiket yang tidak dapat dilihat oleh User.
*   **📊 Advanced Analytics Dashboard:** Visualisasi data menggunakan Chart.js untuk memantau performa departemen, distribusi masalah, dan statistik penyelesaian tiket.
*   **📁 Secure Media Uploads:** Mendukung unggahan gambar dan dokumen bukti melalui integrasi Cloudinary dengan *progress bar* real-time.
*   **🌓 Elegant Dark Mode:** Pengalaman UI yang nyaman di mata dengan mode gelap otomatis dan kustomisasi sakelar tema manual.
*   **🕵️‍♂️ Audit Trail / Timeline:** Transparansi penuh dengan log aktivitas yang mencatat setiap aksi pada tiket (pembuatan, perubahan status, eskalasi).
*   **🔔 Browser Push Notifications:** Memberi tahu Admin dan User secara instan ketika ada pembaruan tiket, meskipun *tab* browser sedang tidak aktif.

---

## 🛠️ Tech Stack

*   **Frontend Framework:** Vue 3 (Composition API) + Vite
*   **State Management:** Pinia
*   **Styling & UI:** Tailwind CSS v3
*   **Database & Authentication:** Google Firebase (Firestore, Auth)
*   **Cloud Functions:** Firebase Cloud Functions (Node.js)
*   **Media Storage:** Cloudinary
*   **Data Visualization:** Chart.js & vue-chartjs
*   **AI Integration:** Google Generative AI (Gemini Pro)
*   **Report Generation:** SheetJS (xlsx)

---

## 📸 Preview Screenshots

> *(Screenshot placeholders - Tambahkan gambar asli setelah deploy)*

| User Dashboard (Light Mode) | Admin Console (Dark Mode) |
| :---: | :---: |
| ![User Dashboard](https://via.placeholder.com/600x350.png?text=User+Dashboard) | ![Admin Analytics](https://via.placeholder.com/600x350.png?text=Admin+Analytics) |

| Smart AI Summarizer & Audit Trail | Real-time Chat & Media Upload |
| :---: | :---: |
| ![Ticket Detail](https://via.placeholder.com/600x350.png?text=Ticket+Detail+View) | ![Chat Box](https://via.placeholder.com/600x350.png?text=Real-time+Chat) |

---

## 📂 Project Structure

```text
damedesk-app/
├── public/                 # Static assets (favicon, dll)
├── functions/              # Firebase Cloud Functions backend
├── src/
│   ├── assets/             # Gambar lokal dan resources UI
│   ├── components/         # Komponen Vue yang dapat digunakan ulang (Reusable)
│   │   ├── ChatBox.vue
│   │   ├── InternalNotes.vue
│   │   ├── RatingModal.vue
│   │   ├── TicketTimer.vue
│   │   └── TicketTimeline.vue
│   ├── composables/        # Custom Vue Hooks (Logic sharing)
│   │   ├── useNotifications.js
│   │   └── useNativeNotification.js
│   ├── router/             # Konfigurasi Vue Router & Navigation Guards
│   ├── services/           # Logika API eksternal (Firebase, Logger, Storage)
│   ├── stores/             # Global State Management (Pinia)
│   ├── views/              # Halaman Utama (Pages)
│   │   ├── AdminAnalytics.vue
│   │   ├── Dashboard.vue
│   │   ├── KnowledgeBase.vue
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   ├── TicketDetail.vue
│   │   └── TicketForm.vue
│   ├── App.vue             # Komponen Root
│   └── main.js             # Entry point aplikasi
├── .env                    # Environment variables (TIDAK DIBAGIKAN KE GITHUB)
├── firebase.json           # Konfigurasi deployment Firebase
└── tailwind.config.js      # Konfigurasi utilitas Tailwind CSS
```

---

## 🚀 How to Run (Local Development)

### Prasyarat
*   Node.js (versi 18+)
*   Akun Firebase dengan proyek yang sudah dibuat
*   Akun Cloudinary untuk penyimpanan gambar
*   API Key Google Gemini

### Instalasi Langkah-demi-Langkah

1.  **Clone Repository**
    ```bash
    git clone https://github.com/username/DameDesk.git
    cd DameDesk
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables (.env)**
    Buat file `.env` di root direktori (selevel dengan `package.json`). *Lihat bagian **Security Note** di bawah untuk format lengkapnya.*

4.  **Jalankan Development Server**
    ```bash
    npm run dev
    ```
    Buka `http://localhost:5173` di browser.

---

## 🛡️ Security Note

Proyek ini menggunakan variabel lingkungan (`.env`) untuk melindungi kredensial sensitif. **JANGAN PERNAH** meng-commit file `.env` ke Git. File `.env` sudah secara default dimasukkan ke dalam `.gitignore`.

Format file `.env` yang dibutuhkan untuk menjalankan aplikasi ini:

```env
# Konfigurasi Firebase Console
VITE_FIREBASE_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX"
VITE_FIREBASE_AUTH_DOMAIN="namaproyek-xxxx.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="namaproyek-xxxx"
VITE_FIREBASE_STORAGE_BUCKET="namaproyek-xxxx.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:1234567890:web:xxxxxxxxxxxxxxxxx"
VITE_FIREBASE_MEASUREMENT_ID="G-XXXXXXXXXX"

# Konfigurasi Gemini AI (Untuk Summarizer)
VITE_GEMINI_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX"
```

Jika Anda mendeploy aplikasi ini ke platform seperti Vercel atau Netlify, pastikan untuk memasukkan variabel-variabel di atas ke menu **Environment Variables** di dashboard platform tersebut.