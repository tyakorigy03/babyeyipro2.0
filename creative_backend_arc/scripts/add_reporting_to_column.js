const { sequelize } = require('../models');

async function run() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // 1. Check if column exists
    const [results] = await sequelize.query("SHOW COLUMNS FROM staff LIKE 'reporting_to_id'");
    if (results.length === 0) {
      console.log('Adding column reporting_to_id...');
      await sequelize.query(`
        ALTER TABLE staff 
        ADD COLUMN reporting_to_id CHAR(36) DEFAULT NULL,
        ADD CONSTRAINT fk_staff_reporting_to FOREIGN KEY (reporting_to_id) REFERENCES users(id) ON DELETE SET NULL;
      `);
      console.log('Column reporting_to_id added successfully.');
    } else {
      console.log('Column reporting_to_id already exists.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Failed to run migration:', error);
    process.exit(1);
  }
}

run();
