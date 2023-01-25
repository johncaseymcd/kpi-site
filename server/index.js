require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./database/db");
const members = require("./routes/members");
const admins = require("./routes/admins");
const locations = require("./routes/locations");
const venues = require("./routes/venues");
const sponsors = require("./routes/sponsors");
const venueContacts = require("./routes/venueContacts");
const sponsorContacts = require("./routes/sponsorContacts");
const emergencyContacts = require("./routes/emergencyContacts");
const expenses = require("./routes/expenses");

const app = express();
const client = db.getClient();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    res.status(200).send("Welcome to KPop Indiana!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.use("/members", members);
app.use("/admins", admins);
app.use("/locations", locations);
app.use("/venues", venues);
app.use("/sponsors", sponsors);
app.use("/contacts/venue", venueContacts);
app.use("/contacts/sponsor", sponsorContacts);
app.use("/contacts/emergency", emergencyContacts);
app.use("/expenses", expenses);

/*
-------------------------------------------------
              EXPENSE ENDPOINTS
-------------------------------------------------
*/



/*
-------------------------------------------------
              KPI EVENT ENDPOINTS
-------------------------------------------------
*/

app.get("/events/:page", async (req, res) => {
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

app.get("/data/events/venue/:venueId/:page", async (req, res) => {
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

app.get("/event/:eventId", async (req, res) => {
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

app.get("/data/events/new", async (_req, res) => {
  try {
    res.status(200).send("Create a new event!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/data/events/new", async (req, res) => {
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

app.put("/data/events/:eventId/update", async (req, res) => {
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

/*
-------------------------------------------------
                RSVP ENDPOINTS
-------------------------------------------------
*/

app.get("/data/rsvps/:eventId/:page", async (req, res) => {
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

app.get("/rsvps/:rsvpId", async (req, res) => {
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

app.get("/events/:eventId/rsvps/new", async (_req, res) => {
  try {
    res.status(200).send("RSVP to this event!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/events/:eventId/rsvps/new", async (req, res) => {
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

app.put("/rsvps/:rsvpId/update", async (req, res) => {
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

/*
-------------------------------------------------
              JOINER ENDPOINTS
-------------------------------------------------
*/

app.post("/data/events/:eventId/admins/:adminId", async(req, res) => {
  try {
    const { eventId, adminId } = req.params;

    const queryResponse = await db.addAdminToEvent(client, eventId, adminId);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to add the admin to the event.");

    res.status(201).send("Admin was successfully added to the event!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/data/events/:eventId/admins/:adminId", async(req, res) => {
  try {
    const { eventId, adminId } = req.params;

    const queryResponse = await db.removeAdminFromEvent(client, eventId, adminId);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to remove the admin from the event.");

    res.status(200).send("Admin was successfully removed from the event.");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/data/events/:eventId/sponsors/:sponsorId", async(req, res) => {
  try {
    const { eventId, sponsorId } = req.params;

    const queryResponse = await db.addSponsorToEvent(client, eventId, sponsorId);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to add the sponsor to the event.");

    res.status(201).send("Sponsor was successfully added to the event!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/data/events/:eventId/sponsors/:sponsorId", async(req, res) => {
  try {
    const { eventId, sponsorId } = req.params;

    const queryResponse = await db.removeSponsorFromEvent(client, eventId, sponsorId);

    if(!queryResponse) res.status(500).send("An unexpected error has occurred while attempting to remove the sponsor from the event.");

    res.status(200).send("Sponsor was successfully removed from the event!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/members/:memberId/contacts/:contactId", async(req, res) => {
  try {
    const { memberId, contactId } = req.params;

    const queryResponse = await db.addEmergencyContactToMember(client, memberId, contactId);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to add the emergency contact to the member.");

    res.status(201).send("Emergency contact was successfully added to the member!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/members/:memberId/contacts/:contactId", async(req, res) => {
  try {
    const { memberId, contactId } = req.params;

    const queryResponse = await db.removeEmergencyContactFromMember(client, memberId, contactId);

    if(!queryResponse) res.status(500).send("An unexpected error has occurred while attempting to remove the emergency contact from the member.");

    res.status(200).send("Emergency contact was successfully removed from the member!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/data/events/:eventId/expenses/:expenseId", async(req, res) => {
  try {
    const { eventId, expenseId } = req.params;

    const queryResponse = await db.addExpenseToEvent(client, eventId, expenseId);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to add the expense to the event.");

    res.status(201).send("Expense was successfully added to the event!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/data/rsvps/:rsvpId/members/:memberId", async(req, res) => {
  try {
    const { rsvpId, memberId } = req.params;

    const queryResponse = await db.addMemberToRsvp(client, rsvpId, memberId);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to add the member to the RSVP.");

    res.status(201).send("Member was successfully added to the RSVP!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete("/data/rsvps/:rsvpId/members/:memberId", async(req, res) => {
  try {
    const { rsvpId, memberId } = req.params;

    const queryResponse = await db.removeMemberFromRsvp(client, rsvpId, memberId);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to remove the member from the RSVP.");

    res.status(200).send("Member was successfully removed from the RSVP!");
  } catch (error) {
    res.status(500).send(error);
  }
});

const port = process.env.SERVER_PORT;

app.listen(port, () => {
  console.log(`API server exposed on port ${port}`);
});

module.exports = { app };
