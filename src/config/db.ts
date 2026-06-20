import { Pool } from 'pg';

// Konfigurasi koneksi
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});

// Uji koneksi ke database
pool.connect((err, client, release) => {
  if (err) {
    return console.error(
      'Gagal menyambungkan ke database PostgreSQL:',
      err.stack,
    );
  }
  console.log('Koneksi ke database PostgreSQL Berhasil!');
  if (release) release(); //Kembalikan koneksi ke pool
});

export default pool;
