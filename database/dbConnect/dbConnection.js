const pool = require('./pool');

exports.connectAsPool = async () => {
  try {
    const connection = await pool.connect();
    if (connection) console.log('connected on port: 5432');
  } catch (error) {
    console.log(error);
  }
};
