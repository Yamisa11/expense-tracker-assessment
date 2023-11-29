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
  let allExpenses = await expenseFunction.allExpenses()
  let result = await expenseFunction.groupData()
  console.log(result);
    res.render("expense",{
        allExpenses: allExpenses,
        categoryTotal: result
    });
  });

app.post("/add", async (req, res) => {
    let expense = req.body.expense;
    let amount = req.body.amount;
    let categoryid = req.body.category;

   await expenseFunction.addExpense(categoryid,amount,expense)
   res.redirect("/")
  });

  let PORT = process.env.PORT || 9000;
  app.listen(PORT, () => {
    console.log("App started...", PORT);
  });