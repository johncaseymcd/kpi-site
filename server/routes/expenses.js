const express = require("express");
const router = express.Router();
const db = require("../database/db");

const client = db.getClient();

router.use((req, res, next) => {
  console.log("Expenses route");
  next();
});

router.get("/:page", async (req, res) => {
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

router.get("/:type/:page", async (req, res) => {
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

router.get("/:paid/:page", async (req, res) => {
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

router.get("/:year/:page", async (req, res) => {
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

router.get("/:year/:month/:page", async (req, res) => {
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

router.get("/due/:interval/:page", async (req, res) => {
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

router.get("/past-due/:page", async (req, res) => {
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

router.get("/id/:expenseId", async (req, res) => {
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

router.get("/new", async (_req, res) => {
  try {
    res.status(200).send("Enter a new expense!");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/new", async (req, res) => {
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

router.put("/update/:expenseId", async (req, res) => {
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

module.exports = router;