import userDetails from "../models/user.js";
import bcrypt from "bcryptjs"

const register = async (req,res)=>{

    try{
        const {name,email,password} = req.body
        if(!name||!email||!password){
            return res.status(400).json({message:"ALL fields are required"})

        }
        const emailExists = await userDetails.findOne({email})
        if(emailExists){
            return res.status(400).json({message:"Email already Exists"});

        }

        const hashedPassword = await bcrypt.hash(password,10);

        const new_user = new userDetails({name,email,password:hashedPassword});
        new_user.save()

        return res.status(200).json({message:"user registered successfully"})
}
    catch(error){
        console.log(error)


    }
}
export default register;
