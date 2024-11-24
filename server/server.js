const express = require("express");
const cors = require("cors");
const path = require('path');
const dotenv = require("dotenv").config();
const hbs = require('hbs');

const errorHandler = require("./middlewares/errorHandler..js");
const connectDb = require("./config/dbConnection.js");


// Import the routers
const userRouter = require("./routers/userRouter");
const doctorRouter = require("./routers/doctorRouter");

connectDb();
const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());
app.use(errorHandler);
//hbs
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.get('/home',(req,res)=>{
    res.render('home',{
        username: "SM",
        posts: "Chairman"
    })
})
app.get('/allusers',(req,res)=>{
    res.render('allusers',{
        data:[{name:"SM", age:21},
            {name:"PA", age:21},
            {name:"BM", age:0.3},
            {name:"EA",age:0.01}
        ]
    })
})
app.get('/', (req, res) => {
    res.send("Working");
});



// Routes for users
app.use('/api/users', userRouter);

// Routes for doctors
app.use('/api/doctors', doctorRouter);  // Make sure doctorRouter is correctly mapped

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
