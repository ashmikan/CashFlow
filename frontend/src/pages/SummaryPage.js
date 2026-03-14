import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import ExpenseChart from "../components/Chart";
import Sidebar from "../components/Sidebar";
import dashboardNavItems from "../constants/dashboardNavItems";
import summaryIllustration from "../assets/summary-insights-illustration.svg";

function SummaryPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [transactions, setTransactions] = useState([]);

  const loadTransactions = async () => {
    const res = await axios.get("http://localhost:5000/api/transactions", {
      headers: { Authorization: token }
    });

    setTransactions(res.data);
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const income = transactions
    .filter((t) => Number(t.amount) > 0)
    .reduce((a, b) => a + Number(b.amount), 0);

  const expense = transactions
    .filter((t) => Number(t.amount) < 0)
    .reduce((a, b) => a + Number(b.amount), 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        items={dashboardNavItems}
        activeSection="/dashboard/summary"
        onNavigate={handleNavigation}
        onLogout={handleLogout}
      />

      <div className="dashboard-main-content">
        <div className="dashboard-card summary-page-card">
          <h2 className="dashboard-title">Summary</h2> <br/>
          <p className="summary-page-subtitle">
            Track your cash flow in real time and quickly spot spending trends.
          </p>

          <div className="summary-page-hero" role="presentation">
            <img
              src={summaryIllustration}
              alt="Illustration of financial insights and analytics"
              className="summary-page-hero-image"
            />
          </div> <br/>

          <div className="summary-section">
            <article className="summary-stat-card summary-stat-income">
              <span className="summary-stat-label">Income</span>
              <p className="summary-stat-value">Rs.{income}</p>
            </article>
            <article className="summary-stat-card summary-stat-expense">
              <span className="summary-stat-label">Expense</span>
              <p className="summary-stat-value">Rs.{expense}</p>
            </article>
            <article className="summary-stat-card summary-stat-balance">
              <span className="summary-stat-label">Balance</span>
              <p className="summary-stat-value">Rs.{income + expense}</p>
            </article>
          </div> 

          <ExpenseChart transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

export default SummaryPage;
