const pool = require('../dbConnect/pool');

exports.getAllUsers = async (page, limit) => {
  const currentPage = (page - 1) * limit;

  const users = await pool.query(
    `SELECT email, name, id, role FROM userInfo OFFSET $1 LIMIT $2;`,
    [currentPage, limit]
  );

  return users.rows;
};

exports.getUserById = async (id) => {
  const user = await pool.query(
    `SELECT id, email, name, role, password FROM userInfo WHERE id = $1;`,
    [id]
  );

  return user.rows;
};

exports.deleteUserById = async (id) => {
  const user = await pool.query(
    `DELETE FROM userInfo WHERE id = $1 RETURNING *;`,
    [id]
  );

  return user.rows;
};

exports.updateUserById = async (id, body) => {
  const user = await pool.query(
    `UPDATE userInfo SET email = $1, name = $2, password = $3 WHERE id = $4 RETURNING*;`,
    [body.email, body.name, body.password, id]
  );

  return user.rows;
};

exports.deleteMany = async (ids) => {
  let result = [];

  for (let i = 0; i < ids.length; i++) {
    const user = await pool.query(
      `DELETE FROM userInfo WHERE id = $1 RETURNING*;`,
      [ids[i]]
    );
    result.push(user.rows);
  }

  return result;
};
