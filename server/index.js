require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./database/db");
const helper = require("./utils/helper");

const app = express();
const client = await db.getClient();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
-------------------------------------------------
                  HOME PAGE
-------------------------------------------------
*/

app.get("/", async (req, res) => {
  try {
    res.status(200).send("Welcome to KPop Indiana!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

/*
-------------------------------------------------
                MEMBERS ENDPOINTS
-------------------------------------------------
*/

app.get("/data/members/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectAllMembers(client, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members found! Please contact the database admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/members/:city/:page", async (req, res) => {
  try {
    const { city, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersByCity(client, city, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members found in the selected city. Please contact the database admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/members/:zip/:page", async (req, res) => {
  try {
    const { zip, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersByZip(client, zip, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members found in the selected ZIP code. Please contact the database admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/members/:foundMethod/:page", async (req, res) => {
  try {
    const { foundMethod, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersByFoundMethod(
      client,
      foundMethod,
      offset,
      limit
    );

    if (members == null)
      res
        .status(204)
        .send(
          "No members found for your current selection. Please contact the database admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/members/birthday/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersByBirthday(client, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members with birthdays this week! Please contact the database admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/members/events/:status/:page", async (req, res) => {
  try {
    const { status, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersByEventAttendanceStatus(
      client,
      status,
      offset,
      limit
    );

    if (members == null)
      res
        .status(204)
        .send(
          "No members found for your current selection. Please contact the database admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/members/mailto/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersOnMailingList(client, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members found on the mailing list. Please contact the database admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/members/over18/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersOver18(client, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members found over 18. Please contact the database admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/members/over21/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersOver21(client, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members found over 21. Please contact the database admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/members/:memberId", async (req, res) => {
  try {
    const { memberId } = req.params;

    const member = await db.getMemberById(client, memberId);

    if (member == null)
      res
        .status(204)
        .send(
          "Member not found by ID. Please contact the database admin if you believe this is an error."
        );

    res.status(200).send(member);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/members/new", async (req, res) => {
  try {
    res.status(200).send("Create a new member profile!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.post("/members/new", async (req, res) => {
  try {
    const {
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
      isOnMailingList,
    } = req.body;
    const isAdmin = false;
    const isOver18 = helper.checkAge(
      birthday.getFullYear(),
      birthday.getMonth(),
      birthday.getDate(),
      18
    );
    const isOver21 = helper.checkAge(
      birthday.getFullYear(),
      birthday.getMonth(),
      birthday.getDate(),
      21
    );

    const queryResponse = await db.addMember(
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
      twitterHandle,
      instagramHandle,
      dietaryRestrictions,
      hasAttendedEvent,
      isOnMailingList,
      isAdmin,
      isOver18,
      isOver21
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error has occurred while attempting to create the member profile."
        );

    res.status(200).send("Member profile successfully created!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.put("/members/:memberId/delete", async (req, res) => {
  try {
    const { memberId } = req.params;
    const queryResponse = await db.removeMember(client, memberId);

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error has occurred while attempting to delete the member profile."
        );

    res.status(200).send("Member profile successfully deleted!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.put("/members/:memberId/update", async (req, res) => {
  try {
    const { memberId } = req.params;
    const {
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
    } = req.body;

    const queryResponse = await db.updateMemberProfile(
      client,
      memberId,
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
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to update the member profile."
        );

    res.status(200).send("Member profile successfully updated!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

/*
-------------------------------------------------
              ADMIN ENDPOINTS
-------------------------------------------------
*/

app.get("/data/admins/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const admins = await db.selectAllAdmins(client, offset, limit);

    if (admins == null)
      res
        .status(204)
        .send(
          "No admins found. Please contact the database admin if you believe this is an error."
        );

    res.status(200).send(admins);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/admins/:role/:page", async (req, res) => {
  try {
    const { role, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const admins = await db.selectAdminsByRole(client, role, offset, limit);

    if (admins == null)
      res
        .status(204)
        .send(
          "No admins found with the selected role. Please contact the database admin if you believe this is an error."
        );

    res.status(200).send(admins);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/admins/:platform/:page", async (req, res) => {
  try {
    const { platform, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const admins = await db.selectAdminsByPlatform(
      client,
      platform,
      offset,
      limit
    );

    if (admins == null)
      res
        .status(204)
        .send(
          "No admins found for that platform. Please contact the database admin if you believe this is an error."
        );

    res.status(200).send(admins);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/admins/:section/:page", async (req, res) => {
  try {
    const { section, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const admins = await db.selectAdminsBySection(
      client,
      section,
      offset,
      limit
    );

    if (admins == null)
      res
        .status(204)
        .send(
          "No admins found in that section. Please contact the database admin if you believe this is an error."
        );

    res.status(200).send(admins);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/admins/:memberId", async (req, res) => {
  try {
    const { memberId } = req.params;

    const admin = await db.getAdminById(client, memberId);

    if (admin == null)
      res
        .status(204)
        .send(
          "Admin not found with that ID. Please contact the database admin if you believe this is an error."
        );

    res.status(200).send(admin);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/admins/new/:memberId", async (req, res) => {
  try {
    res.status(200).send("Create a new admin!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.post("/data/admins/new/:memberId", async (req, res) => {
  try {
    const { memberId } = req.params;
    const { role, platform, section } = req.body;

    const queryResponse = await db.addAdmin(
      client,
      memberId,
      role,
      platform,
      section
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to add the admin."
        );

    res.status(200).send("Admin successfully added!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.put("/data/admins/:memberId/delete", async (req, res) => {
  try {
    const { memberId } = req.params;

    const queryResponse = await db.removeAdmin(client, memberId);

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to remove the admin."
        );

    res.status(200).send("Admin successfully removed!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.put("/data/admins/:memberId/update", async (req, res) => {
  try {
    const { memberId } = req.params;
    const { role, platform, section } = req.body;

    const queryResponse = await db.updateAdminPosition(
      client,
      memberId,
      role,
      platform,
      section
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to update the admin."
        );

    res.status(200).send("Admin successfully updated!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

/*
-------------------------------------------------
              LOCATION ENDPOINTS
-------------------------------------------------
*/



app.listen("6633", () => {});
