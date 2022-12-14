const express = require("express");
const db = require("./database/db");
const cors = require("cors");

const app = express();
const client = db.getClient();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to KPop Indiana!");
});

// select all from db
app.get("/members", (_req, res) => {
  const queryResponse = db.selectAllMembers(client);

  if (!queryResponse) throw new Error("No members found");
  res.send(queryResponse);
});

app.post("/members/new", (req, res) => {
  const name = req.body.name;
  const birthday = req.body.birthday;

  const queryResponse = db.addMember(client, name, birthday);
  if (!queryResponse) throw new Error("Could not add new member");
  res.send(queryResponse);
});

app.delete("/members/delete/:memberId", (req, res) => {
  const memberId = req.params.memberId;

  const queryResponse = db.deleteMember(client, memberId);
  if (!queryResponse) throw new Error("Could not delete member");
  res.send(queryResponse);
});

app.put("/members/update/:memberId", (req, res) => {
  const memberId = req.params.memberId;
  const newMember = req.body.newMember;
  const name = newMember.name;
  const birthday = newMember.birthday;

  const queryResponse = db.updateMember(client, memberId, name, birthday);
  if (!queryResponse) throw new Error("Could not update member");
  res.send(queryResponse);
});

app.listen("3001", () => {});
