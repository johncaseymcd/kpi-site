const { Client } = require("pg");

const getClient = () => {
  const params = {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  };

  return new Client(params);
};

const selectAllMembers = client => {
  const sql = `
    SELECT * FROM people.members
  `;

  const params = [];

  client
    .query(sql, params)
    .then(res => {
      if (res.rows) {
        return res.rows;
      } else {
        return [];
      }
    })
    .catch(err => {
      throw new Error("client.query err", err);
    });
};

const addMember = (client, name, birthday) => {
  const sql = `
    INSERT INTO people.members
    VALUES $1, $2
    ON CONFLICT name
    DO NOTHING
  `;

  const params = [name, birthday];

  client
    .query(sql, params)
    .then(() => {
      return true;
    })
    .catch(err => {
      console.error("client.query err", err);
      return false;
    });
};

const deleteMember = (client, memberId) => {
  const sql = `
    DELETE FROM people.members
    WHERE memberId = $1
  `;

  const params = [memberId];

  client
    .query(sql, params)
    .then(() => {
      return true;
    })
    .catch(err => {
      console.error("client.query err", err);
      return false;
    });
};

module.exports = {
  getClient,
  selectAllMembers,
  addMember,
  deleteMember,
};
