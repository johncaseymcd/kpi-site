require("dotenv").config();
const express = require("express");
const cors = require("cors");
const members = require("./routes/members");
const admins = require("./routes/admins");
const locations = require("./routes/locations");
const venues = require("./routes/venues");
const sponsors = require("./routes/sponsors");
const venueContacts = require("./routes/venueContacts");
const sponsorContacts = require("./routes/sponsorContacts");
const emergencyContacts = require("./routes/emergencyContacts");
const expenses = require("./routes/expenses");
const events = require("./routes/events");
const rsvps = require("./routes/rsvps");
const data = require("./routes/data");

const app = express();

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
app.use("/events", events);
app.use("/rsvp", rsvps);
app.use("/data", data);

const port = process.env.SERVER_PORT;

app.listen(port, () => {
  console.log(`API server exposed on port ${port}`);
});

module.exports = { app };
