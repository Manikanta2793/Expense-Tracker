import { Router } from 'express'
import { getAllExpense, createExpense, updateExpense, deleteExpense } from '../controllers/expenseController.js'
import { authenticate } from '../middleware/authMiddleware.js'

const expenseRouter = Router()

expenseRouter.use(authenticate)

expenseRouter
	.get("/", getAllExpense)
	.post("/", createExpense)
expenseRouter
	.put("/:id", updateExpense)
	.delete("/:id", deleteExpense)


export{expenseRouter};



