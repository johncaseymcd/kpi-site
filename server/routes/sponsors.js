const express = require("express");
const router = express.Router();
const db = require("../database/db");

const client = db.getClient();

router.get("/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const sponsors = await db.selectAllSponsors(client, offset, limit);

    if (sponsors == null)
      res
        .status(204)
        .send(
          "No sponsors found. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(sponsors);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:type/:page", async (req, res) => {
  try {
    const { type, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const sponsors = await db.selectSponsorsByType(client, type, offset, limit);

    if (sponsors == null)
      res
        .status(204)
        .send(
          "No sponsors found with that type. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(sponsors);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/id/:sponsorId", async (req, res) => {
  try {
    const { sponsorId } = req.params;

    const sponsor = await db.getSponsorById(client, sponsorId);

    if (sponsor == null)
      res
        .status(204)
        .send(
          "No sponsor found with that ID. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(sponsor);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/new", async (_req, res) => {
  try {
    res.status(200).send("Add a new sponsor!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/new", async (req, res) => {
  try {
    const { name, sponsorType, contact } = req.body;

    const queryResponse = await db.addSponsor(
      client,
      name,
      sponsorType,
      contact
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to add the sponsor."
        );

    res.status(201).send("Sponsor successfully added!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/update/:sponsorId", async (req, res) => {
  try {
    const { sponsorId } = req.params;
    const { name, sponsorType, contact } = req.body;

    const queryResponse = await db.updateSponsor(
      client,
      sponsorId,
      name,
      sponsorType,
      contact
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to update the sponsor."
        );

    res.status(200).send("Sponsor successfully updated!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/delete/:sponsorId", async (req, res) => {
  try {
    const { sponsorId } = req.params;

    const queryResponse = await db.removeSponsor(client, sponsorId);

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to delete the sponsor."
        );

    res.status(200).send("Sponsor successfully deleted!");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;