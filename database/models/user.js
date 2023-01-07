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

exports.bulkDelete = async (body) => {
  let exist = [],
    notExist = [];
  const ids = body.ids;

  for (let i = 0; i < ids.length; i++) {
    const user = await pool.query(
      `DELETE FROM userInfo WHERE id = $1 RETURNING*;`,
      [ids[i]]
    );
    if (user.rows.length) exist.push(user.rows);
    else notExist.push(ids[i]);
  }

  return { exist, notExist };
};

exports.addAdminUser = async (id) => {
  let role = 'admin';
  const user = await pool.query(
    `UPDATE userInfo SET role = $1 WHERE id = $2 RETURNING*;`,
    [role, id]
  );

  return user.rows;
};
