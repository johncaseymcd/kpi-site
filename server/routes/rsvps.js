const express = require("express");
const router = express.Router();
const db = require("../database/db");

const client = db.getClient();

router.use((req, res, next) => {
  console.log("RSVP route");
  next();
});

router.get("/event/:eventId/:page", async (req, res) => {
  try {
    const { eventId, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const rsvps = await db.selectAllRsvpsForEvent(
      client,
      eventId,
      offset,
      limit
    );

    if (rsvps == null)
      res
        .status(204)
        .send(
          "No RSVPs found for the specified event. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(rsvps);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/id/:rsvpId", async (req, res) => {
  try {
    const { rsvpId } = req.params;

    const rsvp = await db.getRsvpById(client, rsvpId);

    if (rsvp == null)
      res
        .status(204)
        .send(
          "No RSVP found with that ID. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(rsvp);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/event/:eventId/new", async (_req, res) => {
  try {
    res.status(200).send("RSVP to this event!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/event/:eventId/new", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { response, memberCount, memberNames, contactId } = req.body;

    const queryResponse = await db.addRsvpToEvent(
      client,
      eventId,
      response,
      memberCount,
      memberNames,
      contactId
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to submit the RSVP."
        );

    res.status(201).send("RSVP was successfully submitted!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/update/:rsvpId", async (req, res) => {
  try {
    const { rsvpId } = req.params;
    const { response, memberCount, memberNames, contactId } = req.body;

    const queryResponse = await db.updateRsvp(
      client,
      rsvpId,
      response,
      memberCount,
      memberNames,
      contactId
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to update the RSVP."
        );

    res.status(200).send("RSVP was successfully updated!");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;