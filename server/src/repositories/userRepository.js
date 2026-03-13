const db = require('../config/database');

const findByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
  return result.rows[0];
};

const create = async (user) => {
  const { nama_lengkap, email, password, role } = user;
  const result = await db.query(
    'INSERT INTO users (nama_lengkap, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [nama_lengkap, email, password, role]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const query = `
    SELECT 
      u.id, u.nama_lengkap, u.email, u.role, u.session_id,
      p.tanggal_lahir, p.alamat, p.no_hp, 
      p.status_pendidikan as pendidikan, 
      p.status_pekerjaan as pekerjaan, 
      p.status_pernikahan, 
      p.jumlah_anak, 
      p.riwayat_keguguran, 
      p.jenis_komplikasi_kehamilan as komplikasi_hamil_ini, 
      p.riwayat_gangguan_kejiwaan as riwayat_kesehatan_jiwa, 
      p.jenis_komplikasi_persalinan as komplikasi_persalinan_lalu,
      CASE WHEN p.id IS NOT NULL THEN true ELSE false END as profile_completed
    FROM users u
    LEFT JOIN profiles p ON u.id = p.user_id
    WHERE u.id = $1
  `;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const update = async (id, userData) => {
  const {
    tanggal_lahir,
    alamat,
    no_hp,
    pendidikan,
    pekerjaan,
    status_pernikahan,
    jumlah_anak,
    riwayat_keguguran,
    komplikasi_hamil_ini,
    riwayat_kesehatan_jiwa,
    komplikasi_persalinan_lalu
  } = userData;

  // Determine boolean flags based on frontend selection
  const memiliki_komplikasi_kehamilan = komplikasi_hamil_ini && komplikasi_hamil_ini !== 'Tidak Ada';
  const memiliki_komplikasi_persalinan = komplikasi_persalinan_lalu && 
                                         komplikasi_persalinan_lalu !== 'Tidak Ada' && 
                                         komplikasi_persalinan_lalu !== 'Tidak Ada / Kehamilan Pertama';

  // Parse jumlah_anak to integer (handling frontend string options)
  let jumlah_anak_int = 0;
  if (jumlah_anak) {
    const jaLower = (jumlah_anak || "").toString().toLowerCase();
    if (jaLower === "satu") jumlah_anak_int = 1;
    else if (jaLower === "dua") jumlah_anak_int = 2;
    else if (jaLower === "tiga") jumlah_anak_int = 3;
    else if (jaLower.includes("lebih")) jumlah_anak_int = 4;
    else jumlah_anak_int = parseInt(jumlah_anak) || 0;
  }

  // Check if profile exists for this user
  const check = await db.query('SELECT id FROM profiles WHERE user_id = $1', [id]);

  if (check.rows.length > 0) {
    // UPDATE existing profile
    const result = await db.query(
      `UPDATE profiles
       SET tanggal_lahir = $1, alamat = $2, no_hp = $3, status_pendidikan = $4, status_pekerjaan = $5,
           status_pernikahan = $6, jumlah_anak = $7, riwayat_keguguran = $8,
           memiliki_komplikasi_kehamilan = $9, jenis_komplikasi_kehamilan = $10,
           riwayat_gangguan_kejiwaan = $11, memiliki_komplikasi_persalinan = $12, jenis_komplikasi_persalinan = $13
       WHERE user_id = $14 RETURNING *`,
      [
        tanggal_lahir, alamat, no_hp, pendidikan, pekerjaan,
        status_pernikahan, jumlah_anak_int, riwayat_keguguran,
        memiliki_komplikasi_kehamilan, komplikasi_hamil_ini,
        riwayat_kesehatan_jiwa, memiliki_komplikasi_persalinan, komplikasi_persalinan_lalu,
        id
      ]
    );
    return result.rows[0];
  } else {
    // INSERT new profile
    const result = await db.query(
      `INSERT INTO profiles (
         user_id, tanggal_lahir, alamat, no_hp, status_pendidikan, status_pekerjaan,
         status_pernikahan, jumlah_anak, riwayat_keguguran,
         memiliki_komplikasi_kehamilan, jenis_komplikasi_kehamilan,
         riwayat_gangguan_kejiwaan, memiliki_komplikasi_persalinan, jenis_komplikasi_persalinan
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        id, tanggal_lahir, alamat, no_hp, pendidikan, pekerjaan,
        status_pernikahan, jumlah_anak_int, riwayat_keguguran,
        memiliki_komplikasi_kehamilan, komplikasi_hamil_ini,
        riwayat_kesehatan_jiwa, memiliki_komplikasi_persalinan, komplikasi_persalinan_lalu
      ]
    );
    return result.rows[0];
  }
};

const findAll = async (role) => {
  let query = `
    SELECT u.id, u.nama_lengkap, u.email, u.role, u.created_at,
           p.no_hp, p.alamat, p.status_pendidikan, p.status_pekerjaan
    FROM users u
    LEFT JOIN profiles p ON u.id = p.user_id
  `;
  const params = [];
  if (role) {
    query += ` WHERE u.role = $1`;
    params.push(role);
  }
  query += ` ORDER BY u.created_at DESC`;
  
  const result = await db.query(query, params);
  return result.rows;
};

const updateSession = async (userId, sessionId) => {
  const result = await db.query(
    'UPDATE users SET session_id = $1 WHERE id = $2 RETURNING *',
    [sessionId, userId]
  );
  return result.rows[0];
};

const remove = async (id) => {
  // Manual cascade delete for safety if DB constraints are not set to CASCADE
  await db.query('DELETE FROM screenings WHERE user_id = $1', [id]);
  await db.query('DELETE FROM profiles WHERE user_id = $1', [id]);
  const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = {
  findByEmail,
  create,
  findById,
  update,
  findAll,
  updateSession,
  remove
};
