import axios from "axios";
import {useEffect,useState} from "react";
import "../styles/Dashboard.css";
import ExpenseChart from "../components/Chart";
import cashFlowLogo from "../assets/cashflow-logo.svg";

const navItems = [
{id:"add-transaction",label:"Add Transaction"},
{id:"recent-transactions",label:"Recent Transactions"},
{id:"summary",label:"Summary"},
{id:"monthly-reports",label:"Monthly Reports"}
];

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
    const [monthlyData,setMonthlyData] = useState([]);
    const [focusedField,setFocusedField] = useState("");
    const [activeSection,setActiveSection] = useState("add-transaction");

    const token =
    localStorage.getItem("token");

    useEffect(()=>{

    loadTransactions();

    },[]);


    useEffect(()=>{

    const handleScroll = ()=>{

    let currentSection = "add-transaction";

    navItems.forEach(item=>{

    const section = document.getElementById(item.id);

    if(section && window.scrollY + 140 >= section.offsetTop){
    currentSection = item.id;
    }

    });

    setActiveSection(currentSection);

    };

    handleScroll();
    window.addEventListener("scroll",handleScroll);

    return()=>window.removeEventListener("scroll",handleScroll);

    },[]);


    const deleteTransaction = async(id)=>{

    await axios.delete(
    "http://localhost:5000/api/transactions/"+id,
    {
    headers:{Authorization:token}
    }
    );

    loadTransactions();

    };


    useEffect(()=>{

    axios.get(
    "http://localhost:5000/api/transactions/monthly",
    {
    headers:{Authorization:token}
    }
    )
    .then(res=>{
    setMonthlyData(res.data);
    });

    },[]);


    const income =
    transactions
    .filter(t=>Number(t.amount)>0)
    .reduce((a,b)=>a+Number(b.amount),0);

    const expense =
    transactions
    .filter(t=>Number(t.amount)<0)
    .reduce((a,b)=>a+Number(b.amount),0);


    const handleSidebarNavigation = (sectionId)=>{

    const section = document.getElementById(sectionId);

    if(section){
    section.scrollIntoView({behavior:"smooth",block:"start"});
    setActiveSection(sectionId);
    }

    };


    return(

    <div className="dashboard-container">

    <aside className="dashboard-sidebar">
    <div className="sidebar-brand">
    <img src={cashFlowLogo} alt="CashFlow logo" className="sidebar-logo-image" />
    <div className="sidebar-brand-text">
    <h4 className="sidebar-brand-title">CashFlow</h4>
    <p className="sidebar-brand-subtitle">Finance Tracker</p>
    </div>
    </div>
    <nav className="nav flex-column nav-pills gap-2 sidebar-nav" aria-label="Dashboard sections">
    {navItems.map(item=>(
    <button
    key={item.id}
    type="button"
    className={`nav-link text-start sidebar-nav-link ${activeSection===item.id?"active":""}`}
    onClick={()=>handleSidebarNavigation(item.id)}
    >
    {item.label}
    </button>
    ))}
    </nav>
    </aside>

    <div className="dashboard-main-content">
    <div className="dashboard-card">

    <h1 className="logo">CashFlow</h1>

    <h2 className="dashboard-title">Dashboard</h2>

    <h4 id="add-transaction" className="dashboard-subtitle">Add Transaction</h4>

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

    </div><br/>

    <div id="recent-transactions" className="transactions-section">
    <h4 className="dashboard-subtitle">Recent Transactions</h4>

    {transactions.length===0 ? (
    <p className="empty-state">No transactions yet.</p>
    ) : (
    <ul className="transactions-list">
    {transactions.map((transaction)=>(
    <li key={transaction.id} className="transaction-item">
    <span className="transaction-text">{transaction.text}</span>
    <span className="transaction-category">{transaction.category}</span>
    <span className="transaction-amount">Rs.{transaction.amount}</span>
    <button
    className="transaction-delete-button"
    onClick={()=>deleteTransaction(transaction.id)}
    >
    Delete
    </button>
    </li>
    ))}
    </ul>
    )}

    </div><br/>

    <div id="summary" className="summary-section">
    <h4 className="dashboard-subtitle">Summary</h4>
    <p>Income: Rs.{income}</p>
    <p>Expense: Rs.{expense}</p>
    <p>Balance: Rs.{income+expense}</p>
    <br/><br/>

    <ExpenseChart transactions={transactions} /> 
    </div><br/>

    <h4 id="monthly-reports" className="dashboard-subtitle">Monthly Reports</h4>

    <div className="monthly-reports-section">
    {monthlyData.length===0 ? (
    <p className="empty-state">No monthly report data yet.</p>
    ) : (
    <ul className="monthly-reports-list">
    {monthlyData.map((m,index)=>(
    <li key={`${m.month}-${index}`} className="monthly-report-item">
    <span className="monthly-report-month">Month {m.month}</span>
    <span className="monthly-report-total">Rs.{m.total}</span>
    </li>
    ))}
    </ul>
    )}
    </div>

    </div>

    </div>

    </div>

    );

}

export default Dashboard;
