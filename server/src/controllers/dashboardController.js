const pool = require('../config/database');

const getDashboardStats = async (req, res) => {
  try {
    const { period } = req.query; // '7days', '30days', '6months'

    // 1. Stats Cards
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'pasien') as total_pasien,
        (SELECT COUNT(*) FROM screenings WHERE waktu_skrining >= NOW() - INTERVAL '30 days') as total_screening_month,
        (SELECT COUNT(*) FROM screenings WHERE total_score >= 13 OR jawaban_json::jsonb->9 = '1' OR jawaban_json::jsonb->9 = '2' OR jawaban_json::jsonb->9 = '3') as total_high_risk,
        (SELECT COUNT(*) FROM screenings WHERE jawaban_json::jsonb->9 != '0') as total_q10_risk
    `;
    const statsResult = await pool.query(statsQuery);

    // 2. Recent Activity (Last 5 screenings)
    const activityQuery = `
      SELECT s.id, u.nama_lengkap, s.waktu_skrining, s.kategori, s.total_score, s.status_penanganan
      FROM screenings s
      JOIN users u ON s.user_id = u.id
      ORDER BY s.waktu_skrining DESC
      LIMIT 5
    `;
    const activityResult = await pool.query(activityQuery);

    // 2.5 High Risk Activity (Last 5 High Risk screenings)
    const highRiskQuery = `
      SELECT s.id, u.nama_lengkap, s.waktu_skrining, s.kategori, s.total_score, s.status_penanganan, s.flag_bunuh_diri, p.no_hp
      FROM screenings s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE s.total_score >= 13 OR s.flag_bunuh_diri = true
      ORDER BY s.waktu_skrining DESC
      LIMIT 10
    `;
    const highRiskResult = await pool.query(highRiskQuery);

    // 3. Risk Distribution (For Pie Chart) - Harmonized
    const riskQuery = `
      SELECT 
        CASE 
          WHEN total_score <= 8 THEN 'Tidak Ada Gejala Depresi'
          WHEN total_score BETWEEN 9 AND 12 THEN 'Perlu Skrining Ulang'
          ELSE 'Terindikasi Gejala Depresi'
        END as kategori,
        COUNT(*) as count
      FROM screenings
      GROUP BY 1
    `;
    const riskResult = await pool.query(riskQuery);
    
    // 3.5 Status Handling Distribution
    const statusQuery = `
      SELECT status_penanganan, COUNT(*) as count
      FROM screenings
      WHERE total_score >= 13 OR jawaban_json::jsonb->9 != '0' -- Only for high risk
      GROUP BY status_penanganan
    `;
    const statusResult = await pool.query(statusQuery);

    // 4. Trends (Screenings per day for last 7/30 days)
    let interval = '7 days';
    if (period === '30days') interval = '30 days';
    if (period === '3months') interval = '90 days';
    if (period === '6months') interval = '180 days';

    // Count Trend
    const trendsQuery = `
      SELECT TO_CHAR(waktu_skrining, 'YYYY-MM-DD') as date, COUNT(*) as count
      FROM screenings
      WHERE waktu_skrining >= NOW() - INTERVAL '${interval}'
      GROUP BY TO_CHAR(waktu_skrining, 'YYYY-MM-DD')
      ORDER BY date
    `;
    const trendsResult = await pool.query(trendsQuery);
    
    // Avg Score Trend
    const scoreTrendQuery = `
      SELECT TO_CHAR(waktu_skrining, 'YYYY-MM-DD') as date, ROUND(AVG(total_score), 1) as avg_score
      FROM screenings
      WHERE waktu_skrining >= NOW() - INTERVAL '${interval}'
      GROUP BY TO_CHAR(waktu_skrining, 'YYYY-MM-DD')
      ORDER BY date
    `;
    const scoreTrendResult = await pool.query(scoreTrendQuery);
    
    // Demographics Correlation (Risk by Number of Children)
    const demographicsQuery = `
      WITH risk_data AS (
        SELECT 
          CASE WHEN p.jumlah_anak = 1 THEN 'Anak Pertama'
               WHEN p.jumlah_anak > 1 THEN 'Multigravida'
               ELSE 'Tidak diketahui' END as group_name,
          CASE WHEN s.total_score >= 13 THEN 1 ELSE 0 END as is_risk
        FROM users u
        JOIN profiles p ON u.id = p.user_id
        JOIN screenings s ON u.id = s.user_id
        WHERE p.jumlah_anak IS NOT NULL
      )
      SELECT group_name, SUM(is_risk) as risk_count, COUNT(*) as total_count
      FROM risk_data
      GROUP BY group_name
      ORDER BY group_name
    `;
    
    let demographicsResult = { rows: [] };
    try {
        demographicsResult = await pool.query(demographicsQuery);
    } catch(e) { console.log('Demographics query skipped/failed', e.message); }


    res.json({
      stats: {
        totalPasien: parseInt(statsResult.rows[0].total_pasien),
        totalScreeningMonth: parseInt(statsResult.rows[0].total_screening_month),
        totalHighRisk: parseInt(statsResult.rows[0].total_high_risk),
        totalQ10Risk: parseInt(statsResult.rows[0].total_q10_risk)
      },
      recentActivity: activityResult.rows,
      highRiskActivity: highRiskResult.rows,
      riskDistribution: riskResult.rows,
      statusDistribution: statusResult.rows,
      trends: trendsResult.rows,
      scoreTrend: scoreTrendResult.rows,
      demographics: demographicsResult.rows
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardStats
};
