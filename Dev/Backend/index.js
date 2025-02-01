const express = require("express");
const { connectDB } = require("./Database/db.js"); // Import connectDB function from peopleService.js
const routes = require("./routes/building.routes.js");
const cameraRoutes = require("./routes/camera.route.js");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors());

// Route
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use('/building', routes)
app.use('/camera', cameraRoutes)
// Start server and connect to DB
app.listen(3000, () => {
    console.log("Server is running on port 3000");

    // Call the connectDB function to connect to MongoDB
    connectDB();
});

