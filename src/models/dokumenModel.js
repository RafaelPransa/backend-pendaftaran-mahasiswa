const knex = require('../../knexfile');
const db = require('knex')(knex.development);

exports.create = async (documentData) => {
    const [newDoc] = await db('dokumen').insert(documentData).returning('*');
    return newDoc;
};

exports.findByUserId = async (userId) => {
    return await db('dokumen').where({ user_id: userId}).first();
};