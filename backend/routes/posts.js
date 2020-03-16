const express = require("express");
const Post = require('../models/post');
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

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
    const name = file.originalname.toLowerCase().split(" ").join('-'); // there is a original name property
    const ext = MIME_TYPE_MAP[file.mimetype]; // we get the extension which is 'image/smth' format
    callback(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post("", checkAuth, multer({storage: filestorage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename // store our images and accessible after our domain and name of file(multer does for us)
  });
  post.save().then(createdPost => { // e marrim id ne addpost service
      res.status(201).json({
      message: 'The post is created successfully!',
      // postId: createdPost._id
      post: {
        ...createdPost, // we send other properties of the new object and add the id as extra feature
        id: createdPost._id
      }
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

router.put("/:id", checkAuth, multer({storage: filestorage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
  const url = req.protocol + '://' + req.get("host");
  imagePath = url + "/images/" + req.file.filename
}
const post = new Post({
  _id: req.body.id,
  title: req.body.title,
  content: req.body.content,
  imagePath: imagePath
});
Post.updateOne({ _id: req.params.id}, post).then(result => {
    res.status(200).json({ message: 'Updated successfully'});
  });
});

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let fetchedPosts;
  const postQuery = Post.find();
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1))   // 10 * (3-1)
            .limit(pageSize); // takes amount of elements
  }
  postQuery      // we get all posts
  .then(documents => {
    fetchedPosts = documents;
    return Post.count();    // count them
    })
  .then(count => {                   // we got the count auto as result in then chain
    res.status(200).json({
      message: "Posts fetched succesfully!",
      posts: fetchedPosts,
      maxPosts: count
    });
  })
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id}).then(result => {
    console.log(result); // params gives access to all encoded parametres in url
    res.status(200).json({ message: 'Post deleted successfully!'});
  });
});

module.exports = router;
