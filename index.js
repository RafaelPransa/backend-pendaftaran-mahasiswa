// Panggil library
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Panggil konfigurasi database
// const db = require('./src/config/db');

// Inisialisasi express
const app = express();
const PORT = process.env.PORT || 5000;

// Aktifkan CORS agar front-end bisa mengakses API
app.use(cors());

// Izinkan express untuk membaca data format JSON dari front-end
app.use(express.json());

// Panggil dan daftarkan route auth
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

// Membuat rute API pertama
app.get('/', (req, res) => {
  res.send('Halo server backend sudah berjalan.');
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});
