const { Client } = require('pg');
const { config } = require('../../config/env');

const client = new Client({
  user: config.user,
  host: config.host,
  database: config.defaultDatabase,
  password: config.password,
  port: config.databasePort,
});

module.exports = client;
