const express = require("express");
const router = express.Router();
const db = require("../database/db");

const client = db.getClient();

router.use((req, res, next) => {
  console.log("Admins route");
  next();
});

router.get("/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const admins = await db.selectAllAdmins(client, offset, limit);

    if (admins == null)
      res
        .status(204)
        .send(
          "No admins found. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(admins);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:role/:page", async (req, res) => {
  try {
    const { role, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const admins = await db.selectAdminsByRole(client, role, offset, limit);

    if (admins == null)
      res
        .status(204)
        .send(
          "No admins found with the selected role. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(admins);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:platform/:page", async (req, res) => {
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
          "No admins found for that platform. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(admins);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:section/:page", async (req, res) => {
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
          "No admins found in that section. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(admins);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/admins/:memberId", async (req, res) => {
  try {
    const { memberId } = req.params;

    const admin = await db.getAdminById(client, memberId);

    if (admin == null)
      res
        .status(204)
        .send(
          "Admin not found with that ID. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(admin);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/new/:memberId", async (_req, res) => {
  try {
    res.status(200).send("Create a new admin!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/new/:memberId", async (req, res) => {
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

    res.status(201).send("Admin successfully added!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/delete/:memberId", async (req, res) => {
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
    res.status(500).send(error);
  }
});

router.put("/update/:memberId", async (req, res) => {
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
    res.status(500).send(error);
  }
});