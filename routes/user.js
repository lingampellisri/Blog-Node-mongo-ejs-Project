const { Router } = require("express");
const User = require("../models/user");

const router = Router();

// Render Signin Page
router.post("/signin", async (req, res) => {
    // return res.render("signin");
    
    const {email,password}=req.body;

    try
    {
            const token=await User.matchPasswordAndGenerateToken(email,password);
    //  if(!user)
        // return res.status(401).send("User not Found");
    console.log("User token");
    console.log("User :"+token);
     // return res.render("signin");
     return res.cookie("token",token).redirect("/");
    }
    catch(error)
    {
        return res.render("signin",{
            error:"Incorrect Email Or password",
        });
    }

   
});

// Render Signup Page
router.get("/signup", (req, res) => {

  return res.render("signup");
});

router.get("/signin", (req, res) => {

  return res.render("signin");
});

router.get("/logout",(req,res)=>
{
    res.clearCookie("token").redirect("/");
})

// Handle Signup Form Submission
router.post("/signup", async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        if (!fullname || !email || !password) {
            return res.status(400).send("All fields are required.");
        }

        // TODO: Add password hashing here using bcrypt for security

        const user = await User.create({
            fullname,
            email,
            password
        });

        console.log("User created:", user);

        return res.redirect("/");
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
