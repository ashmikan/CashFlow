import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar";
import dashboardNavItems from "../constants/dashboardNavItems";

function Dashboard() {
    const navigate = useNavigate();

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
                activeSection="/dashboard"
                onNavigate={handleNavigation}
                onLogout={handleLogout}
            />

            <div className="dashboard-main-content">
                <div className="dashboard-card">
                    <h2 className="dashboard-title">Dashboard</h2>
                    <h4 className="dashboard-subtitle">Welcome to CashFlow!</h4>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
