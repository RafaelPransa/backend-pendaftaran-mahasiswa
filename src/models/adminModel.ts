import knex from 'knex';
import config from '../../knexfile';

const db = knex(config.development);

export interface ProgramStudi {
  id?: string;
  kode: string;
  nama: string;
  fakultas: string;
}

// =========================================================================
// FEATURE 3: CRUD Program Studi
// =========================================================================

export async function getAllProdi(): Promise<any[]> {
  return await db('program_studi').select('*').orderBy('nama', 'asc');
}

export async function getProdiById(id: string): Promise<any | undefined> {
  return await db('program_studi').where({ id }).first();
}

export async function createProdi(data: ProgramStudi): Promise<any> {
  const [newProdi] = await db('program_studi').insert(data).returning('*');
  return newProdi;
}

export async function updateProdi(id: string, data: Partial<ProgramStudi>): Promise<any> {
  const [updatedProdi] = await db('program_studi')
    .where({ id })
    .update(data)
    .returning('*');
  return updatedProdi;
}

export async function deleteProdi(id: string): Promise<number> {
  return await db('program_studi').where({ id }).del();
}

export async function getProdiByKode(kode: string): Promise<any | undefined> {
  return await db('program_studi').where({ kode }).first();
}

// =========================================================================
// FEATURE 4: CRUD Pengumuman
// =========================================================================

export interface Pengumuman {
  id?: string;
  judul: string;
  konten: string;
  kategori: string;
}

export async function getAllPengumuman(): Promise<any[]> {
  return await db('pengumuman').select('*').orderBy('created_at', 'desc');
}

export async function getPengumumanById(id: string): Promise<any | undefined> {
  return await db('pengumuman').where({ id }).first();
}

export async function createPengumuman(data: Pengumuman): Promise<any> {
  const [newPengumuman] = await db('pengumuman').insert(data).returning('*');
  return newPengumuman;
}

export async function updatePengumuman(id: string, data: Partial<Pengumuman>): Promise<any> {
  const [updatedPengumuman] = await db('pengumuman')
    .where({ id })
    .update(data)
    .returning('*');
  return updatedPengumuman;
}

export async function deletePengumuman(id: string): Promise<number> {
  return await db('pengumuman').where({ id }).del();
}

