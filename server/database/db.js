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

/*
-------------------------------------------------
              MEMBER FUNCTIONS
-------------------------------------------------
*/

const selectAllMembers = async client => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.members
    `;
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

const selectMembersByCity = async (client, city) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.members
      WHERE city = $1
    `;
    const params = [city];

    client
      .query(sql, params)
      .then(res => {
        if (res.rows) {
          return resolve(res.rows);
        } else {
          return resolve(null);
        }
      })
      .catch(err => {
        return reject(err);
      });
  });
};

const selectMembersByZip = async (client, zip) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.members
      WHERE zip = $1
    `;
    const params = [zip];

    client
      .query(sql, params)
      .then(res => {
        if (res.rows) {
          return resolve(res.rows);
        } else {
          return resolve(null);
        }
      })
      .catch(err => {
        return reject(err);
      });
  });
};

const selectMembersByFoundMethod = async (client, foundMethod) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.members
      WHERE found_method = $1
    `;
    const params = [foundMethod];

    client
      .query(sql, params)
      .then(res => {
        if (res.rows) {
          return resolve(res.rows);
        } else {
          return resolve(null);
        }
      })
      .catch(err => {
        return reject(err);
      });
  });
};

const selectMembersByBirthday = async client => {
  return new Promise((resolve, reject) => {
    const currentDate = new Date();
    const sevenDays = currentDate.getDate() + 7;
    const nextWeek = new Date(currentDate.setDate(sevenDays));
    const sql = `
      SELECT twitter_handle, instagram_handle, birthday
      FROM people.members
      WHERE birthday >= $1
      AND birthday < $2 
    `;
    const params = [currentDate, nextWeek];

    client
      .query(sql, params)
      .then(res => {
        if (res.rows) {
          return resolve(res.rows);
        } else {
          return resolve(null);
        }
      })
      .catch(err => {
        return reject(err);
      });
  });
};

const selectMembersByEventAttendanceStatus = async (
  client,
  hasAttendedEvent
) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.members
      WHERE has_attended_event = $1
    `;
    const params = [hasAttendedEvent];

    client
      .query(sql, params)
      .then(res => {
        if (res.rows) {
          return resolve(res.rows);
        } else {
          return resolve(null);
        }
      })
      .catch(err => {
        return reject(err);
      });
  });
};

const selectMembersOnMailingList = async client => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT email, firstName, lastName, nickname
      FROM people.members
      WHERE is_on_mailing_list = true
    `;
    const params = [];

    client
      .query(sql, params)
      .then(res => {
        if (res.rows) {
          return resolve(res.rows);
        } else {
          return resolve(null);
        }
      })
      .catch(err => {
        return reject(err);
      });
  });
};

const selectMembersOver18 = async client => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.members
      WHERE is_over_18 = true
    `;
    const params = [];

    client
      .query(sql, params)
      .then(res => {
        if (res.rows) {
          return resolve(res.rows);
        } else {
          return resolve(null);
        }
      })
      .catch(err => {
        return reject(err);
      });
  });
};

const selectMembersOver21 = async client => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.members
      WHERE is_over_21 = true
    `;
    const params = [];

    client
      .query(sql, params)
      .then(res => {
        if (res.rows) {
          return resolve(res.rows);
        } else {
          return resolve(null);
        }
      })
      .catch(err => {
        return reject(err);
      });
  });
};

const getMemberById = async (client, memberId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.members
      WHERE member_id = $1
    `;

    const params = [memberId];

    client
      .query(sql, params)
      .then(res => {
        if (res.rows) {
          return resolve(res.rows[0]);
        } else {
          return resolve(null);
        }
      })
      .catch(err => {
        return reject(err);
      });
  });
};

const addMember = async (
  client,
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
) => {
  return new Promise((resolve, reject) => {
    const sql = `
    INSERT INTO people.members
      (first_name, middle_name, last_name, nickname, email, phone_number, street_address, unit_number, city, state, zip, found_method, pronouns, neopronouns, birthday, twitter_handle, instagram_handle, dietary_restrictions, has_attended_event, is_admin, is_on_mailing_list, is_over_18, is_over_21)
    VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
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
      isOver21,
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

const editMemberProfile = async (
  client,
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
  pronouns,
  neopronouns,
  twitterHandle,
  instagramHandle,
  dietaryRestrictions
) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE people.members
      SET
        first_name = $1,
        middle_name = $2, 
        last_name = $3, 
        nickname = $4, 
        email = $5, 
        phone_number = $6, 
        street_address = $7,
        unit_number = $8,
        city = $9,
        state = $10,
        zip = $11,
        pronouns = $12,
        neopronouns = $12, 
        twitter_handle = $13,
        instagram_handle = $14,
        dietary_restrictions = $15
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
      pronouns,
      neopronouns,
      twitterHandle,
      instagramHandle,
      dietaryRestrictions,
    ];

    client
      .query(sql, params)
      .then(() => {
        return resolve(true);
      })
      .catch(err => {
        return reject(err);
      });
  });
};

/*
-------------------------------------------------
              ADMIN FUNCTIONS
-------------------------------------------------
*/

const selectAllAdmins = async client => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.admins
    `;
    const params = [];

    client
      .query(sql, params)
      .then(res => {
        if (res.rows) {
          return resolve(res.rows);
        } else {
          return resolve(null);
        }
      })
      .catch(err => {
        return reject(err);
      });
  });
};

const selectAdminsByRole = async (client, role) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.admins
      WHERE role = $1
    `;
    const params = [role];

    client
      .query(sql, params)
      .then(res => {
        if (res.rows) {
          return resolve(res.rows);
        } else {
          return resolve(null);
        }
      })
      .catch(err => {
        return reject(err);
      });
  });
};

const selectAdminsByPlatform = async (client, platform) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.admins
      WHERE platform = $1
    `;
    const params = [platform];

    client
      .query(sql, params)
      .then(res => {
        if (res.rows) {
          return resolve(res.rows);
        } else {
          return resolve(null);
        }
      })
      .catch(err => {
        return reject(err);
      });
  });
};

const selectAdminsBySection = async (client, section) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.admins
      WHERE section = $1
    `;
    const params = [section];

    client
      .query(sql, params)
      .then(res => {
        if (res.rows) {
          return resolve(res.rows);
        } else {
          return resolve(null);
        }
      })
      .catch(err => {
        return reject(err);
      });
  });
};

const getAdminById = async (client, memberId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.admins
      WHERE member_id = $1
    `;
    const params = [memberId];

    client
      .query(sql, params)
      .then(res => {
        if (res.rows) {
          return resolve(res.rows[0]);
        } else {
          return resolve(null);
        }
      })
      .catch(err => {
        return reject(err);
      });
  });
};

const setAdmin = async (client, memberId, role, platform, section) => {
  return new Promise((resolve, reject) => {
    const adminSql = `
      INSERT INTO people.admins 
        (member_id, role, platform, section)
      VALUES
        ($1, $2, $3, $4)
      ON CONFLICT member_id
      DO NOTHING
    `;
    const adminParams = [memberId, role, platform, section];

    const memberSql = `
      UPDATE people.members
      SET is_admin = true
      WHERE member_id = $1
    `;
    const memberParams = [memberId];

    client
      .query("BEGIN")
      .then(() => {
        client.query(adminSql, adminParams).then(() => {
          client.query(memberSql, memberParams).then(() => {
            client.query("COMMIT").then(() => {
              return resolve(true);
            });
          });
        });
      })
      .catch(err => {
        client.query("ROLLBACK").then(() => {
          return reject(err);
        });
      });
  });
};

const removeAdmin = async (client, memberId) => {
  return new Promise((resolve, reject) => {
    const adminSql = `
      UPDATE people.admins
      SET is_deleted = true
      WHERE member_id = $1
    `;
    const params = [memberId];

    const memberSql = `
      UPDATE people.members
      SET is_admin = false
      WHERE member_id = $1
    `;

    client
      .query("BEGIN")
      .then(() => {
        client.query(adminSql, params).then(() => {
          client.query(memberSql, params).then(() => {
            return resolve(true);
          });
        });
      })
      .catch(err => {
        return reject(err);
      });
  });
};

const updateAdminPosition = async (
  client,
  memberId,
  role,
  platform,
  section
) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE people.admins
      SET
        role = $2,
        platform = $3,
        section = $4
      WHERE member_id = $1
    `;

    const params = [memberId, role, platform, section];

    client
      .query(sql, params)
      .then(() => {
        return resolve(true);
      })
      .catch(err => {
        return reject(err);
      });
  });
};

/*
-------------------------------------------------
            LOCATION FUNCTIONS
-------------------------------------------------
*/

/*
-------------------------------------------------
                VENUE FUNCTIONS
-------------------------------------------------
*/

/*
-------------------------------------------------
              SPONSOR FUNCTIONS
-------------------------------------------------
*/

/*
-------------------------------------------------
            VENUE CONTACT FUNCTIONS
-------------------------------------------------
*/

/*
-------------------------------------------------
          SPONSOR CONTACT FUNCTIONS
-------------------------------------------------
*/

/*
-------------------------------------------------
        EMERGENCY CONTACT FUNCTIONS
-------------------------------------------------
*/

/*
-------------------------------------------------
              EXPENSE FUNCTIONS
-------------------------------------------------
*/

/*
-------------------------------------------------
              KPI EVENT FUNCTIONS
-------------------------------------------------
*/

/*
-------------------------------------------------
                RSVP FUNCTIONS
-------------------------------------------------
*/

/*
-------------------------------------------------
              JOINER FUNCTIONS
-------------------------------------------------
*/

module.exports = {
  getClient,
  selectAllMembers,
  selectMembersByBirthday,
  selectMembersByCity,
  selectMembersByEventAttendanceStatus,
  selectMembersByFoundMethod,
  selectMembersByZip,
  selectMembersOnMailingList,
  selectMembersOver18,
  selectMembersOver21,
  getMemberById,
  addMember,
  deleteMember,
  editMemberProfile,
  selectAllAdmins,
  selectAdminsByRole,
  selectAdminsByPlatform,
  selectAdminsBySection,
  getAdminById,
  setAdmin,
  removeAdmin,
  updateAdminPosition,
};
