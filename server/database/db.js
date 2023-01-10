const { resolve } = require("path");
const { Client } = require("pg");

const getClient = async () => {
  const params = {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  };

  const client = new Client(params);
  return resolve(client);
};

const selectAllMembers = async client => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line quotes
    const sql = `SELECT * FROM people.members`;
    const params = [];

    client
      .query(sql, params)
      .then(res => {
        if (res.rows) {
          return resolve(res.rows);
        } else {
          return resolve([]);
        }
      })
      .catch(err => {
        return reject(err);
      });
  });
};

const addMember = async (client, firstName, middleName, lastName, nickname, email, phoneNumber, streetAddress, unitNumber, city, state, zip, foundMethod, pronouns, neopronouns, birthday, twitterHandle, instagramHandle, dietaryRestrictions, hasAttendedEvent, isAdmin, isOnMailingList, isOver18, isOver21) => {
  return new Promise((resolve, reject) => {
    const sql = `
    INSERT INTO people.members
    VALUES $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23
    ON CONFLICT email
    DO NOTHING
  `;

    const params = [
      firstName,
      middleName,
      lastName,
      nickname,
      email,
      phoneNumber,
      streetAddress,
      unitNumber,
      city,
      state,
      zip,
      foundMethod,
      pronouns,
      neopronouns,
      birthday,
      twitterHandle,
      instagramHandle,
      dietaryRestrictions,
      hasAttendedEvent,
      isAdmin,
      isOnMailingList,
      isOver18,
      isOver21
    ];

    client
      .query(sql, params)
      .then(() => {
        return resolve(true);
      })
      .catch(err => {
        console.error("client.query err", err);
        return reject(err);
      });
  });
};

const deleteMember = async (client, memberId) => {
  return new Promise((resolve, reject) => {
    const sql = `
    UPDATE people.members
    SET is_deleted = true
    WHERE member_id = $1
  `;

    const params = [memberId];

    client
      .query(sql, params)
      .then(() => {
        return resolve(true);
      })
      .catch(err => {
        console.error("client.query err", err);
        return reject(err);
      });
  });
};

module.exports = {
  getClient,
  selectAllMembers,
  addMember,
  deleteMember,
};
