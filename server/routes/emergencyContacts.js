const express = require("express");
const router = express.Router();
const db = require("../database/db");

const client = db.getClient();

router.use((req, res, next) => {
  console.log("Emergency Contacts route");
  next();
});

router.get("/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const contacts = await db.selectAllEmergencyContacts(client, offset, limit);

    if (contacts == null)
      res
        .status(204)
        .send(
          "No emergency contacts found. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(contacts);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/id/:contactId", async (req, res) => {
  try {
    const { contactId } = req.params;

    const contact = await db.getEmergencyContactById(client, contactId);

    if (contact == null)
      res
        .status(204)
        .send(
          "No emergency contact found with that ID. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(contact);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/new", async (_req, res) => {
  try {
    res.status(200).send("Add a new emergency contact!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/new", async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber } = req.body;

    const queryResponse = await db.addEmergencyContact(
      client,
      firstName,
      lastName,
      email,
      phoneNumber
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to add the emergency contact."
        );

    res.status(201).send("Emergency contact was successfully added!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/update/:contactId", async (req, res) => {
  try {
    const { contactId } = req.params;
    const { firstName, lastName, email, phoneNumber } = req.body;

    const queryResponse = await db.updateEmergencyContact(
      client,
      contactId,
      firstName,
      lastName,
      email,
      phoneNumber
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to update the emergency contact."
        );

    res.status(200).send("Emergency contact was successfully updated.");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/delete/:contactId", async (req, res) => {
  try {
    const { contactId } = req.params;

    const queryResponse = await db.removeEmergencyContact(client, contactId);

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to delete the emergency contact."
        );

    res.status(200).send("Emergency contact was successfully deleted.");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;