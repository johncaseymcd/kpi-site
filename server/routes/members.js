const express = require("express");
const router = express.Router();
const db = require("../database/db");
const helper = require("../utils/helper");

const client = db.getClient();
console.log("DB client:", client);

router.use((req, res, next) => {
  console.log("Members route");
  next();
});

router.get("/all/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectAllMembers(client, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members found! Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(500).send("error");
  }
});

router.get("/:city/:page", async (req, res) => {
  try {
    const { city, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersByCity(client, city, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members found in the selected city. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(500).send("error");
  }
});

router.get("/:zip/:page", async (req, res) => {
  try {
    const { zip, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersByZip(client, zip, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members found in the selected ZIP code. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(500).send("error");
  }
});

router.get("/:foundMethod/:page", async (req, res) => {
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
          "No members found for your current selection. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(500).send("error");
  }
});

router.get("/birthday/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersByBirthday(client, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members with birthdays this week! Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(500).send("error");
  }
});

router.get("/events/:status/:page", async (req, res) => {
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
          "No members found for your current selection. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(500).send("error");
  }
});

router.get("/mailto/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersOnMailingList(client, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members found on the mailing list. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(500).send("error");
  }
});

router.get("/over18/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersOver18(client, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members found over 18. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(500).send("error");
  }
});

router.get("/over21/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersOver21(client, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members found over 21. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(500).send("error");
  }
});

router.get("/:memberId", async (req, res) => {
  try {
    const { memberId } = req.params;

    const member = await db.getMemberById(client, memberId);

    if (member == null)
      res
        .status(204)
        .send(
          "Member not found by ID. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(member);
  } catch (error) {
    res.status(500).send("error");
  }
});

router.get("/new", async (req, res) => {
  try {
    res.status(200).send("Create a new member profile!");
  } catch (error) {
    res.status(500).send("error");
  }
});

router.post("/new", async (req, res) => {
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

    res.status(201).send("Member profile successfully created!");
  } catch (error) {
    res.status(500).send("error");
  }
});

router.put("/delete/:memberId", async (req, res) => {
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
    res.status(500).send("error");
  }
});

router.put("/update/:memberId", async (req, res) => {
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
    res.status(500).send("error");
  }
});

module.exports = router;