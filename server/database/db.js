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

const selectAllMembers = async (client, offset, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.members
      OFFSET $1 LIMIT $2
    `;
    const params = [offset, limit];

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

const selectMembersByCity = async (client, city, offset, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.members
      WHERE city = $1
      OFFSET $2 LIMIT $3
    `;
    const params = [city, offset, limit];

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

const selectMembersByZip = async (client, zip, offset, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.members
      WHERE zip = $1
      OFFSET $2 LIMIT $3
    `;
    const params = [zip, offset, limit];

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

const selectMembersByFoundMethod = async (
  client,
  foundMethod,
  offset,
  limit
) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.members
      WHERE found_method = $1
      OFFSET $2 LIMIT $3
    `;
    const params = [foundMethod, offset, limit];

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

const selectMembersByBirthday = async (client, offset, limit) => {
  return new Promise((resolve, reject) => {
    const currentDate = new Date();
    const sevenDays = currentDate.getDate() + 7;
    const nextWeek = new Date(currentDate.setDate(sevenDays));
    const sql = `
      SELECT twitter_handle, instagram_handle, birthday
      FROM people.members
      WHERE birthday >= $1
      AND birthday < $2 
      OFFSET $3 LIMIT $4
    `;
    const params = [currentDate, nextWeek, offset, limit];

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
  hasAttendedEvent,
  offset,
  limit
) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.members
      WHERE has_attended_event = $1
      OFFSET $2 LIMIT $3
    `;
    const params = [hasAttendedEvent, offset, limit];

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

const selectMembersOnMailingList = async (client, offset, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT email, firstName, lastName, nickname
      FROM people.members
      WHERE is_on_mailing_list = true
      OFFSET $1 LIMIT $2
    `;
    const params = [offset, limit];

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

const selectMembersOver18 = async (client, offset, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.members
      WHERE is_over_18 = true
      OFFSET $1 LIMIT $2
    `;
    const params = [offset, limit];

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

const selectMembersOver21 = async (client, offset, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.members
      WHERE is_over_21 = true
      OFFSET $1 LIMIT $2
    `;
    const params = [offset, limit];

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

const removeMember = async (client, memberId) => {
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

const updateMemberProfile = async (
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

const selectAllAdmins = async (client, offset, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.admins
      OFFSET $1 LIMIT $2
    `;
    const params = [offset, limit];

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

const selectAdminsByRole = async (client, role, offset, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.admins
      WHERE role = $1
      OFFSET $2 LIMIT $3
    `;
    const params = [role, offset, limit];

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

const selectAdminsByPlatform = async (client, platform, offset, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.admins
      WHERE platform = $1
      OFFSET $2 LIMIT $3
    `;
    const params = [platform, offset, limit];

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

const selectAdminsBySection = async (client, section, offset, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM people.admins
      WHERE section = $1
      OFFSET $2 LIMIT $3
    `;
    const params = [section, offset, limit];

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

const addAdmin = async (client, memberId, role, platform, section) => {
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

const selectAllLocations = async (client, offset, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM places.locations
      OFFSET $1 LIMIT $2
    `;
    const params = [offset, limit];

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

const selectLocationsByType = async (client, locationType, offset, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM places.locations
      WHERE location_type = $1
      OFFSET $2 LIMIT $3
    `;
    const params = [locationType, offset, limit];

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

const selectLocationsByCity = async (client, city, offset, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM places.locations
      WHERE city = $1
      OFFSET $2 LIMIT $3
    `;
    const params = [city, offset, limit];

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

const getLocationById = async (client, locationId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM places.locations
      WHERE location_id = $1
    `;
    const params = [locationId];

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

const addLocation = async (
  client,
  name,
  streetAddress,
  unitNumber,
  city,
  state,
  zip,
  locationType
) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO places.locations
        (name, street_address, unit_number, city, state, zip, location_type)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
    `;
    const params = [
      name,
      streetAddress,
      unitNumber,
      city,
      state,
      zip,
      locationType,
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

const updateLocation = async (
  client,
  locationId,
  name,
  streetAddress,
  unitNumber,
  city,
  state,
  zip,
  locationType
) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE places.locations
      SET
        name = $2,
        street_address = $3, 
        unit_number = $4,
        city = $5, 
        state = $6, 
        zip = $7,
        location_type = $8
      WHERE location_id = $1
    `;
    const params = [
      locationId,
      name,
      streetAddress,
      unitNumber,
      city,
      state,
      zip,
      locationType,
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

const removeLocation = async (client, locationId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE places.locations
      SET is_deleted = true
      WHERE location_id = $1
    `;
    const params = [locationId];

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
                VENUE FUNCTIONS
-------------------------------------------------
*/

const selectAllVenues = async (client, offset, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM businesses.venues
      OFFSET $1 LIMIT $2
    `;
    const params = [offset, limit];

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

const selectVenuesByCostType = async (client, costType, offset, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM businesses.venues
      WHERE cost_type = $1
      OFFSET $2 LIMIT $3
    `;
    const params = [costType, offset, limit];

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

const getVenueById = async (client, venueId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM businesses.venues
      WHERE venue_id = $1
    `;
    const params = [venueId];

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

const addVenue = async (client, locationId, name, contact, cost, costType) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO businesses.venues
        (location_id, name, contact, cost, cost_type)
      VALUES
        ($1, $2, $3, $4, $5)
      ON CONFLICT location_id
      DO NOTHING
    `;
    const params = [locationId, name, contact, cost, costType];

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

const updateVenue = async (
  client,
  venueId,
  locationId,
  name,
  contact,
  cost,
  costType
) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE businesses.venues
      SET
        location_id = $2,
        name = $3,
        contact = $4,
        cost = $5,
        cost_type = $6
      WHERE venue_id = $1
    `;
    const params = [venueId, locationId, name, contact, cost, costType];

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

const removeVenue = async (client, venueId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE businesses.venues
      SET is_deleted = true
      WHERE venue_id = $1
    `;
    const params = [venueId];

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
              SPONSOR FUNCTIONS
-------------------------------------------------
*/

const selectAllSponsors = async (client, offset, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM businesses.sponsors
      OFFSET $1 LIMIT $2
    `;
    const params = [offset, limit];

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

const selectSponsorsByType = async (client, sponsorType, offset, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM businesses.sponsors
      WHERE sponsor_type = $1
      OFFSET $2 LIMIT $3
    `;
    const params = [sponsorType, offset, limit];

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

const getSponsorById = async (client, sponsorId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM businesses.sponsors
      WHERE sponsor_id = $1
   `;
    const params = [sponsorId];

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

const addSponsor = async (client, name, sponsorType, contact) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO businesses.sponsors
        (name, sponsor_type, contact)
      VALUES
        ($1, $2, $3)
    `;
    const params = [name, sponsorType, contact];

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

const updateSponsor = async (client, sponsorId, name, sponsorType, contact) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE businesses.sponsors
      SET
        name = $2,
        sponsor_type = $3,
        contact = $4
      WHERE sponsor_id = $1
    `;
    const params = [sponsorId, name, sponsorType, contact];

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

const removeSponsor = async (client, sponsorId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE businesses.sponsors
      SET is_deleted = true
      WHERE sponsor_id = $1
    `;
    const params = [sponsorId];

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
            VENUE CONTACT FUNCTIONS
-------------------------------------------------
*/

const selectAllVenueContacts = async (client, offset, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM contacts.venue_contacts
      OFFSET $1 LIMIT $2
    `;
    const params = [offset, limit];

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

const getVenueContactById = async (client, contactId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM venue_contacts
      WHERE contact_id = $1
    `;
    const params = [contactId];

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

const addVenueContact = async (
  client,
  venueId,
  firstName,
  lastName,
  email,
  phoneNumber
) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO contacts.venue_contacts
        (venue_id, first_name, last_name, email, phone_number)
      VALUES
        ($1, $2, $3, $4, $5)
      ON CONFLICT venue_id
      DO NOTHING
    `;
    const params = [venueId, firstName, lastName, email, phoneNumber];

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

const updateVenueContact = async (
  client,
  contactId,
  venueId,
  firstName,
  lastName,
  email,
  phoneNumber
) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE contacts.venue_contacts
      SET
        venue_id = $2,
        first_name = $3,
        last_name = $4,
        email = $5,
        phone_number = $6
      WHERE contact_id = $1
    `;
    const params = [
      contactId,
      venueId,
      firstName,
      lastName,
      email,
      phoneNumber,
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

const removeVenueContact = async (client, contactId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE contacts.venue_contacts
      SET is_deleted = true
      WHERE contact_id = $1
    `;
    const params = [contactId];

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
          SPONSOR CONTACT FUNCTIONS
-------------------------------------------------
*/

const selectAllSponsorContacts = async (client, offset, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM contacts.sponsor_contacts
      OFFSET $1 LIMIT $2
    `;
    const params = [offset, limit];

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

const getSponsorContactById = async (client, contactId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM contacts.sponsor_contacts
      WHERE contact_id = $1
    `;
    const params = [contactId];

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

const addSponsorContact = async (
  client,
  sponsorId,
  firstName,
  lastName,
  email,
  phoneNumber
) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO contacts.sponsor_contacts
        (sponsor_id, first_name, last_name, email, phone_number)
      VALUES
        ($1, $2, $3, $4, $5)
      ON CONFLICT sponsor_id
      DO NOTHING
    `;
    const params = [sponsorId, firstName, lastName, email, phoneNumber];

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

const updateSponsorContact = async (
  client,
  contactId,
  sponsorId,
  firstName,
  lastName,
  email,
  phoneNumber
) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE contacts.sponsor_contacts
      SET
        sponsor_id = $2,
        first_name = $3,
        last_name = $4, 
        email = $5,
        phone_number = $6
      WHERE contact_id = $1
    `;
    const params = [
      contactId,
      sponsorId,
      firstName,
      lastName,
      email,
      phoneNumber,
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

const removeSponsorContact = async (client, contactId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE contacts.sponsor_contacts
      SET is_deleted = true
      WHERE contact_id = $1
    `;
    const params = [contactId];

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
        EMERGENCY CONTACT FUNCTIONS
-------------------------------------------------
*/

const selectAllEmergencyContacts = async (client, offset, limit) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM contacts.emergency_contacts
      OFFSET $1 LIMIT $2
    `;
    const params = [offset, limit];

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

const getEmergencyContactById = async (client, contactId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM contacts.emergency_contacts
      WHERE contact_id = $1
    `;
    const params = [contactId];

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

const addEmergencyContact = async (
  client,
  firstName,
  lastName,
  email,
  phoneNumber
) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO contacts.emergency_contacts
        (first_name, last_name, email, phone_number)
      VALUES
        ($1, $2, $3, $4)
      ON CONFLICT
      DO NOTHING
    `;
    const params = [firstName, lastName, email, phoneNumber];

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

const updateEmergencyContact = async (
  client,
  contactId,
  firstName,
  lastName,
  email,
  phoneNumber
) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE contacts.emergency_contacts
      SET
        first_name = $2,
        last_name = $3,
        email = $4, 
        phone_number = $5
      WHERE contact_id = $1
    `;
    const params = [contactId, firstName, lastName, email, phoneNumber];

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

const removeEmergencyContact = async (client, contactId) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE contacts.emergency_contacts
      SET is_deleted = true
      WHERE contact_id = $1
    `;
    const params = [contactId];

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
  removeMember,
  updateMemberProfile,
  selectAllAdmins,
  selectAdminsByRole,
  selectAdminsByPlatform,
  selectAdminsBySection,
  getAdminById,
  addAdmin,
  removeAdmin,
  updateAdminPosition,
  selectAllLocations,
  selectLocationsByType,
  selectLocationsByCity,
  getLocationById,
  addLocation,
  updateLocation,
  removeLocation,
  selectAllVenues,
  selectVenuesByCostType,
  getVenueById,
  addVenue,
  updateVenue,
  removeVenue,
  selectAllSponsors,
  selectSponsorsByType,
  getSponsorById,
  addSponsor,
  updateSponsor,
  removeSponsor,
  selectAllVenueContacts,
  getVenueContactById,
  addVenueContact,
  updateVenueContact,
  removeVenueContact,
  selectAllSponsorContacts,
  getSponsorContactById,
  addSponsorContact,
  updateSponsorContact,
  removeSponsorContact,
  selectAllEmergencyContacts,
  getEmergencyContactById,
  addEmergencyContact,
  updateEmergencyContact,
  removeEmergencyContact,
};
