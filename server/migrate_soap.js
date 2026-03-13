const pool = require('./src/config/database');

async function migrate() {
  try {
    console.log('Starting SOAP migration...');
    
    await pool.query(`
      ALTER TABLE screenings 
      ADD COLUMN IF NOT EXISTS soap_s TEXT,
      ADD COLUMN IF NOT EXISTS soap_o TEXT,
      ADD COLUMN IF NOT EXISTS soap_a TEXT,
      ADD COLUMN IF NOT EXISTS soap_p TEXT
    `);
    
    console.log('Migration successful!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
