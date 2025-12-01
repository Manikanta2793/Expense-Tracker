import { Expense } from "../models/expenseModel.js";



const createExpense = async (req, res) =>{

    try{
        const{description,amount,category,date,notes} = req.body;
        const expense = new Expense({description,amount,category,date,notes});
        const newExpense = await expense.save();
        res.status(201).json({success:true,data:newExpense});
    }catch(error){
        res.status(500).json({success:false,message:error.message});
    }




}
const getAllExpense = async (req,res) =>{
    try{
        const expense = await Expense.find();
        res.json({success:true,count:expense.length,data:expense})
    }
    catch(error){
        res.status(500).json({success:false,message:error.message})
    }



}
const updateExpense = async (req,res) =>{
    try{
        const {id} = req.params
        const updateExpense = await Expense.findByIdAndUpdate(id,req.body,{new:true,runValidators:true});

        if(!updateExpense)
            return res.status(404).json({success:false,message:"Not Found"})
        res.json({success:true,data:updateExpense})

    }
    catch(error){
        res.status(500).json({success:false,message:error.message})

    }
}
const deleteExpense = async (req,res) =>{
    try{
        const {id} = req.params
        const deleteExpense = await Expense.findByIdAndDelete(id)
        if(!deleteExpense)
            return res.status(404).json({success:false,message:"Not Found"});
         res.json({success:true,msg:'deleted successfully'})
        

    }
    catch(error){
         res.status(500).json({success:false,message:error.message})
    }



}

export {createExpense,getAllExpense,updateExpense,deleteExpense};




