const { sequelize, StaffAssignment } = require('../models');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    const assignments = [
      // Marie-Claire Uwineza (Registrar) -> Administrative Department
      {
        id: 'a1111111-1111-4111-a111-111111111111',
        user_id: 'aa51113d-a6e2-4abd-8423-4124de35f5ed',
        unit_id: 'c4421261-be09-4c38-bd10-53eaf3b50b9a',
        position_name: 'Registrar',
        is_primary: true
      },
      // Alice Umutoni (Administrator) -> Administrative Department
      {
        id: 'a2222222-2222-4222-a222-222222222222',
        user_id: '51d0b2d1-2264-4b14-9084-610e906e9efb',
        unit_id: 'c4421261-be09-4c38-bd10-53eaf3b50b9a',
        position_name: 'Administrator',
        is_primary: true
      },
      // Jean-Luc Ndayisenga (Teacher) -> Academic Department
      {
        id: 'a3333333-3333-4333-a333-333333333333',
        user_id: '0a4c9244-0136-4740-9569-70fe63c78cd1',
        unit_id: '4b983c9e-5e1f-4b6e-98ee-eda18fcf0f60',
        position_name: 'Teacher',
        is_primary: true
      },
      // Eric Mutabazi (Teacher) -> Academic Department
      {
        id: 'a4444444-4444-4444-a444-444444444444',
        user_id: 'da7fd392-40c3-451b-b9a6-2820d24499b5',
        unit_id: '4b983c9e-5e1f-4b6e-98ee-eda18fcf0f60',
        position_name: 'Teacher',
        is_primary: true
      }
    ];

    for (const a of assignments) {
      const [record, created] = await StaffAssignment.findOrCreate({
        where: { user_id: a.user_id },
        defaults: a
      });
      if (created) {
        console.log(`Created assignment for user ${a.user_id}`);
      } else {
        // Update it
        await record.update({ unit_id: a.unit_id, position_name: a.position_name });
        console.log(`Updated assignment for user ${a.user_id}`);
      }
    }

    console.log('Seeding finished successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
