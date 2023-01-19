require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./database/db");
const helper = require("./utils/helper");

const app = express();
const client = await db.getClient();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
-------------------------------------------------
                  HOME PAGE
-------------------------------------------------
*/

app.get("/", async (req, res) => {
  try {
    res.status(200).send("Welcome to KPop Indiana!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

/*
-------------------------------------------------
                MEMBERS ENDPOINTS
-------------------------------------------------
*/

app.get("/data/members/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectAllMembers(client, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members found! Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/members/:city/:page", async (req, res) => {
  try {
    const { city, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersByCity(client, city, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members found in the selected city. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/members/:zip/:page", async (req, res) => {
  try {
    const { zip, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersByZip(client, zip, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members found in the selected ZIP code. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/members/:foundMethod/:page", async (req, res) => {
  try {
    const { foundMethod, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersByFoundMethod(
      client,
      foundMethod,
      offset,
      limit
    );

    if (members == null)
      res
        .status(204)
        .send(
          "No members found for your current selection. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/members/birthday/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersByBirthday(client, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members with birthdays this week! Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/members/events/:status/:page", async (req, res) => {
  try {
    const { status, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersByEventAttendanceStatus(
      client,
      status,
      offset,
      limit
    );

    if (members == null)
      res
        .status(204)
        .send(
          "No members found for your current selection. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/members/mailto/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersOnMailingList(client, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members found on the mailing list. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/members/over18/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersOver18(client, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members found over 18. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/members/over21/:page", async (req, res) => {
  try {
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const members = await db.selectMembersOver21(client, offset, limit);

    if (members == null)
      res
        .status(204)
        .send(
          "No members found over 21. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(members);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/members/:memberId", async (req, res) => {
  try {
    const { memberId } = req.params;

    const member = await db.getMemberById(client, memberId);

    if (member == null)
      res
        .status(204)
        .send(
          "Member not found by ID. Please contact the site admin if you believe this is an error."
        );

    res.status(200).send(member);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/members/new", async (_req, res) => {
  try {
    res.status(200).send("Create a new member profile!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.post("/members/new", async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      nickname,
      email,
      phoneNumber,
      streetAddress,
      unitNumber,
      city,
      state,
      zip,
      foundMethod,
      pronouns,
      neopronouns,
      birthday,
      twitterHandle,
      instagramHandle,
      dietaryRestrictions,
      hasAttendedEvent,
      isOnMailingList,
    } = req.body;
    const isAdmin = false;
    const isOver18 = helper.checkAge(
      birthday.getFullYear(),
      birthday.getMonth(),
      birthday.getDate(),
      18
    );
    const isOver21 = helper.checkAge(
      birthday.getFullYear(),
      birthday.getMonth(),
      birthday.getDate(),
      21
    );

    const queryResponse = await db.addMember(
      client,
      firstName,
      middleName,
      lastName,
      nickname,
      email,
      phoneNumber,
      streetAddress,
      unitNumber,
      city,
      state,
      zip,
      foundMethod,
      pronouns,
      neopronouns,
      twitterHandle,
      instagramHandle,
      dietaryRestrictions,
      hasAttendedEvent,
      isOnMailingList,
      isAdmin,
      isOver18,
      isOver21
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error has occurred while attempting to create the member profile."
        );

    res.status(200).send("Member profile successfully created!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.put("/members/:memberId/delete", async (req, res) => {
  try {
    const { memberId } = req.params;
    const queryResponse = await db.removeMember(client, memberId);

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error has occurred while attempting to delete the member profile."
        );

    res.status(200).send("Member profile successfully deleted!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.put("/members/:memberId/update", async (req, res) => {
  try {
    const { memberId } = req.params;
    const {
      firstName,
      middleName,
      lastName,
      nickname,
      email,
      phoneNumber,
      streetAddress,
      unitNumber,
      city,
      state,
      zip,
      pronouns,
      neopronouns,
      twitterHandle,
      instagramHandle,
      dietaryRestrictions,
    } = req.body;

    const queryResponse = await db.updateMemberProfile(
      client,
      memberId,
      firstName,
      middleName,
      lastName,
      nickname,
      email,
      phoneNumber,
      streetAddress,
      unitNumber,
      city,
      state,
      zip,
      pronouns,
      neopronouns,
      twitterHandle,
      instagramHandle,
      dietaryRestrictions
    );

    if (!queryResponse)
      res
        .status(500)
        .send(
          "An unexpected error occurred while attempting to update the member profile."
        );

    res.status(200).send("Member profile successfully updated!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

/*
-------------------------------------------------
              ADMIN ENDPOINTS
-------------------------------------------------
*/

app.get("/data/admins/:page", async (req, res) => {
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
    res.status(error.status).send(error);
  }
});

app.get("/data/admins/:role/:page", async (req, res) => {
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
    res.status(error.status).send(error);
  }
});

app.get("/data/admins/:platform/:page", async (req, res) => {
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
    res.status(error.status).send(error);
  }
});

app.get("/data/admins/:section/:page", async (req, res) => {
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
    res.status(error.status).send(error);
  }
});

app.get("/admins/:memberId", async (req, res) => {
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
    res.status(error.status).send(error);
  }
});

app.get("/data/admins/new/:memberId", async (_req, res) => {
  try {
    res.status(200).send("Create a new admin!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.post("/data/admins/new/:memberId", async (req, res) => {
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

    res.status(200).send("Admin successfully added!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.put("/data/admins/:memberId/delete", async (req, res) => {
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
    res.status(error.status).send(error);
  }
});

app.put("/data/admins/:memberId/update", async (req, res) => {
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
    res.status(error.status).send(error);
  }
});

/*
-------------------------------------------------
              LOCATION ENDPOINTS
-------------------------------------------------
*/

app.get("/data/locations/:page", async (req, res) => {
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
    res.status(error.status).send(error);
  }
});

app.get("/data/locations/:type/:page", async (req, res) => {
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
    res.status(error.status).send(error);
  }
});

app.get("/data/locations/:city/:page", async (req, res) => {
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
    res.status(error.status).send(error);
  }
});

app.get("/locations/:locationId", async (req, res) => {
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
    res.status(error.status).send(error);
  }
});

app.get("/data/locations/new", async (_req, res) => {
  try {
    res.status(200).send("Add a new location!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.post("/data/locations/new", async (req, res) => {
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

    res.status(200).send("Location successfully added!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.put("/data/locations/:locationId/update", async (req, res) => {
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
    res.status(error.status).send(error);
  }
});

app.put("/data/locations/:locationId/delete", async (req, res) => {
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
    res.status(error.status).send(error);
  }
});

/*
-------------------------------------------------
                VENUE ENDPOINTS
-------------------------------------------------
*/

app.get("/data/venues/:page", async (req, res) => {
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
    res.status(error.status).send(error);
  }
});

app.get("/data/venues/:type/:page", async (req, res) => {
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
    res.status(error.status).send(error);
  }
});

app.get("/venues/:venueId", async (req, res) => {
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
    res.status(error.status).send(error);
  }
});

app.get("/data/venues/new", async (_req, res) => {
  try {
    res.status(200).send("Add a new venue!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.post("/data/venues/new", async (req, res) => {
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

    res.status(200).send("Venue successfully added!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.put("/data/venues/:venueId/update", async (req, res) => {
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
    res.status(error.status).send(error);
  }
});

app.put("/data/venues/:venueId/delete", async (req, res) => {
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
    res.status(error.status).send(error);
  }
});

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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
  }
});

app.get("/data/sponsors/new", async (_req, res) => {
  try {
    res.status(200).send("Add a new sponsor!");
  } catch (error) {
    res.status(error.status).send(error);
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

    res.status(200).send("Sponsor successfully added!");
  } catch (error) {
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
  }
});

app.get("/data/contacts/venue/new", async (_req, res) => {
  try {
    res.status(200).send("Add a new venue contact!");
  } catch (error) {
    res.status(error.status).send(error);
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

    res.status(200).send("Venue contact was successfully added!");
  } catch (error) {
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
  }
});

app.get("/data/contacts/sponsor/new", async (_req, res) => {
  try {
    res.status(200).send("Add a new sponsor contact!");
  } catch (error) {
    res.status(error.status).send(error);
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

    res.status(200).send("Sponsor contact was successfully added!");
  } catch (error) {
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
  }
});

app.get("/data/contacts/emergency/new", async (_req, res) => {
  try {
    res.status(200).send("Add a new emergency contact!");
  } catch (error) {
    res.status(error.status).send(error);
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

    res.status(200).send("Emergency contact was successfully added!");
  } catch (error) {
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
  }
});

app.get("/data/expenses/new", async (_req, res) => {
  try {
    res.status(200).send("Enter a new expense!");
  } catch (error) {
    res.status(error.status).send(error);
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

    res.status(200).send("Expense was successfully added!");
  } catch (error) {
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
  }
});

app.get("/data/events/new", async (_req, res) => {
  try {
    res.status(200).send("Create a new event!");
  } catch (error) {
    res.status(error.status).send(error);
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

    res.status(200).send("Event was successfully created!");
  } catch (error) {
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
  }
});

app.get("/events/:eventId/rsvps/new", async (_req, res) => {
  try {
    res.status(200).send("RSVP to this event!");
  } catch (error) {
    res.status(error.status).send(error);
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

    res.status(200).send("RSVP was successfully submitted!");
  } catch (error) {
    res.status(error.status).send(error);
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
    res.status(error.status).send(error);
  }
});

/*
-------------------------------------------------
              JOINER ENDPOINTS
-------------------------------------------------
*/

app.listen("6633", () => {});
