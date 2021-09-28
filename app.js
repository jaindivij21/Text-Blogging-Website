//* Main app.js (index file)

// REQUIREMENTS
/* #region   */
const express = require("express"); // express modules
const https = require("https"); // API get requests
const ejs = require("ejs"); // get ejs
const mongoose = require("mongoose"); // require Database
const _ = require("lodash"); // get loadash (lib that adds extra functionality to javascript)
/* #endregion */
// module export requirements

// APP CONST
/* #region   */
const app = express();
app.use(express.static(__dirname + "/public")); // serves static files
app.set("view engine", "ejs"); // EJS Templating : Tells our app to use EJS as its view engine
app.use(express.urlencoded({ extended: true })); // body parser
/* #endregion */

//* MAIN

// SETUP DATABASE
/* #region */

const dbName = "blogDB";
// connect to the mongo service
mongoose.connect(`mongodb://localhost:27017/${dbName}`);

// construct schema
const blogSchema = {
    title: String,
    content: String,
};

// make a model from the schema
const Post = mongoose.model("Post", blogSchema);

/* #endregion */

// APIs and global variables
/* #region */
const API_KEY = "##"; // API Key for TinYMCE

const homeContent =
    "Hey, I am Divij and this is my Diary. I write stuff here. Everything from my thoughts to my experiences. Kinda like a log book. These blogs represent me and my life, and how it has panned out so far. I hope you enjoy reading it.";
const aboutContent = "Hi, My name's Divij!";
const contactContent = "Contact me @jaindivij_ on Twitter!";
/* #endregion */

// PAGES
/* #region */

// index page (home page) : get
app.get("/", (req, res) => {
    Post.find({}, (err, posts) => {
        if (err) console.log(err);
        else {
            res.render("home", {
                blogPosts: posts,
                body: homeContent,
                apiKey: API_KEY,
            });
        }
    });
});

// compose new blog page : get
app.get("/compose", (req, res) => {
    res.render("compose", {
        apiKey: API_KEY,
    });
});

// compose page : post
app.post("/compose", (req, res) => {
    // make a newBlog submitted by the user into an object
    title = req.body.postTitle;
    body = req.body.postContent;
    // create a new post document
    const post = new Post({
        title: title,
        content: body,
    });
    post.save((err) => {
        // save the post entered
        if (!err) {
            // redirect to the home page
            res.redirect("/");
        } else {
            console.log(err);
        }
    });
});

// individual posts page : get
app.get("/post/:postID", (req, res) => {
    const requestedID = req.params.postID;
    Post.findOne({ _id: requestedID }, (err, post) => {
        if (err) console.log(err);
        else {
            res.render("post", {
                apiKey: API_KEY,
                title: post.title,
                body: post.content,
            });
        }
    });
});

// about page : get
app.get("/about", (req, res) => {
    res.render("about", {
        apiKey: API_KEY,
        body: aboutContent,
    });
});

// contact page : get
app.get("/contact", (req, res) => {
    res.render("contact", {
        apiKey: API_KEY,
        body: contactContent,
    });
});
/* #endregion */

// LISTEN: BROWSER PORT
/* #region */
app.listen(process.env.PORT || 3000, () => {
    console.log("The server has started!");
});
/* #endregion */
