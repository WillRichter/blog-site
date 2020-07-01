// Set up required packages
const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

app = express();

// Set up ejs, bodyParser, and static folder
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));



// Set up mongoDB, Mongoose and Schema for blog posts
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const postSchema = new mongoose.Schema({
    title: {
        type: String
    },
    content: {
        type: String
    }
});

const Post = mongoose.model("Post", postSchema);


// App route to index page and displays all posts from database
app.get("/", (req,res) => {
    Post.find({}, (err,posts) => {
        res.render("index", {posts:posts});
    });
});


// App route to about page
app.get("/about", (req,res) => {
    res.render("about");
});


// App routes to compose message
app.get("/compose", (req,res) => {
    res.render("compose");
});

app.post("/compose", (req, res) => {

    // gGet title and content from form body
    const title = req.body.title;
    const content = req.body.content;

    // Enter details into a new post model
    const post = new Post({
        title: title,
        content: content
    });

    // Save post model into database & console log errors
    post.save(err => {
        if(err){
            console.log(err);
        } else {
            res.redirect("/"); 
        }
    });
});


// App route to go to page for an individual blog post
app.get("/blog/:id", (req,res) => {

    // Get post id from the url parameter
    const requestedId = req.params.id;

    // Query database using Id to find the blog post and then display info in blog template
    Post.findOne({ _id: requestedId }, (err, foundPost) => {
        if(!err){
            res.render("blog", { post:foundPost });
        } else {
            console.log(err);
        }
    });
});

// App route to delete a post
app.post("/delete", (req,res) => {

    // Get post id from the blog post delete button
    const requestedId = req.body.postId;

    // Query database using Id to find the blog post and then remove info from database, log errors if any
    Post.findByIdAndRemove(requestedId, (err) => {
        if(!err){
            res.redirect("/");
        } else {
            console.log(err);
        }
    })
});



// Sets up server on Heroku port or port 3000

let port = process.env.PORT;
if(port == null || port ==""){
    port = 3000;
}

app.listen(port, () =>{
    console.log("Server has started successfully.");
});