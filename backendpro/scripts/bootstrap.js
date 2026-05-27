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
  DB_DIALECT = 'mysql',
  SEED_SCHOOL_NAME = 'Babyeyi Demo School',
  SEED_SCHOOL_DOMAIN = 'demo.babyeyi.local',
  SEED_SCHOOL_CODE = 'BABYEYI-001',
  SEED_SCHOOL_ADDRESS = 'Kigali, Rwanda',
  SEED_ADMIN_NAME = 'Super Admin',
  SEED_ADMIN_EMAIL = 'admin@babyeyi.local',
  SEED_ADMIN_PASSWORD = 'Password123!'
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
  const { sequelize, School, Role, User } = require('../models');

  log('Authenticating Sequelize...');
  await sequelize.authenticate();

  log('Synchronizing Sequelize models...');
  await sequelize.sync({ alter: true });
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
    if (adminUser.school_id !== school.id) {
      log('Warning: existing user is associated with a different school.');
    }
  }

  log('Tenant bootstrap complete.');
  log('Use the following admin credentials to login:');
  log(`  email: ${SEED_ADMIN_EMAIL}`);
  log(`  password: ${SEED_ADMIN_PASSWORD}`);
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
    process.exit(0);
  } catch (error) {
    console.error('[bootstrap] Error:', error.message || error);
    process.exit(1);
  }
}

run();
