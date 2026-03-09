import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar";
import dashboardNavItems from "../constants/dashboardNavItems";

function Dashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [transactions, setTransactions] = useState([]);

    const loadTransactions = async () => {
        const res = await axios.get("http://localhost:5000/api/transactions", {
            headers: { Authorization: token }
        });

        setTransactions(res.data);
    };

    const deleteTransaction = async (id) => {
        await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
            headers: { Authorization: token }
        });

        loadTransactions();
    };

    useEffect(() => {
        loadTransactions();
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
                activeSection="/dashboard"
                onNavigate={handleNavigation}
                onLogout={handleLogout}
            />

            <div className="dashboard-main-content">
                <div className="dashboard-card">
                    <h2 className="dashboard-title">Dashboard</h2>
                    <h4 className="dashboard-subtitle">Recent Transactions</h4>

                    <div className="transactions-section">
                        {transactions.length === 0 ? (
                            <p className="empty-state">No transactions yet.</p>
                        ) : (
                            <ul className="transactions-list">
                                {transactions.map((transaction) => (
                                    <li key={transaction.id} className="transaction-item">
                                        <span className="transaction-text">{transaction.text}</span>
                                        <span className="transaction-category">{transaction.category}</span>
                                        <span className="transaction-amount">Rs.{transaction.amount}</span>
                                        <button
                                            className="transaction-delete-button"
                                            onClick={() => deleteTransaction(transaction.id)}
                                        >
                                            Delete
                                        </button>
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
