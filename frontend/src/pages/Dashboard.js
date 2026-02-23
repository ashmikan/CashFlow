import axios from "axios";
import {useEffect,useState} from "react";

function Dashboard(){

const loadTransactions = async()=>{

const res = await axios.get(
"http://localhost:5000/api/transactions",
{
headers:{Authorization:token}
}
);

setTransactions(res.data);

};

const addTransaction = async()=>{

await axios.post(
"http://localhost:5000/api/transactions",
{text,amount,category},
{
headers:{Authorization:token}
}
);

loadTransactions();

};    

const [transactions,setTransactions]
= useState([]);

const [text,setText] = useState("");
const [amount,setAmount] = useState("");
const [category,setCategory] = useState("");

const token =
localStorage.getItem("token");

useEffect(()=>{

loadTransactions();

},[]);

return(

<div>

<h2>Dashboard</h2>

<h4>Add Transaction</h4>

<input
placeholder="Description"
onChange={e=>setText(e.target.value)}
/>

<input
placeholder="Amount (Rs.)"
type="number"
onChange={e=>setAmount(e.target.value)}
/>

<select
onChange={e=>setCategory(e.target.value)}
>

<option>Food</option>
<option>Transport</option>
<option>Salary</option>
<option>Shopping</option>
<option>Bills</option>

</select>

</div>

);

}

export default Dashboard;
