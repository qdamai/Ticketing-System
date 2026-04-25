import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAFvMd0QNbKIeOpJ6SZzIfVFB1xSz4YdNI",
  authDomain: "dame-desk-project.firebaseapp.com",
  projectId: "dame-desk-project",
  storageBucket: "dame-desk-project.firebasestorage.app",
  messagingSenderId: "821927319115",
  appId: "1:821927319115:web:7224cb69f0a1a279a71fce",
  measurementId: "G-10KERYNXG4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const dummyUsers = [
  {
    uid: "dummy_admin_1",
    name: "Admin DameDesk",
    email: "admin@damedesk.com",
    role: "admin",
    createdAt: new Date().toISOString()
  },
  {
    uid: "dummy_user_1",
    name: "Andi Saputra",
    email: "andi@gmail.com",
    role: "customer",
    createdAt: new Date().toISOString()
  },
  {
    uid: "dummy_user_2",
    name: "Siti Aminah",
    email: "siti@gmail.com",
    role: "customer",
    createdAt: new Date().toISOString()
  }
];

const dummyTickets = [
  {
    title: "Printer Lantai 2 Macet",
    description: "Sudah dicoba restart tapi tetap tidak bisa print dokumen warna.",
    category: "Technical",
    status: "Open",
    userName: "Andi Saputra",
    userId: "dummy_user_1"
  },
  {
    title: "Request Upgrade RAM Laptop",
    description: "Laptop mulai lemot saat buka banyak tab Chrome. Mohon upgrade ke 16GB.",
    category: "Technical",
    status: "In-Progress",
    userName: "Siti Aminah",
    userId: "dummy_user_2"
  },
  {
    title: "Masalah Tagihan Internet",
    description: "Tagihan bulan ini naik 2x lipat tanpa ada pemberitahuan perubahan paket.",
    category: "Billing",
    status: "Resolved",
    userName: "Budi Santoso",
    userId: "dummy_user_3"
  },
  {
    title: "Akses VPN Tidak Terhubung",
    description: "Muncul error 404 saat mencoba koneksi ke server pusat via VPN GlobalProtect.",
    category: "Technical",
    status: "Open",
    userName: "Dewi Lestari",
    userId: "dummy_user_4"
  },
  {
    title: "Ganti Lampu Ruangan Meeting",
    description: "Lampu di ruang rapat utama berkedip-kedip, sangat mengganggu.",
    category: "General",
    status: "Closed",
    userName: "Eko Prasetyo",
    userId: "dummy_user_5"
  }
];

const seedData = async () => {
  console.log("🚀 Memulai proses tanam data (Users & Tickets)...");
  
  try {
    // Tanam Users
    console.log("\n👥 Menanam Data Users...");
    for (const user of dummyUsers) {
      const { uid, ...userData } = user;
      await setDoc(doc(db, "users", uid), userData);
      console.log(`✅ User ditanam: ${user.name} (${user.role})`);
    }

    // Tanam Tickets
    console.log("\n🎫 Menanam Data Tickets...");
    const ticketsCol = collection(db, "tickets");
    for (const ticket of dummyTickets) {
      await addDoc(ticketsCol, {
        ...ticket,
        createdAt: serverTimestamp()
      });
      console.log(`✅ Tiket ditanam: ${ticket.title}`);
    }
    
    console.log("\n✨ Semua data dummy (Users & Tickets) berhasil ditanam!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Gagal menanam data:", error);
    process.exit(1);
  }
};

seedData();
