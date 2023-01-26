const express = require("express");
const router = express.Router();
const db = require("../database/db");

const client = db.getClient();

router.use((req, res, next) => {
  console.log("Events route");
  next();
});

router.get("/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const events = await db.selectAllEvents(client, offset, limit);

    if (events == null)
      res
        .status(204)
        .send(
          "No events found. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(events);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/venue/:venueId/:page", async (req, res) => {
  try {
    const { venueId, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const events = await db.selectEventsByVenue(client, venueId, offset, limit);

    if (events == null)
      res
        .status(204)
        .send(
          "No events found at that venue. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(events);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/id/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await db.getEventById(client, eventId);

    if (event == null)
      res
        .status(204)
        .send(
          "No event found with that ID. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(event);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/new", async (_req, res) => {
  try {
    res.status(200).send("Create a new event!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/new", async (req, res) => {
  try {
    const {
      name,
      venueId,
      description,
      eventDate,
      price,
      expectedGuests,
      suggestedPrice,
    } = req.body;

    const queryResponse = await db.addEvent(
      client,
      name,
      venueId,
      description,
      eventDate,
      price,
      expectedGuests,
      suggestedPrice
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to add the event."
        );

    res.status(201).send("Event was successfully created!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/update/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const {
      name,
      venueId,
      description,
      eventDate,
      price,
      expectedGuests,
      actualProfit,
      turnoutPercentage,
    } = req.body;

    const queryResponse = await db.updateEvent(
      client,
      eventId,
      name,
      venueId,
      description,
      eventDate,
      price,
      expectedGuests,
      actualProfit,
      turnoutPercentage
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to update the event."
        );

    res.status(200).send("Event was successfully updated!");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;