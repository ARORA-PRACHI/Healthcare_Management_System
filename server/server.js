const fs = require('fs');
const express = require("express");
const cors = require("cors");
const path = require('path');
const dotenv = require("dotenv").config();
const hbs = require('hbs');
const multer = require('multer');
const errorHandler = require("./middlewares/errorHandler..js");
const connectDb = require("./config/dbConnection.js");
// Global variable to store uploaded image URLs
let imageUrls = [];

// Import the routers
const userRouter = require("./routers/userRouter");
const doctorRouter = require("./routers/doctorRouter");

connectDb();

const app = express();
const port = process.env.PORT || 3000;

// Ensure the 'uploads' folder exists
const uploadsFolder = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsFolder)) {
    fs.mkdirSync(uploadsFolder);
    console.log("'uploads' folder created.");
}

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsFolder); // Make sure 'uploads' folder exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

// Initialize Multer with storage configuration
const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(cors());
app.use(errorHandler);

// HBS setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Serve static files
app.use('/uploads', express.static(uploadsFolder));

// Route for single file upload
app.post("/profile", upload.single("avatar"), function (req, res, next) {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    console.log(req.body);
    console.log(req.file);

    const fileName = req.file.filename;
    const imageUrl = `/uploads/${fileName}`;
    imageUrls.push(imageUrl);
    return res.render("allimages", {
        imageUrls: imageUrls
    });
});

app.get("/allimages", (req, res) => {
    res.render("allimages", { imageUrls: imageUrls });
});
// GET route for rendering the upload form
app.get('/profile', (req, res) => {
    res.render('home', {
        title: "Upload Avatar",
        message: "Upload your avatar below",
        user: { name: "John Doe", age: 30 }, // Example user data
        imageUrls: imageUrls // Pass the uploaded image URLs to render them
    });
});

// Route for multiple file upload
app.post('/photos/upload', upload.array('photos', 12), (req, res, next) => {
    if (req.files && req.files.length > 0) {
        console.log(req.files); // Log the uploaded files array
        // Loop through the uploaded files and create URLs
        const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
        // Pass the image URLs to the Handlebars view
        return res.render("allimages", {
            imageUrls: imageUrls
        });
    }
    res.status(400).json({ message: "File upload failed" });
});

app.get('/home', (req, res) => {
    res.render('home', {
        username: "SM",
        posts: "Chairman"
    });
});

app.get('/allusers', (req, res) => {
    res.render('allusers', {
        data: [
            { name: "SM", age: 21 },
            { name: "PA", age: 21 },
            { name: "BM", age: 0.3 },
            { name: "EA", age: 0.01 }
        ]
    });
});

app.get('/', (req, res) => {
    res.send("Working");
});

// Routes for users
app.use('/api/users', userRouter);

// Routes for doctors
app.use('/api/doctors', doctorRouter);

app.use("/api/newsletter", require("./routers/newsletterRouter.js"));
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
