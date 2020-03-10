const express = require("express");
const Post = require('../models/post');
const router = express.Router();
const multer = require("multer");

// helper expres gives us
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const filestorage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("invalid mime type");
    if(isValid) {
      error = null
    }
    callback(error, "backend/images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split('').join('-'); // there is a original name property
    const ext = MIME_TYPE_MAP[file.mimetype]; // we get the extension which is 'image/smth' format
    callback(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post("", multer({storage: filestorage}).single("image"), (req, res, next) => {
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

// to get the current id from create-post if we reload in that page
router.get("/:id", (req, res, next) => {
Post.findById(req.params.id).then(post => {
  if(post) {
    res.status(200).json(post);
  } else {
    res.status(404).json({ message: "Post is not found!"});
    }
  })
});

router.put("/:id", (req, res, next) => {
const post = new Post({
  _id: req.body.id,
  title: req.body.title,
  content: req.body.content
});
Post.updateOne({ _id: req.params.id}, post).then(result => {
    res.status(200).json({ message: 'Updated successfully'});
  });
});

router.get("", (req, res, next) => {
Post.find().then(documents => {
  res.status(200).json({
  message: "Posts fetched succesfully!",
  posts: documents
    });
  })
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id}).then(result => {
    console.log(result); // params gives access to all encoded parametres in url
    res.status(200).json({ message: 'Post deleted successfully!'});
  });
});

module.exports = router;
