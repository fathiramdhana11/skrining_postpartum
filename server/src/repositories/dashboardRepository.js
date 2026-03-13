const db = require('../config/database');

const getStats = async () => {
  // 1. Total Pasien Active
  const totalPasienResult = await db.query(
    "SELECT COUNT(*) FROM users WHERE role = 'pasien'"
  );
  const totalPasien = parseInt(totalPasienResult.rows[0].count);

  // 2. Skrining Bulan Ini
  const screeningsThisMonthResult = await db.query(
    "SELECT COUNT(*) FROM screenings WHERE date_part('month', waktu_skrining) = date_part('month', CURRENT_DATE) AND date_part('year', waktu_skrining) = date_part('year', CURRENT_DATE)"
  );
  const totalScreeningMonth = parseInt(screeningsThisMonthResult.rows[0].count);

  // 3. Pasien Berisiko (High Risk) - Based on Category stored or Score > 12
  // Assuming 'kategori' field stores "Berisiko" text or similar. 
  // Safety fallback: total_score >= 10
  const highRiskResult = await db.query(
    "SELECT COUNT(*) FROM screenings WHERE total_score >= 10"
  );
  const totalHighRisk = parseInt(highRiskResult.rows[0].count);

  return { totalPasien, totalScreeningMonth, totalHighRisk };
};

const getRecentActivity = async () => {
  const result = await db.query(
    `SELECT s.id, s.total_score, s.kategori, s.waktu_skrining, u.nama_lengkap 
     FROM screenings s 
     JOIN users u ON s.user_id = u.id 
     ORDER BY s.waktu_skrining DESC 
     LIMIT 5`
  );
  return result.rows;
};

const getRiskDistribution = async () => {
    // Group by Category
    const result = await db.query(
        "SELECT kategori, COUNT(*) as count FROM screenings GROUP BY kategori"
    );
    return result.rows; // [{kategori: 'Normal', count: 5}, {kategori: 'Berisiko', count: 2}]
};

const getScreeningTrends = async (period = '7days') => {
    let intervalCondition = "NOW() - INTERVAL '7 days'";
    let dateFormat = 'YYYY-MM-DD';
    let groupBy = 'date';
    let orderBy = 'date ASC';

    if (period === '30days') {
        intervalCondition = "NOW() - INTERVAL '30 days'";
    } else if (period === '1year') {
        intervalCondition = "NOW() - INTERVAL '1 year'";
        dateFormat = 'Mon YYYY'; // 'Jan 2024'
        // For ordering by actual date, we need to group by truncated date too
    }

    let query = "";
    if (period === '1year') {
       query = `SELECT to_char(waktu_skrining, 'Mon YYYY') as date, COUNT(*) as count 
         FROM screenings 
         WHERE waktu_skrining >= ${intervalCondition} 
         GROUP BY to_char(waktu_skrining, 'Mon YYYY'), date_trunc('month', waktu_skrining)
         ORDER BY date_trunc('month', waktu_skrining) ASC`;
    } else {
       query = `SELECT to_char(waktu_skrining, '${dateFormat}') as date, COUNT(*) as count 
         FROM screenings 
         WHERE waktu_skrining >= ${intervalCondition} 
         GROUP BY date 
         ORDER BY date ASC`;
    }

    const result = await db.query(query);
    return result.rows; 
}

const getScoreTrend = async () => {
  // Average Score Trend over last 6 months (Monthly)
  const result = await db.query(
    `SELECT to_char(waktu_skrining, 'Mon YYYY') as period, 
            ROUND(AVG(total_score), 1) as avg_score 
     FROM screenings 
     WHERE waktu_skrining >= NOW() - INTERVAL '6 months' 
     GROUP BY to_char(waktu_skrining, 'Mon YYYY'), date_trunc('month', waktu_skrining) 
     ORDER BY date_trunc('month', waktu_skrining) ASC`
  );
  return result.rows;
};

const getRiskByDemographics = async () => {
  // Use COALESCE to fallback to 'profiles' table if snapshot is missing
  const result = await db.query(
    `SELECT 
       COALESCE(s.profile_snapshot::json->>'pendidikan', p.status_pendidikan, 'Tidak Ada Data') as demographic,
       COUNT(s.id) as total,
       SUM(CASE WHEN s.total_score >= 10 THEN 1 ELSE 0 END) as risk_count
     FROM screenings s
     LEFT JOIN profiles p ON s.user_id = p.user_id
     GROUP BY demographic
     HAVING COUNT(s.id) > 0
     ORDER BY risk_count DESC
     LIMIT 5`
  );
  return result.rows.map(row => ({
    demographic: row.demographic || 'Tidak Ada Data',
    total: parseInt(row.total),
    risk_count: parseInt(row.risk_count),
    risk_rate: Math.round((parseInt(row.risk_count) / parseInt(row.total)) * 100)
  }));
};

const getAllScreenings = async () => {
  const result = await db.query(
      `SELECT s.id, s.waktu_skrining, s.total_score, s.kategori, u.nama_lengkap
       FROM screenings s
       JOIN users u ON s.user_id = u.id
       ORDER BY s.waktu_skrining DESC`
  );
  return result.rows;
};

module.exports = {
  getStats,
  getRecentActivity,
  getRiskDistribution,
  getScreeningTrends,
  getScoreTrend,
  getRiskByDemographics,
  getAllScreenings
};
