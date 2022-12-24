const { Pool } = require('pg');
const { config } = require('../../config/env');

const pool = new Pool({
  user: config.user,
  host: config.host,
  database: config.database,
  password: config.password,
  port: config.databasePort,
});

module.exports = pool;
