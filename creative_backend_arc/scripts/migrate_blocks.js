const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { v4: uuidv4 } = require('uuid');

const migrate = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('🚀 Starting Blocks Migration...');

  try {
    // 1. Create blocks table
    console.log('Creating blocks table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS blocks (
        id CHAR(36) PRIMARY KEY,
        school_id CHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50),
        description TEXT,
        deleted_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_block_per_school (school_id, name)
      ) ENGINE=InnoDB;
    `);

    // 2. Alter locations table
    console.log('Checking for block_id in locations...');
    const [columns] = await connection.query('SHOW COLUMNS FROM locations LIKE "block_id"');
    if (columns.length === 0) {
      console.log('Adding block_id to locations...');
      await connection.query('ALTER TABLE locations ADD COLUMN block_id CHAR(36) AFTER school_id');
      await connection.query('ALTER TABLE locations ADD CONSTRAINT fk_location_block FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE SET NULL');
    } else {
      console.log('block_id already exists in locations.');
    }

    // 3. Analyze existing locations and auto-assign blocks
    console.log('Analyzing existing locations for auto-assignment...');
    const [locations] = await connection.query('SELECT id, name, school_id FROM locations WHERE block_id IS NULL');
    
    const blocksMap = new Map(); // school_id + blockName -> blockId

    for (const loc of locations) {
      // Regex to find "Block [A-Z]" or "Building [A-Z]"
      const match = loc.name.match(/(Block|Building|Wing)\s+([A-Za-z0-9]+)/i);
      if (match) {
        const blockName = `${match[1]} ${match[2]}`;
        const key = `${loc.school_id}_${blockName.toLowerCase()}`;
        
        let blockId;
        if (blocksMap.has(key)) {
          blockId = blocksMap.get(key);
        } else {
          // Check if block already exists in DB
          const [existingBlocks] = await connection.query('SELECT id FROM blocks WHERE school_id = ? AND name = ?', [loc.school_id, blockName]);
          if (existingBlocks.length > 0) {
            blockId = existingBlocks[0].id;
          } else {
            // Create new block
            blockId = uuidv4();
            await connection.query('INSERT INTO blocks (id, school_id, name) VALUES (?, ?, ?)', [blockId, loc.school_id, blockName]);
            console.log(`Created block: ${blockName} for school: ${loc.school_id}`);
          }
          blocksMap.set(key, blockId);
        }

        // Update location
        await connection.query('UPDATE locations SET block_id = ? WHERE id = ?', [blockId, loc.id]);
        console.log(`Assigned location "${loc.name}" to block "${blockName}"`);
      }
    }

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await connection.end();
  }
};

migrate();
