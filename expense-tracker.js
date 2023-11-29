/*
-create module expense and export it
-create function addExpense that will calculate the total amount using the amount and category id given
-addExpense will insert expense into the database using the calculated total,amount,expense and the category id given
-create function allExpense that will get all the expenses in the database and return the results
-create function expenseForCategory that will get results from the joinFunction and froup the results/ expenses according to their category types
-create function deleteExpense that will delete and expense from the table using the expense id
-create function category totals that will add the totals of the expenses and return the garnd total
*/

export default function expense(database){

    async function addExpense(categoryid, amount,expense){
        let total = 0

        if (categoryid == 1){
            total = amount * 4
        }
        if (categoryid == 2 || categoryid == 5){
            total = amount 
        }
        if (categoryid == 3){
            total = (amount * 5)*4
        }
        if (categoryid == 4){
            total = (amount * 2)*4
        }
        if (categoryid == 6){
            total = amount * 30
        }

        await database.insertExpense(expense, amount, total,categoryid)
    }

    async function allExpenses(){
      let results=  await database.getAll()
      return results
    }
    async function expenseForCategory() {
        let data = await database.joinFunction()

        return data.reduce((result, item) => {
            const categoryType = item.category_type;
            if (!result[categoryType]) {
                result[categoryType] = {
                    category_type: categoryType,
                    total: 0
                };
            }
            result[categoryType].total += parseFloat(item.total);
    
            return result;
        }, {});
    }
    
    

   

    async function deleteExpense(expenseid){
        await database.deleteExp(expenseid)
    }

    async function categoryTotals(){
        let total = 0
        let results = await database.cateTotals()
        for (let i = 0; i < results.length; i++) {
            const element = results[i];
            total = total + parseFloat(element.total)
        }
        return total
    }
    async function reset(){
        await database.reset()
    }

    return{
        addExpense,
        allExpenses,
        expenseForCategory,
        deleteExpense,
        categoryTotals,
        reset
    }
}