const pool = require('../dbConnect/pool');

exports.addNewJogging = async (body) => {
  const newJogging = await pool.query(
    `INSERT INTO jogging (time, distance, user_id) VALUES ($1, $2, $3) RETURNING*;`,
    [body.time, body.distance, body.id]
  );

  return newJogging.rows;
};

exports.getJoggingById = async (id) => {
  const jogging = await pool.query(`SELECT * FROM jogging WHERE id = $1;`, [
    id,
  ]);

  return jogging.rows;
};

exports.deleteJoggingById = async (id) => {
  const jogging = await pool.query(
    `DELETE FROM jogging WHERE id = $1 RETURNING*;`,
    [id]
  );

  return jogging.rows;
};

exports.updateJoggingById = async (body, params) => {
  const jogging = await pool.query(
    `UPDATE jogging SET distance = $1, time = $2 WHERE id = $3 RETURNING*;`,
    [body.distance, body.time, params]
  );

  return jogging.rows;
};

exports.getAllJogging = async (body, page, limit) => {
  let jogging;
  const currentPage = (page - 1) * limit;
  if (body.isAdmin) {
    jogging = await pool.query(`SELECT * FROM jogging OFFSET $1 LIMIT $2;`, [
      currentPage,
      limit,
    ]);
  } else {
    jogging = await pool.query(
      `SELECT * FROM jogging WHERE user_id = $1 OFFSET $2 LIMIT $3;`,
      [body.id, currentPage, limit]
    );
  }

  return jogging.rows;
};

exports.bulkDelete = async (body) => {
  const admin = body.admin;
  const ids = body.ids;
  const userId = body.userId;
  let exist = [],
    notExist = [];

  if (admin) {
    for (let i = 0; i < ids.length; i++) {
      const jogging = await pool.query(
        `DELETE FROM jogging WHERE id = $1 RETURNING*;`,
        [ids[i]]
      );
      if (jogging.rows.length) exist.push(jogging.rows);
      else notExist.push(ids[i]);
    }
  } else {
    for (let i = 0; i < ids.length; i++) {
      const jogging = await pool.query(
        `DELETE FROM jogging WHERE id = $1 AND user_id = $2 RETURNING*;`,
        [ids[i], userId]
      );
      if (jogging.rows.length) exist.push(jogging.rows);
      else notExist.push(ids[i]);
    }
  }

  return { exist, notExist };
};

exports.bulkUpdate = async (data) => {
  let result = [];
  const body = data.body,
    time = data.time;

  for (let i = 0; i < body.length; i++) {
    const jogging = await pool.query(
      `UPDATE jogging SET distance = $1, time = $2 WHERE id = $3 RETURNING *;`,
      [body[i].distance, time[i], body[i].id]
    );
    if (jogging.rows) result.push(jogging.rows);
  }

  return result;
};
