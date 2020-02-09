const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// j0MY3knqrtSAnVJw
const Post = require('./models/post');
const app = express();
mongoose.connect('mongodb+srv://rino:j0MY3knqrtSAnVJw@cluster0-sozf9.mongodb.net/node-angular?retryWrites=true&w=majority')
.then(() => {
  console.log('connected!')
})
.catch(() => {
  console.log('db not connected!')
});

app.use(bodyParser.json()); // i bon parse cdo data qe vjen , returns valid express midleware for parsin json data
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
    const post = new Post({
      title: req.body.title,
      content: req.body.content
    });
    post.save().then(createdPost => { // e marrim id ne addpost service
        res.status(201).json({
        message: 'The post is created successfully!',
        postId: createdPost._id
      });
    });
});

app.get("/api/posts", (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
    message: "Posts fetched succesfully!",
    posts: documents
    });
  })
});

app.delete("/api/posts/:id", (req, res, next) => {
    Post.deleteOne({ _id: req.params.id}).then(result => {
      console.log(result); // params gives access to all encoded parametres in url
      res.status(200).json({ message: 'Post deleted successfully!'});
    });
});

module.exports = app;
