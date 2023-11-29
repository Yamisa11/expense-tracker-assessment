export default function tracker(database) {


  async function insertExpense(expense, amount, total, categoryId) {
    const query = `
        INSERT INTO expense (expense, amount, total, category_id)
        VALUES ($1, $2, $3, $4)
    `;
    await database.any(query, [expense, amount, total,categoryId]);
  }

  async function joinFunction() {
    const expenseQuery = `
                    SELECT * FROM expense  
                    JOIN category ON category.id = expense.category_id
                    
                `;
    const results = await database.any(expenseQuery);
    return results;
  }

  async function getAll(){
   const results = await database.any('SELECT * FROM expense')
   return results
  }

  async function expenseCategory(categoryId){
    let results = await database.any('SELECT * FROM expense WHERE category_id = $1', [categoryId])
    return results
  }

  async function deleteExp(expenseId){
    await database.none('DELETE FROM expense WHERE id = $1', [expenseId])
  }

  async function cateTotals(){
    let results = await database.any('SELECT total FROM expense;')
    return results
  }

  return {
    insertExpense,
    getAll,
    expenseCategory,
    deleteExp,
    cateTotals,
    joinFunction
  };

}
