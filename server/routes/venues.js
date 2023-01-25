const express = require("express");
const router = express.Router();
const db = require("../database/db");

const client = db.getClient();

router.use((req, res, next) => {
  console.log("Venues route");
  next();
});

router.get("/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const venues = await db.selectAllVenues(client, offset, limit);

    if (venues == null)
      res
        .status(204)
        .send(
          "No venues found. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(venues);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:type/:page", async (req, res) => {
  try {
    const { type, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const venues = await db.selectVenuesByCostType(client, type, offset, limit);

    if (venues == null)
      res
        .status(204)
        .send(
          "No venues found with that cost type. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(venues);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/id/:venueId", async (req, res) => {
  try {
    const { venueId } = req.params;

    const venue = await db.getVenueById(client, venueId);

    if (venue == null)
      res
        .status(204)
        .send(
          "No venue found with that ID. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(venue);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/new", async (_req, res) => {
  try {
    res.status(200).send("Add a new venue!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/new", async (req, res) => {
  try {
    const { locationId, name, contact, cost, costType } = req.body;

    const queryResponse = await db.addVenue(
      client,
      locationId,
      name,
      contact,
      cost,
      costType
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to add the venue."
        );

    res.status(201).send("Venue successfully added!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/update/:venueId", async (req, res) => {
  try {
    const { venueId } = req.params;
    const { locationId, name, contact, cost, costType } = req.body;

    const queryResponse = await db.updateVenue(
      client,
      venueId,
      locationId,
      name,
      contact,
      cost,
      costType
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to update the venue."
        );

    res.status(200).send("Venue updated successfully!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/delete/:venueId", async (req, res) => {
  try {
    const { venueId } = req.params;

    const queryResponse = await db.removeVenue(client, venueId);

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to delete the venue."
        );

    res.status(200).send("Venue successfully deleted!");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;