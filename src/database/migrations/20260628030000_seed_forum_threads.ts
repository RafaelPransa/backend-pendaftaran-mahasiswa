import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const users = await knex('users').where({ role: 'student' }).select('id');
  if (users.length === 0) return;

  const user1 = users[0].id;
  const user2 = users[1] ? users[1].id : user1;
  const user3 = users[2] ? users[2].id : user1;

  // Insert threads
  const insertedThreads = await knex('forum_threads').insert([
    {
      user_id: user1,
      judul: 'Tips dan Trik Lulus Mata Kuliah Kriptografi Lanjut?',
      konten: 'Halo semuanya, saya agak kesulitan mengikuti materi minggu ketiga tentang Elliptic Curve Cryptography. Apakah ada rekomendasi buku atau referensi yang mudah dipahami?',
      kategori: 'Mata Kuliah',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    },
    {
      user_id: user2,
      judul: 'Panduan Pengisian KRS Semester Ganjil 2026/2027',
      konten: 'Teman-teman sekalian, bagi yang bingung cara pengisian KRS, pastikan sudah melunasi UKT terlebih dahulu ya, karena jika belum, menu KRS di sidebar tidak akan terbuka. Jika sudah lunas dan menu belum muncul, silakan laporkan ke BAAK.',
      kategori: 'Akademik',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    },
    {
      user_id: user3,
      judul: 'Ada yang tahu jadwal pendaftaran Beasiswa PPA?',
      konten: 'Selamat pagi, mau bertanya apakah info pendaftaran beasiswa PPA semester ini sudah dirilis oleh kemahasiswaan? Terima kasih.',
      kategori: 'Umum',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    }
  ]).returning('*');

  const t1 = insertedThreads[0];
  const t2 = insertedThreads[1];

  // Insert replies
  if (t1) {
    await knex('forum_replies').insert([
      {
        thread_id: t1.id,
        user_id: user2,
        konten: 'Coba baca buku "Cryptography and Network Security" oleh William Stallings. Di situ penjelasannya cukup runtut dan visual.',
        created_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000)
      },
      {
        thread_id: t1.id,
        user_id: user3,
        konten: 'Betul, Stallings bagus. Atau coba tonton playlist YouTube dari Computerphile, mereka punya video penjelasan ECC yang sangat intuitif.',
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000)
      }
    ]);
  }

  if (t2) {
    await knex('forum_replies').insert([
      {
        thread_id: t2.id,
        user_id: user1,
        konten: 'Sangat membantu infonya! Kemarin saya sempat bingung kenapa menunya tidak ada, ternyata status UKT saya masih menunggu verifikasi.',
        created_at: new Date(Date.now() - 20 * 60 * 60 * 1000)
      }
    ]);
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex('forum_replies').del();
  await knex('forum_threads').del();
}
