const express = require("express");
const { connectDB } = require("./Database/db.js"); // Import connectDB function from peopleService.js
const routes = require("./routes/building.routes.js");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// Route
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// Start server and connect to DB
app.listen(3000, () => {
    console.log("Server is running on port 3000");

    // Call the connectDB function to connect to MongoDB
    connectDB();
});

app.use('/building', routes)