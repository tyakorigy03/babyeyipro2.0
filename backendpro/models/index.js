'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const { sequelize } = require('../config/database');
const db = {};

db.NotificationPolicy = require('./communication/NotificationPolicy');
db.ChatRoom = require('./communication/ChatRoom');

// --- Global / Agency Models ---
db.AgentStation = require('./global/AgentStation');
db.Agent = require('./global/Agent');
db.AgentTransaction = require('./global/AgentTransaction');

// Note: In a production app, you would define associations here
// e.g. db.Agent.belongsTo(db.AgentStation)

// Recursive function to find all .js files
const loadModels = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      loadModels(fullPath);
    } else if (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    ) {
      const model = require(fullPath);
      db[model.name] = model;
    }
  });
};

loadModels(__dirname);

// 2. Setup associations if they exist
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// --- Global Audit Hooks ---
// These hooks intercept every update/delete across the entire system
sequelize.addHook('afterUpdate', async (instance, options) => {
  if (instance.constructor.name === 'AuditLog' || instance.constructor.name === 'SmartCardLog') return;
  
  try {
    await db.AuditLog.create({
      school_id: instance.school_id || null,
      user_id: options.user_id || null, // Passed in from the controller via options
      action: 'UPDATE',
      table_name: instance.constructor.tableName,
      record_id: instance.id,
      old_values: instance._previousDataValues,
      new_values: instance.dataValues
    });
  } catch (err) {
    console.error('Audit Log Update Error:', err);
  }
});

sequelize.addHook('afterDestroy', async (instance, options) => {
  if (instance.constructor.name === 'AuditLog') return;

  try {
    await db.AuditLog.create({
      school_id: instance.school_id || null,
      user_id: options.user_id || null,
      action: 'DELETE',
      table_name: instance.constructor.tableName,
      record_id: instance.id,
      old_values: instance._previousDataValues,
      new_values: null
    });
  } catch (err) {
    console.error('Audit Log Delete Error:', err);
  }
});

module.exports = db;
