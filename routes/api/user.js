const express = require("express");
const router = express.Router();

//User model
const Item = require("../../models/user");

//@route post api/users
//@desc Register new user
//@access Public
router.post("/",(req, res) => {
   res.send("register");
});


module.exports= router;