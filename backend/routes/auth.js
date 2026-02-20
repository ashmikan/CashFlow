const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Register
router.post("/register", async (req,res)=>{

const {name,email,password} = req.body;

const hashed =
await bcrypt.hash(password,10);

db.query(
"INSERT INTO users (name,email,password) VALUES (?,?,?)",
[name,email,hashed],
(err,result)=>{

if(err)
return res.status(400).json(err);

res.json({
message:"User registered"
});

});

});


// Login
router.post("/login",(req,res)=>{

const {email,password} = req.body;

db.query(
"SELECT * FROM users WHERE email=?",
[email],
async(err,result)=>{

if(result.length==0)
return res.status(400)
.json({message:"User not found"});

const user = result[0];

const valid =
await bcrypt.compare(
password,
user.password
);

if(!valid)
return res.status(400)
.json({message:"Wrong password"});

const token =
jwt.sign(
{id:user.id},
process.env.JWT_SECRET
);

res.json({token});

});

});

module.exports = router;
