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
          "No members found! Please contact the database admin if you believe this is an error."
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
          "No members found in the selected city. Please contact the database admin if you believe this is an error."
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
          "No members found in the selected ZIP code. Please contact the database admin if you believe this is an error."
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
          "No members found for your current selection. Please contact the database admin if you believe this is an error."
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
          "No members with birthdays this week! Please contact the database admin if you believe this is an error."
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
          "No members found for your current selection. Please contact the database admin if you believe this is an error."
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
          "No members found on the mailing list. Please contact the database admin if you believe this is an error."
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
          "No members found over 18. Please contact the database admin if you believe this is an error."
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
          "No members found over 21. Please contact the database admin if you believe this is an error."
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
          "Member not found by ID. Please contact the database admin if you believe this is an error."
        );

    res.status(200).send(member);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/members/new", async (req, res) => {
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
          "No admins found. Please contact the database admin if you believe this is an error."
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
          "No admins found with the selected role. Please contact the database admin if you believe this is an error."
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
          "No admins found for that platform. Please contact the database admin if you believe this is an error."
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
          "No admins found in that section. Please contact the database admin if you believe this is an error."
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
          "Admin not found with that ID. Please contact the database admin if you believe this is an error."
        );

    res.status(200).send(admin);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/admins/new/:memberId", async (req, res) => {
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

app.get("/data/locations/:page", async(req, res) => {
  try{
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const locations = await db.selectAllLocations(client, offset, limit);

    if(locations == null) res.status(204).send("No locations found. Please contact the database admin if you believe this is an error.");

    res.status(200).send(locations);
  } catch(error){
    res.status(error.status).send(error);
  }
});

app.get("/data/locations/:type/:page", async(req, res) => {
  try {
    const { type, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const locations = await db.selectLocationsByType(client, type, offset, limit);

    if(locations == null) res.status(204).send("No locations found with that type. Please contact the database admin if you believe this is an error.");

    res.status(200).send(locations);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/locations/:city/:page", async(req, res) => {
  try {
    const { city, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const locations = await db.selectLocationsByCity(client, city, offset, limit);

    if(locations == null) res.status(204).send("No locations found in that city. Please contact the database admin if you believe this is an error.");

    res.status(200).send(locations);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/locations/:locationId", async(req, res) => {
  try {
    const { locationId } = req.params;

    const location = await db.getLocationById(client, locationId);

    if(location == null) res.status(204).send("No location found with that ID. Please contact the database admin if you believe this is an error.");

    res.status(200).send(location);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/locations/new", async(req, res) => {
  try{
    res.status(200).send("Add a new location!");
  } catch(error){
    res.status(error.status).send(error);
  }
});

app.post("/data/locations/new", async(req, res) => {
  try{
    const { name, streetAddress, unitNumber, city, state, zip, locationType } = req.body;

    const queryResponse = await db.addLocation(client, name, streetAddress, unitNumber, city, state, zip, locationType);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to add the location.");

    res.status(200).send("Location successfully added!");
  } catch(error){
    res.status(error.status).send(error);
  }
});

app.put("/data/locations/:locationId/update", async(req, res) => {
  try{
    const { locationId } = req.params;
    const { name, streetAddress, unitNumber, city, state, zip, locationType } = req.body;

    const queryResponse = await db.updateLocation(client, locationId, name, streetAddress, unitNumber, city, state, zip, locationType);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to update the location.");

    res.status(200).send("Location information successfully updated!");
  } catch(error){
    res.status(error.status).send(error):
  }
});

app.put("/data/locations/:locationId/delete", async(req, res) => {
  try {
    const { locationId } = req.params;

    const queryResponse = await db.removeLocation(client, locationId);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to delete the location.");

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

app.get("/data/venues/:page", async(req, res) => {
  try{
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const venues = await db.selectAllVenues(client, offset, limit);

    if(venues == null) res.status(204).send("No venues found. Please contact the database admin if you believe this is an error.");

    res.status(200).send(venues);
  } catch(error){
    res.status(error.status).send(error);
  }
});

app.get("/data/venues/:type/:page", async(req, res) => {
  try{
    const { type, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const venues = await db.selectVenuesByCostType(client, type, offset, limit);

    if(venues == null) res.status(204).send("No venues found with that cost type. Please contact the database admin if you believe this is an error.");

    res.status(200).send(venues);
  } catch(error){
    res.status(error.status).send(error);
  }
});

app.get("/venues/:venueId", async(req, res) => {
  try{
    const { venueId } = req.params;

    const venue = await db.getVenueById(client, venueId);

    if(venue == null) res.status(204).send("No venue found with that ID. Please contact the database admin if you believe this is an error.");

    res.status(200).send(venue);
  } catch(error){
    res.status(error.status).send(error);
  }
});

app.get("/data/venues/new", async(req, res) => {
  try{
    res.status(200).send("Add a new venue!");
  } catch(error){
    res.status(error.status).send(error);
  }
});

app.post("/data/venues/new", async(req, res) => {
  try{
    const { locationId, name, contact, cost, costType } = req.body;

    const queryResponse = await db.addVenue(client, locationId, name, contact, cost, costType);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to add the venue.");

    res.status(200).send("Venue successfully added!");
  } catch(error){
    res.status(error.status).send(error);
  }
});

app.put("/data/venues/:venueId/update", async(req, res) => {
  try{
    const { venueId } = req.params;
    const { locationId, name, contact, cost, costType } = req.body;

    const queryResponse = await db.updateVenue(client, venueId, locationId, name, contact, cost, costType);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to update the venue.");

    res.status(200).send("Venue updated successfully!");
  } catch(error){
    res.status(error.status).send(error);
  }
});

app.put("/data/venues/:venueId/delete", async(req, res) => {
  try {
    const { venueId } = req.params;

    const queryResponse = await db.removeVenue(client, venueId);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to delete the venue.");

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

app.get("/data/sponsors/:page", async(req, res) => {
  try{
    const { page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const sponsors = await db.selectAllSponsors(client, offset, limit);

    if(sponsors == null) res.status(204).send("No sponsors found. Please contact the database admin if you believe this is an error.");

    res.status(200).send(sponsors);
  } catch(error){
    res.status(error.status).send(error);
  }
});

app.get("/data/sponsors/:type/:page", async(req, res) => {
  try {
    const { type, page } = req.params;
    const limit = process.env.RECORDS_PER_PAGE;
    const offset = limit * (page - 1);

    const sponsors = await db.selectSponsorsByType(client, type, offset, limit);

    if(sponsors == null) res.status(204).send("No sponsors found with that type. Please contact the database admin if you believe this is an error.");

    res.status(200).send(sponsors);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/sponsors/:sponsorId", async(req, res) => {
  try {
    const { sponsorId } = req.params;

    const sponsor = await db.getSponsorById(client, sponsorId);

    if(sponsor == null) res.status(204).send("No sponsor found with that ID. Please contact the database admin if you believe this is an error.");

    res.status(200).send(sponsor);
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.get("/data/sponsors/new", async(req, res) => {
  try {
    res.status(200).send("Add a new sponsor!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.post("/data/sponsors/new", async(req, res) => {
  try {
    const { name, sponsorType, contact } = req.body;

    const queryResponse = await db.addSponsor(client, name, sponsorType, contact);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to add the sponsor.");

    res.status(200).send("Sponsor successfully added!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.put("/data/sponsors/:sponsorId/update", async(req, res) => {
  try {
    const { sponsorId } = req.params;
    const { name, sponsorType, contact } = req.body;

    const queryResponse = await db.updateSponsor(client, sponsorId, name, sponsorType, contact);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to update the sponsor.");

    res.status(200).send("Sponsor successfully updated!");
  } catch (error) {
    res.status(error.status).send(error);
  }
});

app.put("/data/sponsors/:sponsorId/delete", async(req, res) => {
  try {
    const { sponsorId } = req.params;

    const queryResponse = await db.removeSponsor(client, sponsorId);

    if(!queryResponse) res.status(500).send("An unexpected error occurred while attempting to delete the sponsor.");

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

app.listen("6633", () => {});
