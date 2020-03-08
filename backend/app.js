const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// j0MY3knqrtSAnVJw
const postRoutes = require('./routes/posts');
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
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postRoutes);
module.exports = app;
