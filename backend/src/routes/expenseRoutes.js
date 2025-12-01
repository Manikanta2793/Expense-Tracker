import {Router} from 'express'
import { getAllExpense,createExpense,updateExpense,deleteExpense } from '../controllers/expenseController.js'

const expenseRouter = Router()


expenseRouter
.get("/",getAllExpense)
.post("/",createExpense);
expenseRouter
.put("/:id",updateExpense)
.delete("/:id",deleteExpense)


export{expenseRouter};



