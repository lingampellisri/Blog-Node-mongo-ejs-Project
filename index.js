const path = require("path");
const express = require("express");
const userRoute = require("./routes/user");
const mongoose=require("mongoose");

const app = express();
const PORT = 5000;

mongoose.connect("mongodb://127.0.0.1:27017/blogify")
.then(()=>
{
    console.log("MOngoDB connected");
})
.catch((err)=>
{
    console.log("Error while Connecting MongoDB");
})

// Set view engine to EJS and define the views directory
app.set("view engine", "ejs");
app.set("views", "./views");

// Middleware to parse URL-encoded data (optional based on your use case)
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoute);
// Home route
app.get("/", (req, res) => {
    res.render("home"); // Assumes a 'home.ejs' exists in the /views directory
});



// Error handler (optional)


// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
