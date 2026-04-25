const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { GoogleGenerativeAI } = require("@google/generative-ai");

admin.initializeApp();
const db = admin.firestore();

// KONFIGURASI GEMINI AI
const genAI = new GoogleGenerativeAI("AIzaSyDCLL1kbNY1XecpU6uu6WHSrB5dJdCuCVk");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

/**
 * Cloud Function: Smart Auto-Reply
 * Membalas chat user secara otomatis berdasarkan kata kunci
 */
exports.smartAutoReply = functions.firestore
    .document("tickets/{ticketId}/messages/{messageId}")
    .onCreate(async (snap, context) => {
      const message = snap.data();
      const ticketId = context.params.ticketId;

      if (message.userName === "DameBot") return null;

      const text = message.text.toLowerCase();
      let reply = "";

      if (text.includes("password") || text.includes("lupa sandi")) {
        reply = "Halo! Jika Anda lupa password, silakan buka menu Knowledge Base dan cari artikel 'Reset Password'. Jika masih berkendala, Admin kami akan segera membantu.";
      } else if (text.includes("halo") || text.includes("permisi") || text.includes("pagi") || text.includes("siang")) {
        reply = "Halo! Terima kasih telah menghubungi DameDesk. Tim kami akan segera meninjau tiket Anda. Mohon tunggu sebentar ya!";
      }

      if (reply) {
        return db.collection("tickets").doc(ticketId).collection("messages").add({
          text: reply,
          userName: "DameBot",
          userId: "system",
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          isAutoReply: true,
        });
      }
      return null;
    });

/**
 * Cloud Function: AI Summarizer (REAL GEMINI INTEGRATION)
 * Membuat ringkasan tiket otomatis saat tiket baru dibuat
 */
exports.aiSummarizer = functions.firestore
    .document("tickets/{ticketId}")
    .onCreate(async (snap, context) => {
      const ticket = snap.data();
      const ticketId = context.params.ticketId;

      const prompt = `Anda adalah asisten helpdesk profesional. 
      Ringkas masalah tiket berikut dalam maksimal 1 kalimat yang sangat padat untuk admin. 
      Tiket: "${ticket.title} - ${ticket.description}"`;

      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        return db.collection("tickets").doc(ticketId).update({
          aiSummary: summary,
        });
      } catch (error) {
        console.error("Gemini AI Error:", error);
        return db.collection("tickets").doc(ticketId).update({
          aiSummary: "AI Summary: (Gagal memproses ringkasan)",
        });
      }
    });
