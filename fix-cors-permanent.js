import { Storage } from '@google-cloud/storage';

const storage = new Storage({ keyFilename: 'service-account.json.json' });

async function setCors() {
  console.log('🔍 Menarik daftar bucket dari project...');
  
  try {
    const [buckets] = await storage.getBuckets();
    
    if (buckets.length === 0) {
      console.log('⚠️ Tidak ada bucket ditemukan dalam project ini.');
      return;
    }

    for (const bucket of buckets) {
      console.log(`📡 Memasang CORS pada bucket: ${bucket.name}...`);
      await bucket.setCorsConfiguration([
        {
          maxAgeSeconds: 3600,
          method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
          origin: ['*'],
          responseHeader: ['Content-Type', 'Authorization', 'x-goog-resumable'],
        },
      ]);
      console.log(`✅ BERHASIL! CORS terpasang pada: ${bucket.name}`);
    }
  } catch (error) {
    console.error('❌ GAGAL:', error.message);
  }
}

setCors();
