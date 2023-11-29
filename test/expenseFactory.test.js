import assert from "assert"
import expenseFactoryFunction from "../expense-tracker";
import pgPromise from 'pg-promise';

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder123@localhost:5432/expense-tracker';

const db = pgPromise()(connectionString);

describe('Expense Tracker factory Function tests', () => {
    let expenseFunction = expenseFactoryFunction(db)

    beforeEach(async () => {
        await expenseFunction.reset()
    })

    it('should be ale to get all the expenses in the database'), async () => {
       let results = await expenseFunction.allExpenses()

       await expenseFunction.addExpense(1, 30, "airtime");
       await expenseFunction.addExpense(6, 40, "lunch");

       assert.deepStrictEqual(results, [{  id: 1,
        expense: 'airtime',
        amount: 150,
        total: 600,
        category_id: 1},
        {  id: 2,
            expense: 'lunch',
            amount: 50,
            total: 1500,
            category_id: 6
        }])
       
    }

    it('should be able to insert an expense to table expense and retrieve it', async () => {
        await expenseFunction.addExpense(2, 150, "brunch");
    
        const result = await expenseFunction.getAll();
        assert.strictEqual(result[0], {
            id: 1,
            expense: 'brunch',
            amount: 150,
            total: 150,
            category_id: 2
          });
        
      });

      it("should be able to delete an expense from the table expense using the expense id", async () => {
        await expenseFunction.addExpense(2, 150, "brunch");

        await expenseFunction.deleteExpense(1)
       let results = await expenseFunction.allExpenses()

        assert.strictEqual(results, [])
      })

      it("should be able to add all the totals of the expenses and return a grand total", async () => {

       await expenseFunction.addExpense(1, 30, "airtime");
       await expenseFunction.addExpense(6, 40, "lunch");

       let results = expenseFunction.categoryTotals()

       assert.deepStrictEqual(results, 2100)
      })
})