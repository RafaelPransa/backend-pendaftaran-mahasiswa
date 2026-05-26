// Panggil library
const express = require('express');
const cors = require('cors');

// Inisialisasi express
const app = express();
const port = 3000;

// Aktifkan CORS agar front-end bisa mengakses API
app.use(cors());

// Izinkan express untuk membaca data format JSON dari front-end
app.use(express.json());

// Membuat rute API pertama
app.get('/', (req, res) => {
  res.send('Halo server backend sudah berjalan.');
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server backend berjalan di http://localhost:${port}`);
});
