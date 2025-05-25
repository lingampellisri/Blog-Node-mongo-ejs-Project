const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Blog=require("../models/blog");
const { blob } = require("stream/consumers");

const router = Router();

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userFolder = path.resolve(`./public/uploads/${req.user._id}`);
    fs.mkdirSync(userFolder, { recursive: true }); // ensure folder exists
    cb(null, userFolder);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// GET: Form
router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user
  });
});

router.get("/:id",async (req,res)=>
{
    const blog=await Blog.findById(req.params.id);
    return res.render("blog",{
        user:req.user,
        blog,
    })

})

// POST: Upload form
router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    const { title, body } = req.body;

    const blog = await Blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImageURL: `/uploads/${req.user._id}/${req.file.filename}`, // <- Include user folder
    });

    console.log("Form data:", req.body);
    console.log("File uploaded:", req.file);

    res.redirect(`/blog/${blog._id}`);
  } catch (err) {
    console.error("Error uploading blog post:", err);
    res.status(500).send("Something went wrong while uploading.");
  }
});


module.exports = router;
