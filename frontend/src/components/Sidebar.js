import cashFlowLogo from "../assets/cashflow-logo.svg";
import "../styles/Dashboard.css";

function Sidebar({items,activeSection,onNavigate,onLogout}){

return(

<aside className="dashboard-sidebar">
<div className="sidebar-brand">
<img src={cashFlowLogo} alt="CashFlow logo" className="sidebar-logo-image" />
<div className="sidebar-brand-text">
<h4 className="logo">CashFlow</h4>
<p className="sidebar-brand-subtitle">Finance Tracker</p>
</div>
</div>
<nav className="nav flex-column nav-pills gap-2 sidebar-nav" aria-label="Dashboard sections">
{items.map(item=>(
<button
key={item.id}
type="button"
className={`nav-link text-start sidebar-nav-link ${activeSection===item.id?"active":""}`}
onClick={()=>onNavigate(item.id)}
>
{item.label}
</button>
))}
</nav>

<button
type="button"
className="sidebar-logout-button"
onClick={onLogout}
>
Logout
</button>
</aside>

);

}

export default Sidebar;