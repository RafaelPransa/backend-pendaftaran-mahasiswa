import type { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function up(knex: Knex): Promise<void> {
  // 1. Drop existing default constraint first so PostgreSQL allows type cast
  await knex.raw("ALTER TABLE users ALTER COLUMN role DROP DEFAULT");

  // 2. Update any existing roles to match new values ('admin' and 'staff' to 'staf administration')
  await knex('users')
    .whereIn('role', ['admin', 'staff'])
    .update({ role: 'staf administration' });

  // 3. Create the ENUM type for roles
  await knex.raw("CREATE TYPE user_role AS ENUM ('student', 'staf administration')");

  // 4. Alter column type with USING cast
  await knex.raw("ALTER TABLE users ALTER COLUMN role TYPE user_role USING role::user_role");

  // 5. Set default value to 'student'
  await knex.raw("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'student'::user_role");

  // 5. Seed default staff administration account if not exists
  const staffEmail = 'admin@crypto.ac.id';
  const staffExist = await knex('users').where({ email: staffEmail }).first();
  if (!staffExist) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await knex('users').insert({
      nama_lengkap: 'Staf Administrasi',
      nik: '1234567890123456',
      nomor_wa: '081234567890',
      email: staffEmail,
      password: hashedPassword,
      role: 'staf administration'
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  // Convert column back to VARCHAR
  await knex.raw("ALTER TABLE users ALTER COLUMN role DROP DEFAULT");
  await knex.raw("ALTER TABLE users ALTER COLUMN role TYPE VARCHAR(50) USING role::VARCHAR(50)");
  await knex.raw("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'student'");
  
  // Drop the ENUM type
  await knex.raw("DROP TYPE IF EXISTS user_role");
}
