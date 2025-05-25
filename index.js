const path = require("path");
const express = require("express");
const userRoute = require("./routes/user");
const mongoose=require("mongoose");
const cookiePaser=require('cookie-parser');
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blogroute=require("./routes/Blog")

const blog=require("./models/blog");

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
app.use(cookiePaser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.use("/user", userRoute);
app.use("/blog", Blogroute);

// Home route
app.get("/", async(req, res) => {

    const allBlogs=await blog.find({});
    res.render("home",
        {
            user:req.user,
            blogs:allBlogs,
        }
    ); // Assumes a 'home.ejs' exists in the /views directory
});



// Error handler (optional)


// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
