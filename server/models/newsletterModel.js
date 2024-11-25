const mongoose = require("mongoose");
const newsletterSchema = mongoose.Schema({
    title:{
        type : String , 
        require : [ true , "please add the title"],
    },
    author:{
        type : String , 
        require : [ true , "please add the author"],
    },
    date:{
        type : String , 
        require : [ true , "please add the date"],
    },
    imageurl:{
        type : String , 
        require : [ true , "please add imageUrl"],
    },
    description:{
        type : String , 
        require : [ true , "please add the description"],
    }
},
{
    timestamps : true ,
});
const newsletter=mongoose.model("Newsletter",newsletterSchema);
module.exports=newsletter;