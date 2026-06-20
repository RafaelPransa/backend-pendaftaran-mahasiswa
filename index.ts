import express from 'express';
import cors from 'cors';

// Panggil konfigurasi database jika diperlukan untuk pre-connect
// import './src/config/db';

import authRoutes from './src/routes/authRoutes';
import biodataRoutes from './src/routes/biodataRoutes';
import dokumenRoutes from './src/routes/dokumenRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Aktifkan CORS agar front-end bisa mengakses API
app.use(cors());

// Izinkan express untuk membaca data format JSON dari front-end
app.use(express.json());

// Daftarkan route
app.use('/api/auth', authRoutes);
app.use('/api/biodata', biodataRoutes);
app.use('/api/dokumen', dokumenRoutes);

// Membuat rute API pertama
app.get('/', (req, res) => {
  res.send('Halo server backend sudah berjalan.');
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});
