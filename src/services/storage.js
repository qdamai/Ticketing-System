/**
 * Helper untuk upload file ke Cloudinary dengan dukungan progress bar
 */
export const uploadFile = (file, path, onProgress) => {
  // 1. ISI CLOUD NAME ABANG (Cek di Dashboard Cloudinary)
  const cloudName = 'ecogoals'; 
  
  // 2. NAMA PRESET YANG BARU ABANG BUAT
  const uploadPreset = 'ticketing'; 

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/upload`, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve(response.secure_url);
      } else {
        const error = JSON.parse(xhr.responseText);
        reject(new Error(error.error.message || 'Upload gagal'));
      }
    };

    xhr.onerror = () => reject(new Error('Network Error'));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', path);

    xhr.send(formData);
  });
};
