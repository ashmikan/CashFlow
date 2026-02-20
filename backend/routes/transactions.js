const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");


// Get transactions
router.get("/", auth,(req,res)=>{

db.query(
"SELECT * FROM transactions WHERE user_id=?",
[req.user.id],
(err,result)=>{

res.json(result);

});

});


// Add transaction
router.post("/", auth,(req,res)=>{

const {text,amount} = req.body;

db.query(
"INSERT INTO transactions (user_id,text,amount) VALUES (?,?,?)",
[req.user.id,text,amount],
(err,result)=>{

res.json({
message:"Transaction added"
});

});

});


// Delete transaction
router.delete("/:id",auth,(req,res)=>{

db.query(
"DELETE FROM transactions WHERE id=?",
[req.params.id],
(err,result)=>{

res.json({
message:"Deleted"
});

});

});

module.exports = router;
