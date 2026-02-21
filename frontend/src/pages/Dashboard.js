import axios from "axios";
import {useEffect,useState} from "react";

function Dashboard(){

const [transactions,setTransactions]
= useState([]);

const token =
localStorage.getItem("token");

useEffect(()=>{

axios.get(
"http://localhost:5000/api/transactions",
{
headers:{Authorization:token}
}
)
.then(res=>{
setTransactions(res.data);
});

},[]);

return(

<div>

<h2>Dashboard</h2>

{transactions.map(t=>(

<div key={t.id}>
{t.text} - Rs.{t.amount}
</div>

))}

</div>

);

}

export default Dashboard;
