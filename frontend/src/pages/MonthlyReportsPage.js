import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar";
import dashboardNavItems from "../constants/dashboardNavItems";

function MonthlyReportsPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/transactions/monthly", {
        headers: { Authorization: token }
      })
      .then((res) => {
        setMonthlyData(res.data);
      });
  }, []);

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
        activeSection="/dashboard/monthly-reports"
        onNavigate={handleNavigation}
        onLogout={handleLogout}
      />

      <div className="dashboard-main-content">
        <div className="dashboard-card">
          <h2 className="dashboard-title">Monthly Reports</h2>

          <div className="monthly-reports-section">
            {monthlyData.length === 0 ? (
              <p className="empty-state">No monthly report data yet.</p>
            ) : (
              <ul className="monthly-reports-list">
                {monthlyData.map((m, index) => (
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

export default MonthlyReportsPage;
