#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const {
  DB_NAME = 'babyeyipro2',
  DB_USER = 'root',
  DB_PASSWORD = '',
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  SEED_SCHOOL_NAME = 'Babyeyi System',
  SEED_SCHOOL_CODE = 'BABYEYI-001',
  SEED_SCHOOL_ADDRESS = 'Kigali, Rwanda',
  SEED_ADMIN_NAME = 'Super Admin',
  SEED_ADMIN_EMAIL = 'admin@babyeyi.local',
  SEED_ADMIN_PASSWORD = 'Password123!',
  SEED_ADMIN_PHONE = '+250780000000'
} = process.env;

const schemaPath = path.resolve(__dirname, '../database/schema.sql');

const log = (...args) => console.log('[bootstrap]', ...args);

async function dropDatabase() {
  log(`Dropping database ${DB_NAME} if it exists...`);
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD || undefined,
    multipleStatements: true,
  });

  await connection.query(`DROP DATABASE IF EXISTS \`${DB_NAME}\`;`);
  log(`Database ${DB_NAME} dropped.`);
  await connection.end();
}

async function createDatabase() {
  log(`Connecting to MySQL on ${DB_HOST}:${DB_PORT}...`);
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD || undefined,
    multipleStatements: true,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  log(`Database ${DB_NAME} created or already exists.`);
  await connection.end();
}

async function runSchema() {
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found at ${schemaPath}`);
  }

  const schema = fs.readFileSync(schemaPath, 'utf8');
  log('Running schema SQL...');

  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD || undefined,
    database: DB_NAME,
    multipleStatements: true,
  });

  await connection.query(schema);
  await connection.end();
  log('Database schema initialized.');
}

async function seedTenant() {
  const { sequelize, School, Role, User, Block, Location, Group, RoutineActivity, RoutineTimeSlot } = require('../models');

  log('Authenticating Sequelize...');
  await sequelize.authenticate();

  log('Synchronizing Sequelize models...');
  await sequelize.sync();
  log('Sequelize models synchronized.');

  log('Seeding tenant school...');
  const [school] = await School.findOrCreate({
    where: { code: SEED_SCHOOL_CODE },
    defaults: {
      name: SEED_SCHOOL_NAME,
      organization_type: 'School',
      code: SEED_SCHOOL_CODE,
      email: SEED_ADMIN_EMAIL,
      phone: null,
      address: SEED_SCHOOL_ADDRESS,
      logo_url: null,
      status: 'Active',
    },
  });

  log(`School tenant ${school.name} (${school.code}) ready.`);

  const [adminRole] = await Role.findOrCreate({
    where: { school_id: school.id, name: 'SchoolAdmin' },
    defaults: {
      school_id: school.id,
      name: 'SchoolAdmin',
      description: 'Master administrator for the school',
      is_system: true,
    },
  });

  log('SchoolAdmin role ready.');

  const [adminUser, created] = await User.findOrCreate({
    where: { email: SEED_ADMIN_EMAIL },
    defaults: {
      name: SEED_ADMIN_NAME,
      email: SEED_ADMIN_EMAIL,
      phone: SEED_ADMIN_PHONE,
      password: SEED_ADMIN_PASSWORD,
      school_id: school.id,
      role_id: adminRole.id,
      status: 'active',
    },
  });

  if (created) {
    log(`Admin user created: ${adminUser.email}`);
  } else {
    log(`Admin user already exists: ${adminUser.email}`);
  }

  log('Seeding initial infrastructure...');
  const [blockA] = await Block.findOrCreate({
    where: { school_id: school.id, name: 'Academic Block A' },
    defaults: {
      school_id: school.id,
      name: 'Academic Block A',
      code: 'BLKA',
      description: 'Primary & O-Level Classrooms'
    }
  });

  const [blockB] = await Block.findOrCreate({
    where: { school_id: school.id, name: 'Science Center' },
    defaults: {
      school_id: school.id,
      name: 'Science Center',
      code: 'SCI',
      description: 'Laboratories & Research'
    }
  });

  log('Blocks seeded.');

  const locationsToSeed = [
    { school_id: school.id, block_id: blockA.id, name: 'Room A1', type: 'Classroom', capacity: 45 },
    { school_id: school.id, block_id: blockA.id, name: 'Room A2', type: 'Classroom', capacity: 45 },
    { school_id: school.id, block_id: blockB.id, name: 'Physics Lab', type: 'Laboratory', capacity: 30 },
    { school_id: school.id, block_id: blockB.id, name: 'Chemistry Lab', type: 'Laboratory', capacity: 30 },
    { school_id: school.id, name: 'Home Classroom', type: 'Classroom', is_virtual: true, resolution_type: 'target_group_homeroom' },
    { school_id: school.id, name: 'Refectory', type: 'Other', capacity: 200 },
  ];

  const seededLocations = {};
  for (const loc of locationsToSeed) {
    const [location] = await Location.findOrCreate({
      where: { school_id: loc.school_id, name: loc.name },
      defaults: loc
    });
    seededLocations[loc.name] = location;
  }

  log(`Locations seeded: ${Object.keys(seededLocations).join(', ')}`);

  log('Seeding academic structure...');
  const [academicYear] = await sequelize.models.AcademicYear.findOrCreate({
    where: { school_id: school.id, name: '2024-2025' },
    defaults: {
      school_id: school.id,
      name: '2024-2025',
      start_date: '2024-01-10',
      end_date: '2024-12-05',
      status: 'active'
    }
  });

  const termsData = [
    { name: 'Term 1', start_date: '2024-01-10', end_date: '2024-03-28', is_active: true },
    { name: 'Term 2', start_date: '2024-04-08', end_date: '2024-07-25', is_active: false },
    { name: 'Term 3', start_date: '2024-08-05', end_date: '2024-12-05', is_active: false },
  ];

  const terms = {};
  for (const t of termsData) {
    const [term] = await sequelize.models.Term.findOrCreate({
      where: { academic_year_id: academicYear.id, name: t.name },
      defaults: {
        academic_year_id: academicYear.id,
        name: t.name,
        start_date: t.start_date,
        end_date: t.end_date,
        is_active: t.is_active
      }
    });
    terms[t.name] = term;
  }

  const levelsData = [
    { name: 'Primary', code: 'PRI', display_order: 1 },
    { name: 'O Level', code: 'OLE', display_order: 2 },
    { name: 'A Level', code: 'ALE', display_order: 3 },
  ];

  const levels = {};
  for (const l of levelsData) {
    const [level] = await sequelize.models.Level.findOrCreate({
      where: { school_id: school.id, name: l.name },
      defaults: { ...l, school_id: school.id }
    });
    levels[l.name] = level;
  }

  const gradesData = [
    { level: 'Primary', name: 'P1', number: 1 },
    { level: 'Primary', name: 'P2', number: 2 },
    { level: 'O Level', name: 'S1', number: 7 },
  ];

  const grades = {};
  for (const g of gradesData) {
    const [grade] = await sequelize.models.Grade.findOrCreate({
      where: { level_id: levels[g.level].id, name: g.name },
      defaults: { 
        level_id: levels[g.level].id, 
        name: g.name, 
        grade_number: g.number,
        code: g.name 
      }
    });
    grades[g.name] = grade;
  }

  const groupMap = {};
  for (const gradeName of Object.keys(grades)) {
    const [agroup] = await sequelize.models.AcademicGroup.findOrCreate({
      where: { academic_year_id: academicYear.id, grade_id: grades[gradeName].id },
      defaults: {
        school_id: school.id,
        academic_year_id: academicYear.id,
        grade_id: grades[gradeName].id,
        name: `${gradeName} ${academicYear.name}`
      }
    });
    groupMap[gradeName] = agroup;
  }

  log('Seeding modular groups...');
  const groupsToSeed = [
    { name: 'All Teachers', type: 'System', resolution_type: 'users_with_role', resolution_config: { role: 'Teacher' } },
    { name: 'Principal Office', type: 'Administrative', resolution_type: 'users_with_role', resolution_config: { role: 'Principal' } },
    { name: 'P1 Students', type: 'Academic', resolution_type: 'grade_students', resolution_config: { grade_name: 'P1' } },
    { name: 'Football Club', type: 'Extracurricular', resolution_type: 'static' },
  ];

  const seededGroups = {};
  for (const g of groupsToSeed) {
    const [group] = await Group.findOrCreate({
      where: { school_id: school.id, name: g.name },
      defaults: { ...g, school_id: school.id }
    });
    seededGroups[g.name] = group;
  }
  log(`Groups seeded: ${Object.keys(seededGroups).join(', ')}`);

  log('Seeding routine templates...');
  const routinesData = [
    { name: 'Standard Full Day', description: 'Regular academic day with periods and breaks' },
    { name: 'Half Day (Friday)', description: 'Shortened day for Friday prayers/activities' },
    { name: 'Examination Mode', description: 'Strict timing for exams with no breaks' },
    { name: 'Staff Only / Training', description: 'Non-student day for staff development' },
  ];

  const routines = {};
  for (const r of routinesData) {
    const [routine] = await sequelize.models.RoutineTemplate.findOrCreate({
      where: { school_id: school.id, name: r.name },
      defaults: { ...r, school_id: school.id }
    });
    routines[r.name] = routine;
  }

  const standardDay = routines['Standard Full Day'];
  const slotsData = [
    { start_time: '07:30:00', end_time: '08:00:00', duration_minutes: 30, activity: 'Morning Assembly', resp: 'Principal Office', loc: 'Refectory' },
    { start_time: '08:00:00', end_time: '08:40:00', duration_minutes: 40, activity: 'Period 1', resp: 'All Teachers', loc: 'Home Classroom' },
    { start_time: '08:40:00', end_time: '09:20:00', duration_minutes: 40, activity: 'Period 2', resp: 'All Teachers', loc: 'Home Classroom' },
  ];

  for (const s of slotsData) {
    const [slot] = await RoutineTimeSlot.findOrCreate({
      where: { template_id: standardDay.id, start_time: s.start_time },
      defaults: { template_id: standardDay.id, start_time: s.start_time, end_time: s.end_time, duration_minutes: s.duration_minutes }
    });

    log(`Linking Activity: ${s.activity} | Resp: ${s.resp} (${seededGroups[s.resp]?.id}) | Loc: ${s.loc} (${seededLocations[s.loc]?.id})`);

    await RoutineActivity.findOrCreate({
      where: { slot_id: slot.id, name: s.activity },
      defaults: { 
        slot_id: slot.id, 
        name: s.activity, 
        is_attendance_point: true,
        responsible_group_id: seededGroups[s.resp]?.id,
        location_id: seededLocations[s.loc]?.id
      }
    });
  }

  log('Tenant bootstrap complete.');
}

async function run() {
  try {
    const shouldReset = process.env.RESET_DB === 'true' || process.argv.includes('--reset');
    if (shouldReset) {
      await dropDatabase();
    }
    await createDatabase();
    await runSchema();
    await seedTenant();
    log('Bootstrap process finished successfully.');
    process.exit(0);
  } catch (error) {
    console.error('[bootstrap] Error:', error.message || error);
    process.exit(1);
  }
}

run();
