import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

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

async function inject() {
  try {
    console.log("Sedang mencoba menanam data...");
    const docRef = await addDoc(collection(db, "tickets"), {
      title: "Laporan dari Bang Damai",
      description: "Ini testing tanam data via CMD pertama kali.",
      status: "open",
      createdAt: new Date().toISOString()
    });
    console.log("✅ BERHASIL! Data masuk dengan ID:", docRef.id);
    process.exit(0);
  } catch (e) {
    console.error("❌ GAGAL tanam data:", e);
    process.exit(1);
  }
}

inject();