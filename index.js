/*import all the necessary modules. express,flash,bodyParse etc
-import connection string, factory function and database logic function 
-create a get route function that will get all the expenses in the table expense, get the expenses for a category and the total of all the total expenses
-assign all expenses result to variable all expenses, category expenses to result and all the totals to grand tottal
-render the variables the the expense handlebars
-add post route that will get input of expanse,amount and category and add that expense to the table expense using the addExpense function
-add allExpense route that will get the results from joining the two tables and render results to viw handlebars
-add post route that will delete an expense using the id of the expense
*/
import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import expenseTacker from "./expense-tracker.js";
import flash from "express-flash";
import session from "express-session";
import DBJS from "./db.js";
import expenseDB from "./DB/dbLogic.js";

const app = express();
let database = expenseDB(DBJS);

let expenseFunction = expenseTacker(database);
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "Yams",
  })
);
app.use(flash());

app.get("/", async (req, res) => {
  let allExpenses = await expenseFunction.allExpenses();
  let result = await expenseFunction.expenseForCategory();
  let grandTotal = await expenseFunction.categoryTotals();
  let message= req.flash("message")
  res.render("expense", {
    allExpenses: allExpenses,
    categoryTotal: result,
    grandTotal: grandTotal,
    message:message
  });
});

app.post("/add", async (req, res) => {
  let expense = req.body.expense;
  let amount = req.body.amount;
  let categoryid = req.body.category;
  

  if (expense == undefined || amount == undefined || categoryid == undefined) {
    req.flash("message", "make sure all values are entered and are correct");
  } else {
    await expenseFunction.addExpense(categoryid, amount, expense);
  }
  res.redirect("/");
});

app.get("/allExpense", async (req, res) => {
  let joinFunc = await database.joinFunction();

  res.render("view", {
    allExpenses: joinFunc,
  });
});

app.post("/delete/:id", async (req, res) => {
  let expenseId = req.params.id;
  console.log(expenseId);
  
  await expenseFunction.deleteExpense(expenseId);

  res.redirect("/allExpense");
});

let PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log("App started...", PORT);
});
