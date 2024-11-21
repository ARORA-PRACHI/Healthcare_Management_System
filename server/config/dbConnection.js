const mongoose=require("mongoose");

const connectDb=async()=>{
    try{
        // Use process.env.MONGO_URI to connect to the database
        const connect=await mongoose.connect(process.env.MONGO_STRING);
        console.log(
            "Database Connected: ",
            connect.connection.host,
            connect.connection.name
        );
    }catch(err){
        console.log(err);
        process.exit(1);    // Exit if connection fails

    }   
};

module.exports=connectDb;
