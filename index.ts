import express from 'express';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './src/swagger.json';

// Panggil konfigurasi database jika diperlukan untuk pre-connect
// import './src/config/db';

import authRoutes from './src/routes/authRoutes';
import biodataRoutes from './src/routes/biodataRoutes';
import dokumenRoutes from './src/routes/dokumenRoutes';
import portalRoutes from './src/routes/portalRoutes';
import akademikRoutes from './src/routes/akademikRoutes';
import adminRoutes from './src/routes/adminRoutes';
import { apiLimiter, authLimiter, uploadLimiter } from './src/middlewares/rateLimiter';

const app = express();
const PORT = process.env.PORT || 5000;

// Aktifkan CORS agar front-end bisa mengakses API
app.use(cors());

// Izinkan express untuk membaca data format JSON dari front-end
app.use(express.json());

// Serve folder uploads secara statis agar bisa diakses oleh front-end
app.use('/uploads', express.static(path.join(__dirname, 'src/public/uploads')));

// Swagger UI Dokumentasi API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Terapkan rate limiter umum pada prefix /api
app.use('/api', apiLimiter);

// Daftarkan route
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/dokumen', uploadLimiter, dokumenRoutes);
app.use('/api/biodata', biodataRoutes);
app.use('/api/portal', portalRoutes);
app.use('/api/akademik', akademikRoutes);
app.use('/api/admin', adminRoutes);

// Membuat rute API pertama
app.get('/', (req, res) => {
  res.send('Halo server backend sudah berjalan.');
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server backend berjalan di http://localhost:${PORT}`);
});
