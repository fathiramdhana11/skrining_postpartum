const db = require('../config/database');

const create = async (screeningData) => {
  const { user_id, total_score, kategori, jawaban_json, flag_bunuh_diri, profile_snapshot } = screeningData;
  const result = await db.query(
    `INSERT INTO screenings (user_id, total_score, kategori, jawaban_json, flag_bunuh_diri, profile_snapshot) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [user_id, total_score, kategori, jawaban_json, flag_bunuh_diri, profile_snapshot]
  );
  return result.rows[0];
};

const findByUserId = async (user_id) => {
  const result = await db.query(
    `SELECT s.*, TRIM(hb.nama_lengkap) as handled_by_name
     FROM screenings s
     LEFT JOIN users hb ON s.handled_by = hb.id
     WHERE s.user_id = $1 AND s.deleted_at IS NULL 
     ORDER BY s.waktu_skrining DESC`,
    [user_id]
  );
  return result.rows;
};

const findAll = async () => {
  const result = await db.query(
    `SELECT s.*, u.nama_lengkap, p.no_hp, TRIM(hb.nama_lengkap) as handled_by_name
     FROM screenings s 
     JOIN users u ON s.user_id = u.id 
     LEFT JOIN profiles p ON u.id = p.user_id
     LEFT JOIN users hb ON s.handled_by = hb.id
     WHERE s.deleted_at IS NULL
     ORDER BY s.waktu_skrining DESC`
  );
  return result.rows;
};

const deleteById = async (id) => {
  // Soft delete: set deleted_at timestamp instead of actually deleting
  const result = await db.query(
    'UPDATE screenings SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *',
    [id]
  );
  return result.rows[0];
};

const updateNotes = async (id, catatan_nakes, status_penanganan, handled_by, tindakan_nakes, soap_s, soap_o, soap_a, soap_p) => {
  const result = await db.query(
    `UPDATE screenings 
     SET catatan_nakes = $2, 
         status_penanganan = $3, 
         handled_by = $4, 
         tindakan_nakes = $5,
         soap_s = $6,
         soap_o = $7,
         soap_a = $8,
         soap_p = $9,
         handled_at = NOW() 
     WHERE id = $1 RETURNING *`,
    [id, catatan_nakes, status_penanganan, handled_by, tindakan_nakes, soap_s, soap_o, soap_a, soap_p]
  );
  return result.rows[0];
};

module.exports = {
  create,
  findByUserId,
  findAll,
  deleteById,
  updateNotes
};
