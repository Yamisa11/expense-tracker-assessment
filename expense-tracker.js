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

    return{
        addExpense,
        allExpenses,
        expenseForCategory,
        deleteExpense,
        categoryTotals
    }
}