import mongoose from "mongoose";

const user = new mongoose.Schema({
name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true
}




})
const userDetails = mongoose.model('userDetails',user);
export default userDetails;