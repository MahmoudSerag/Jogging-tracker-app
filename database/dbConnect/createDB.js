const client = require('./client');
const { config } = require('../../config/env');

exports.createDB = async () => {
  try {
    await client.connect();

    const database = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1;`,
      [config.currentDatabase]
    );

    if (!database.rowCount) {
      await client.query(`CREATE DATABASE ${config.currentDatabase};`);
      // eslint-disable-next-line no-console
      console.log(`Database: ${config.currentDatabase} Created Successfully.`);
    } else {
      // eslint-disable-next-line no-console
      console.log(`Database: ${config.currentDatabase} Already Exist.`);
    }

    await client.end();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
