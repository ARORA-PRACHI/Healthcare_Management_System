const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv").config();

//imports
const connectDb=require("./config/dbConnection.js");

connectDb();
const app=express();
const port=process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("Working");
});


//routes
app.use('/api/users',require('./routers/userRouter.js'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});