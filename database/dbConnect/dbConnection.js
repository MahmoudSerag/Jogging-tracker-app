const pool = require('./pool');

exports.connectAsPool = async () => {
  try {
    const connection = await pool.connect();
    if (connection)
      /* eslint-disable */
      console.log('connected on port: 5432');
  } catch (error) {
    /* eslint-disable */
    console.log(error);
  }
};
