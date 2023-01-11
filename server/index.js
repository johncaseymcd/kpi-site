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

app.get("/", async (req, res, next) => {
  try {
    res.send("Welcome to KPop Indiana!");
  } catch (error) {
    next(error);
  }
});

// select all from db
app.get("/api/members", async (_req, res, next) => {
  try {
    const members = await db.selectAllMembers(client);

    if (!members || members.length == 0) {
      res
        .status(204)
        .send(
          "No members found! Contact the database admin for more information."
        );
    }

    res.status(200).send(members);
  } catch (error) {
    next(error);
  }
});

app.get("/members/new", async (req, res, next) => {
  try{
    res.status(200).send("Create a new member profile!");
  } catch(error){
    next(error);
  }
});

app.post("/members/new", async (req, res, next) => {
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

    if (queryResponse)
      res.status(200).send("Successfully created member profile!");
  } catch (error) {
    next(error);
  }
});

app.get("/members/:memberId", async(req, res, next) => {
  try{
    const {memberId} = req.params;
    const member = await db.getMemberById(client, memberId);

    if(!member && member == null) res.status(404).send("Member profile does not exist!");

    res.status(200).send(member);
  } catch(error){
    next(error);
  }
});

app.delete("/members/delete/:memberId", async (req, res, next) => {
  try {
    const memberId = req.params.memberId;
    const queryResponse = db.deleteMember(client, memberId);

    if (queryResponse)
      res.status(200).send("Member profile has been successfully deleted!");
  } catch (error) {
    next(error);
  }
});

app.put("/members/update/:memberId", async (req, res, next) => {
  try {
    const memberId = req.params.memberId;
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

    const queryResponse = db.updateMember(
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
    if (queryResponse)
      res.status(200).send("Member profile was successfully updated!");
  } catch (error) {
    next(error);
  }
});

app.listen("3001", () => {});
