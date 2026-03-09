import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import ExpenseChart from "../components/Chart";
import Sidebar from "../components/Sidebar";
import dashboardNavItems from "../constants/dashboardNavItems";

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
        <div className="dashboard-card">
          <h2 className="dashboard-title">Summary</h2>

          <div className="summary-section">
            <p>Income: Rs.{income}</p>
            <p>Expense: Rs.{expense}</p>
            <p>Balance: Rs.{income + expense}</p>
          </div>

          <ExpenseChart transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

export default SummaryPage;
