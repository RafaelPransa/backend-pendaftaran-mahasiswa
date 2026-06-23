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
