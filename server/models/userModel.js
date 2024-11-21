const mongoose=require("mongoose");

const userSchema=mongoose.Schema(
    {
        name:{
            type:String,
            require:[true,"Please add your name"],
        },
        email:{
            type:String,
            require:[true,"Please add your email"],
        },
        phoneNumber:{
            type:String,
            require:[true,"Please add your phone number"],
        },
        password:{
            type:String,
            require:[true,"Please add your password"],
        },
    },
    {
        timestamps:true          // to automatically add and manage createdAt and updatedAt
    }
)
const User=mongoose.model("User",userSchema);
module.exports=User;