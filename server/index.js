require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./database/db");
const members = require("./routes/members");
const admins = require("./routes/admins");
const locations = require("./routes/locations");
const venues = require("./routes/venues");

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

/*
-------------------------------------------------
              SPONSOR ENDPOINTS
-------------------------------------------------
*/

app.get("/data/sponsors/:page", async (req, res) => {
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

app.get("/data/sponsors/:type/:page", async (req, res) => {
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

app.get("/sponsors/:sponsorId", async (req, res) => {
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

app.get("/data/sponsors/new", async (_req, res) => {
  try {
    res.status(200).send("Add a new sponsor!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/data/sponsors/new", async (req, res) => {
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

app.put("/data/sponsors/:sponsorId/update", async (req, res) => {
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

app.put("/data/sponsors/:sponsorId/delete", async (req, res) => {
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

/*
-------------------------------------------------
            VENUE CONTACT ENDPOINTS
-------------------------------------------------
*/

app.get("/data/contacts/venue/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const contacts = await db.selectAllVenueContacts(client, offset, limit);

    if (contacts == null)
      res
        .status(204)
        .send(
          "No venue contacts found. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(contacts);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/data/contacts/venue/:contactId", async (req, res) => {
  try {
    const { contactId } = req.params;

    const contact = await db.getVenueContactById(client, contactId);

    if (contact == null)
      res
        .status(204)
        .send(
          "No venue contacts found with that ID. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(contact);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/data/contacts/venue/new", async (_req, res) => {
  try {
    res.status(200).send("Add a new venue contact!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/data/contacts/venue/new", async (req, res) => {
  try {
    const { venueId, firstName, lastName, email, phoneNumber } = req.body;

    const queryResponse = await db.addVenueContact(
      client,
      venueId,
      firstName,
      lastName,
      email,
      phoneNumber
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to add the venue contact."
        );

    res.status(201).send("Venue contact was successfully added!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/data/contacts/venue/:contactId/update", async (req, res) => {
  try {
    const { contactId } = req.params;
    const { venueId, firstName, lastName, email, phoneNumber } = req.body;

    const queryResponse = await db.updateVenueContact(
      client,
      contactId,
      venueId,
      firstName,
      lastName,
      email,
      phoneNumber
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to update the venue contact."
        );

    res.status(200).send("Venue contact was successfully updated!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/data/contacts/venue/:contactId/delete", async (req, res) => {
  try {
    const { contactId } = req.params;

    const queryResponse = await db.removeVenueContact(client, contactId);

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to delete the venue contact."
        );

    res.status(200).send("Venue contact was successfully deleted!");
  } catch (error) {
    res.status(500).send(error);
  }
});

/*
-------------------------------------------------
          SPONSOR CONTACT ENDPOINTS
-------------------------------------------------
*/

app.get("/data/contacts/sponsor/:page", async (req, res) => {
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

app.get("/data/contacts/sponsor/:contactId", async (req, res) => {
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

app.get("/data/contacts/sponsor/new", async (_req, res) => {
  try {
    res.status(200).send("Add a new sponsor contact!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/data/contacts/sponsor/new", async (req, res) => {
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

app.put("/data/contacts/sponsor/:contactId/update", async (req, res) => {
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

app.put("/data/contacts/sponsor/:contactId/delete", async (req, res) => {
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

/*
-------------------------------------------------
          EMERGENCY CONTACT ENDPOINTS
-------------------------------------------------
*/

app.get("/data/contacts/emergency/:page", async (req, res) => {
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

app.get("/data/contacts/emergency/:contactId", async (req, res) => {
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

app.get("/data/contacts/emergency/new", async (_req, res) => {
  try {
    res.status(200).send("Add a new emergency contact!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/data/contacts/emergency/new", async (req, res) => {
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

app.put("/data/contacts/emergency/:contactId/update", async (req, res) => {
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

app.put("/data/contacts/emergency/:contactId/delete", async (req, res) => {
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

/*
-------------------------------------------------
              EXPENSE ENDPOINTS
-------------------------------------------------
*/

app.get("/data/expenses/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const expenses = await db.selectAllExpenses(client, offset, limit);

    if (expenses == null)
      res
        .status(204)
        .send(
          "No expenses found. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(expenses);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/data/expenses/:type/:page", async (req, res) => {
  try {
    const { type, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const expenses = await db.selectExpensesByType(client, type, offset, limit);

    if (expenses == null)
      res
        .status(204)
        .send(
          "No expenses found with that type. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(expenses);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/data/expenses/:paid/:page", async (req, res) => {
  try {
    const { paid, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const expenses = await db.selectExpensesByPaidStatus(
      client,
      paid,
      offset,
      limit
    );

    if (expenses == null)
      res
        .status(204)
        .send(
          "No expenses found with that status. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(expenses);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/data/expenses/:year/:page", async (req, res) => {
  try {
    const { year, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const expenses = await db.selectExpensesByYear(client, year, offset, limit);

    if (expenses == null)
      res
        .status(204)
        .send(
          "No expenses found for the given year. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(expenses);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/data/expenses/:year/:month/:page", async (req, res) => {
  try {
    const { year, month, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const expenses = await db.selectExpensesByMonthAndYear(
      client,
      year,
      month,
      offset,
      limit
    );

    if (expenses == null)
      res
        .status(204)
        .send(
          "No expenses found for the given month and year. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(expenses);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/data/expenses/:interval/:page", async (req, res) => {
  try {
    const { interval, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const expenses = await db.selectExpensesByDueDate(
      client,
      interval,
      offset,
      limit
    );

    if (expenses == null)
      res
        .status(204)
        .send(
          "No expenses found that are due within the given date range. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(expenses);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/data/expenses/past-due/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const expenses = await db.selectExpensesByPastDue(client, offset, limit);

    if (expenses == null)
      res
        .status(204)
        .send(
          "No past due expenses found. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(expenses);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/data/expenses/:expenseId", async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expense = await db.getExpenseById(client, expenseId);

    if (expense == null)
      res
        .status(204)
        .send(
          "No expense found with that ID. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(expense);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get("/data/expenses/new", async (_req, res) => {
  try {
    res.status(200).send("Enter a new expense!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/data/expenses/new", async (req, res) => {
  try {
    const {
      name,
      cost,
      expenseType,
      isPaid,
      incurredDate,
      dueDate,
      isTaxDeductible,
    } = req.body;

    const queryResponse = await db.addExpense(
      client,
      name,
      cost,
      expenseType,
      isPaid,
      incurredDate,
      dueDate,
      isTaxDeductible
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to add the expense."
        );

    res.status(201).send("Expense was successfully added!");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put("/data/expenses/:expenseId/update", async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { isPaid } = req.body;

    const queryResponse = await db.updateExpense(client, expenseId, isPaid);

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to update the expense."
        );

    res.status(200).send("Expense was successfully updated!");
  } catch (error) {
    res.status(500).send(error);
  }
});

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
