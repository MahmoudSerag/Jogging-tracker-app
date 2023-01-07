const pool = require('../dbConnect/pool');

exports.signUp = async (body) => {
  const newUser = await pool.query(
    `INSERT INTO userInfo (password, name, email) VALUES ($1, $2, $3) RETURNING *;`,
    [body.password, body.name, body.email]
  );

  return newUser.rows;
};

exports.signIn = async (email) => {
  const user = await pool.query(
    `SELECT email, id, password, name, role FROM userInfo WHERE email = $1;`,
    [email]
  );

  return user.rows;
};
