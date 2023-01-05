const pool = require('./pool');
const { config } = require('../../config/env');

exports.createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS userInfo (
        id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL DEFAULT 'user',
        password VARCHAR(255) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS jogging (
        id INT PRIMARY KEY NOT NULL GENERATED ALWAYS AS IDENTITY,
        date TIMESTAMP NOT NULL DEFAULT NOW(),
        time TIME NOT NULL,
        distance INT NOT NULL,
        user_id INT REFERENCES userInfo(id) ON DELETE CASCADE
      );
    `);

    // eslint-disable-next-line no-console
    console.log(`Tables Created At Database: ${config.currentDatabase}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};
