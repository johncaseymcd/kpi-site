const express = require("express");
const router = express.Router();
const db = require("../database/db");

const client = db.getClient();

router.use((req, res, next) => {
  console.log("Locations route");
  next();
});

router.get("/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const locations = await db.selectAllLocations(client, offset, limit);

    if (locations == null)
      res
        .status(204)
        .send(
          "No locations found. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(locations);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:type/:page", async (req, res) => {
  try {
    const { type, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const locations = await db.selectLocationsByType(
      client,
      type,
      offset,
      limit
    );

    if (locations == null)
      res
        .status(204)
        .send(
          "No locations found with that type. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(locations);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:city/:page", async (req, res) => {
  try {
    const { city, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const locations = await db.selectLocationsByCity(
      client,
      city,
      offset,
      limit
    );

    if (locations == null)
      res
        .status(204)
        .send(
          "No locations found in that city. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(locations);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/id/:locationId", async (req, res) => {
  try {
    const { locationId } = req.params;

    const location = await db.getLocationById(client, locationId);

    if (location == null)
      res
        .status(204)
        .send(
          "No location found with that ID. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(location);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/new", async (_req, res) => {
  try {
    res.status(200).send("Add a new location!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/new", async (req, res) => {
  try {
    const { name, streetAddress, unitNumber, city, state, zip, locationType } =
      req.body;

    const queryResponse = await db.addLocation(
      client,
      name,
      streetAddress,
      unitNumber,
      city,
      state,
      zip,
      locationType
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to add the location."
        );

    res.status(201).send("Location successfully added!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/update/:locationId", async (req, res) => {
  try {
    const { locationId } = req.params;
    const { name, streetAddress, unitNumber, city, state, zip, locationType } =
      req.body;

    const queryResponse = await db.updateLocation(
      client,
      locationId,
      name,
      streetAddress,
      unitNumber,
      city,
      state,
      zip,
      locationType
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to update the location."
        );

    res.status(200).send("Location information successfully updated!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/:locationId/delete", async (req, res) => {
  try {
    const { locationId } = req.params;

    const queryResponse = await db.removeLocation(client, locationId);

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to delete the location."
        );

    res.status(200).send("Location successfully removed!");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;