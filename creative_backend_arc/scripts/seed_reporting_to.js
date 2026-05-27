const { sequelize, Staff } = require('../models');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Alice's user_id: '51d0b2d1-2264-4b14-9084-610e906e9efb' (Administrator)
    const aliceUserId = '51d0b2d1-2264-4b14-9084-610e906e9efb';

    // 1. Set Marie-Claire's manager to Alice
    await Staff.update(
      { reporting_to_id: aliceUserId },
      { where: { user_id: 'aa51113d-a6e2-4abd-8423-4124de35f5ed' } }
    );
    console.log('Updated Marie-Claire to report to Alice.');

    // 2. Set Jean-Luc's manager to Alice
    await Staff.update(
      { reporting_to_id: aliceUserId },
      { where: { user_id: '0a4c9244-0136-4740-9569-70fe63c78cd1' } }
    );
    console.log('Updated Jean-Luc to report to Alice.');

    // 3. Set Eric's manager to Alice
    await Staff.update(
      { reporting_to_id: aliceUserId },
      { where: { user_id: 'da7fd392-40c3-451b-b9a6-2820d24499b5' } }
    );
    console.log('Updated Eric to report to Alice.');

    console.log('Reporting structure seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
