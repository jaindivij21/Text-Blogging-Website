// Main app.js (index file)

// requirements
const express = require("express"); // express modules
const https = require("https") // API get requests
const ejs = require("ejs"); // get ejs
const _ = require("lodash"); // get loadash (lib that adds extra functionality to javascript)

// module export requirements 

// Main App Init Const
const app = express();

app.set("view engine", "ejs") // init ejs templating
app.use(express.static("public")); // serve the static files
app.use(express.urlencoded({
    extended: true
})); // init body parser

// MAIN

// API Keys
const API_KEY = "##";

// global variables (if any)
const posts = []
const homeContent = "Hey, I am Divij and this is my Diary. I write stuff here. Everything from my thoughts to my experiences. Kinda like a log book. These blogs represent me and my life, and how it has panned out so far. I hope you enjoy reading it.";
const aboutContent = "Hi, My name's Divij!";
const contactContent = "Contact me @jaindivij_ on Twitter!";

// PAGES

// index page (home page)
app.get("/", (req, res) => {
    res.render("home", {
        blogPosts: posts,
        body: homeContent,
        apiKey: API_KEY
    });
});

// compose new blog page
app.get("/compose", (req, res) => {
    res.render("compose", {
        apiKey: API_KEY
    });
});
app.post("/compose", (req, res) => {
    // make a newBlog submitted by the user into an object
    const newBlog = {
        title: req.body.postTitle,
        body: req.body.postContent
    };
    posts.push(newBlog); // posts array contains all the blog post objects

    // redirect to the home page
    res.redirect("/");
});

// posts page
app.get("/post/:postTitle", (req, res) => {
    const requestedTitle = _.lowerCase(req.params.postTitle);
    posts.forEach(post => {
        const storedTitle = _.lowerCase(post.title);
        if (storedTitle === requestedTitle) {
            res.render("post", {
                apiKey: API_KEY,
                body: post.body,
                title: post.title
            })
        }
    });
});

// about page 
app.get("/about", (req, res) => {
    res.render("about", {
        apiKey: API_KEY,
        body: aboutContent
    });
});

// contact page
app.get("/contact", (req, res) => {
    res.render("contact", {
        apiKey: API_KEY,
        body: contactContent
    });
});

// LISTEN PORT
app.listen(process.env.PORT || 3000, () => {
    console.log("The server has started!");
});