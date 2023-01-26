const express = require("express");
const router = express.Router();
const db = require("..base/db");

const client = db.getClient();

router.use((req, res, next) => {
  console.log("Data route");
  next();
});

router.post("/events/:eventId/admins/:adminId", async(req, res) => {
  try {
    const { eventId, adminId } = req.params;

    const queryResponse = await db.addAdminToEvent(client, eventId, adminId);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to add the admin to the event.");

    res.status(201).send("Admin was successfully added to the event!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/events/:eventId/admins/:adminId", async(req, res) => {
  try {
    const { eventId, adminId } = req.params;

    const queryResponse = await db.removeAdminFromEvent(client, eventId, adminId);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to remove the admin from the event.");

    res.status(200).send("Admin was successfully removed from the event.");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/events/:eventId/sponsors/:sponsorId", async(req, res) => {
  try {
    const { eventId, sponsorId } = req.params;

    const queryResponse = await db.addSponsorToEvent(client, eventId, sponsorId);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to add the sponsor to the event.");

    res.status(201).send("Sponsor was successfully added to the event!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/events/:eventId/sponsors/:sponsorId", async(req, res) => {
  try {
    const { eventId, sponsorId } = req.params;

    const queryResponse = await db.removeSponsorFromEvent(client, eventId, sponsorId);

    if(!queryResponse) res.status(500).send("An unexpected error has occurred while attempting to remove the sponsor from the event.");

    res.status(200).send("Sponsor was successfully removed from the event!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/members/:memberId/contacts/:contactId", async(req, res) => {
  try {
    const { memberId, contactId } = req.params;

    const queryResponse = await db.addEmergencyContactToMember(client, memberId, contactId);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to add the emergency contact to the member.");

    res.status(201).send("Emergency contact was successfully added to the member!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/members/:memberId/contacts/:contactId", async(req, res) => {
  try {
    const { memberId, contactId } = req.params;

    const queryResponse = await db.removeEmergencyContactFromMember(client, memberId, contactId);

    if(!queryResponse) res.status(500).send("An unexpected error has occurred while attempting to remove the emergency contact from the member.");

    res.status(200).send("Emergency contact was successfully removed from the member!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/events/:eventId/expenses/:expenseId", async(req, res) => {
  try {
    const { eventId, expenseId } = req.params;

    const queryResponse = await db.addExpenseToEvent(client, eventId, expenseId);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to add the expense to the event.");

    res.status(201).send("Expense was successfully added to the event!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/rsvps/:rsvpId/members/:memberId", async(req, res) => {
  try {
    const { rsvpId, memberId } = req.params;

    const queryResponse = await db.addMemberToRsvp(client, rsvpId, memberId);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to add the member to the RSVP.");

    res.status(201).send("Member was successfully added to the RSVP!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/rsvps/:rsvpId/members/:memberId", async(req, res) => {
  try {
    const { rsvpId, memberId } = req.params;

    const queryResponse = await db.removeMemberFromRsvp(client, rsvpId, memberId);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to remove the member from the RSVP.");

    res.status(200).send("Member was successfully removed from the RSVP!");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;