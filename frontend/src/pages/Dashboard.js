import axios from "axios";
import {useEffect,useState} from "react";
import "../styles/Dashboard.css";

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
const [focusedField,setFocusedField] = useState("");

const token =
localStorage.getItem("token");

useEffect(()=>{

loadTransactions();

},[]);

return(

<div className="dashboard-container">

<div className="dashboard-card">

<h1 className="logo">CashFlow</h1>

<h2 className="dashboard-title">Dashboard</h2>

<h4 className="dashboard-subtitle">Add Transaction</h4>

<div className="dashboard-form">

<input
className={`dashboard-input ${focusedField==="text"?"focused":""}`}
placeholder="Description"
value={text}
onChange={e=>setText(e.target.value)}
onFocus={()=>setFocusedField("text")}
onBlur={()=>setFocusedField("")}
/>

<input
className={`dashboard-input ${focusedField==="amount"?"focused":""}`}
placeholder="Amount (Rs.)"
type="number"
value={amount}
onChange={e=>setAmount(e.target.value)}
onFocus={()=>setFocusedField("amount")}
onBlur={()=>setFocusedField("")}
/>

<select
className={`dashboard-select ${focusedField==="category"?"focused":""}`}
value={category}
onChange={e=>setCategory(e.target.value)}
onFocus={()=>setFocusedField("category")}
onBlur={()=>setFocusedField("")}
>

<option>Food</option>
<option>Transport</option>
<option>Salary</option>
<option>Shopping</option>
<option>Bills</option>

</select>

<button
className="dashboard-button"
onClick={addTransaction}
>
Add Transaction
</button>

</div>

<div className="transactions-section">
<h4 className="transactions-title">Recent Transactions</h4>

{transactions.length===0 ? (
<p className="empty-state">No transactions yet.</p>
) : (
<ul className="transactions-list">
{transactions.map((transaction)=>(
<li key={transaction.id} className="transaction-item">
<span className="transaction-text">{transaction.text}</span>
<span className="transaction-category">{transaction.category}</span>
<span className="transaction-amount">₹{transaction.amount}</span>
</li>
))}
</ul>
)}

</div>

</div>

</div>

);

}

export default Dashboard;
