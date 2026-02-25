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
router.post("/", auth, (req,res)=>{

const {text,amount,category} = req.body;

db.query(
"INSERT INTO transactions (user_id,text,amount,category) VALUES (?,?,?,?)",
[req.user.id,text,amount,category],
(err,result)=>{
res.json({message:"Added"});
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

//Monthly Reports Feature
router.get("/monthly", auth,(req,res)=>{

db.query(

`SELECT 
MONTH(date) as month,
SUM(amount) as total
FROM transactions
WHERE user_id=?
GROUP BY MONTH(date)`,

[req.user.id],

(err,result)=>{
res.json(result);
});

});

module.exports = router;
