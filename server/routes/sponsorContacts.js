const express = require("express");
const router = express.Router();
const db = require("../database/db");

const client = db.getClient();

router.use((req, res, next) => {
  console.log("Sponsor Contacts route");
  next();
});

router.get("/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const contacts = await db.selectAllSponsorContacts(client, offset, limit);

    if (contacts == null)
      res
        .status(204)
        .send(
          "No sponsor contacts found. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(contacts);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/id/:contactId", async (req, res) => {
  try {
    const { contactId } = req.params;

    const contact = await db.getSponsorContactById(client, contactId);

    if (contact == null)
      res
        .status(204)
        .send(
          "No sponsor contact found with that ID. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(contact);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/new", async (_req, res) => {
  try {
    res.status(200).send("Add a new sponsor contact!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/new", async (req, res) => {
  try {
    const { sponsorId, firstName, lastName, email, phoneNumber } = req.body;

    const queryResponse = await db.addSponsorContact(
      client,
      sponsorId,
      firstName,
      lastName,
      email,
      phoneNumber
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occcurred while attempting to add the sponsor contact."
        );

    res.status(201).send("Sponsor contact was successfully added!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/update/:contactId", async (req, res) => {
  try {
    const { contactId } = req.params;
    const { sponsorId, firstName, lastName, email, phoneNumber } = req.body;

    const queryResponse = await db.updateSponsorContact(
      client,
      contactId,
      sponsorId,
      firstName,
      lastName,
      email,
      phoneNumber
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to update the sponsor contact."
        );

    res.status(200).send("Sponsor contact was successfully updated.");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/delete/:contactId", async (req, res) => {
  try {
    const { contactId } = req.params;

    const queryResponse = await db.removeSponsorContact(client, contactId);

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to delete the sponsor contact."
        );

    res.status(200).send("Sponsor contact was successfully deleted.");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;