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

    it('should be able to insert an expense to table expense and retrieve it', async () => {
        await expenseFunction.addExpense(2, 150, "brunch");
    
        const result = await expenseFunction.getAll();
        assert.strictEqual(result[0], {
            id: 2,
            expense: 'brunch',
            amount: 150,
            total: '1500',
            category_id: 5
          });
        
      });


})