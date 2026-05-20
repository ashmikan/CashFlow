import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    BarElement,
    Tooltip
} from "chart.js";
import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar";
import dashboardNavItems from "../constants/dashboardNavItems";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function Dashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [transactions, setTransactions] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const getMonthName = (monthValue) => {
        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];

        const monthNumber = Number(monthValue);

        if (Number.isNaN(monthNumber)) {
            return monthValue;
        }

        if (monthNumber >= 1 && monthNumber <= 12) {
            return monthNames[monthNumber - 1];
        }

        return `Month ${monthValue}`;
    };

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setIsLoading(true);
                const headers = { Authorization: token };
                const [transactionsRes, monthlyRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/transactions", { headers }),
                    axios.get("http://localhost:5000/api/transactions/monthly", { headers })
                ]);
                setTransactions(transactionsRes.data || []);
                setMonthlyData(monthlyRes.data || []);
            } catch (error) {
                console.error("Error loading dashboard data:", error);
                setTransactions([]);
                setMonthlyData([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (token) {
            loadDashboardData();
        } else {
            navigate("/login");
        }
    }, [token, navigate]);

    const income = useMemo(() => {
        return transactions
            .filter((t) => Number(t.amount) > 0)
            .reduce((sum, t) => sum + Number(t.amount), 0);
    }, [transactions]);

    const expense = useMemo(() => {
        return transactions
            .filter((t) => Number(t.amount) < 0)
            .reduce((sum, t) => sum + Number(t.amount), 0);
    }, [transactions]);

    const balance = useMemo(() => {
        return income + expense;
    }, [income, expense]);

    const recentTransactions = useMemo(() => {
        return [...transactions]
            .sort((a, b) => Number(b.id) - Number(a.id))
            .slice(0, 3);
    }, [transactions]);

    const recentMonthlySummary = useMemo(() => {
        return [...monthlyData]
            .sort((a, b) => Number(b.month) - Number(a.month))
            .slice(0, 3);
    }, [monthlyData]);

    const recentMonthlySummaryBarData = useMemo(() => {
        const chartSource = [...recentMonthlySummary].reverse();

        return {
            labels: chartSource.map((summary) => getMonthName(summary.month)),
            datasets: [
                {
                    label: "Amount (Rs.)",
                    data: chartSource.map((summary) => Number(summary.total) || 0),
                    backgroundColor: (context) => {
                        const value = context.raw;
                        return Number(value) >= 0 ? "rgba(34, 197, 94, 0.45)" : "rgba(239, 68, 68, 0.45)";
                    },
                    borderColor: (context) => {
                        const value = context.raw;
                        return Number(value) >= 0 ? "#22c55e" : "#ef4444";
                    },
                    borderWidth: 2,
                    borderRadius: 8,
                    maxBarThickness: 52
                }
            ]
        };
    }, [recentMonthlySummary]);

    const recentMonthlySummaryBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: "#1e293b",
                titleColor: "#f1f5f9",
                bodyColor: "#cbd5e1",
                borderColor: "rgba(255, 255, 255, 0.08)",
                borderWidth: 1,
                callbacks: {
                    label: (context) => {
                        const value = Number(context.raw) || 0;
                        return `Rs. ${value.toLocaleString("en-IN")}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: "#94a3b8",
                    font: {
                        family: "'Outfit', sans-serif",
                        size: 12
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: "rgba(255, 255, 255, 0.06)",
                    drawBorder: false
                },
                ticks: {
                    color: "#94a3b8",
                    font: {
                        family: "'Outfit', sans-serif",
                        size: 12
                    },
                    callback: (value) => `Rs. ${Number(value).toLocaleString("en-IN")}`
                }
            }
        }
    };

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

            <main className="dashboard-main-content">
                <header className="dashboard-header-panel">
                    <div className="welcome-text-group">
                        <h1 className="dashboard-main-title">Financial Dashboard</h1>
                        <p className="dashboard-subtitle-text">Welcome back! Here is your cash flow summary.</p>
                    </div>
                    <div className="header-date-badge">
                        <span className="calendar-icon">📅</span>
                        <span className="current-date">{new Date().toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}</span>
                    </div>
                </header>

                <div className="dashboard-bento-grid">
                    {/* KPI Balance Card */}
                    <div className="bento-card kpi-card balance-kpi">
                        <div className="kpi-header">
                            <span className="kpi-title">Net Balance</span>
                            <span className="kpi-icon balance-icon">💳</span>
                        </div>
                        <h2 className="kpi-value">Rs. {balance.toLocaleString("en-IN")}</h2>
                        <div className="kpi-footer">
                            <span className="kpi-trend positive">Total accumulated cash</span>
                        </div>
                    </div>

                    {/* KPI Income Card */}
                    <div className="bento-card kpi-card income-kpi">
                        <div className="kpi-header">
                            <span className="kpi-title">Total Income</span>
                            <span className="kpi-icon income-icon">📈</span>
                        </div>
                        <h2 className="kpi-value">Rs. {income.toLocaleString("en-IN")}</h2>
                        <div className="kpi-footer">
                            <span className="kpi-trend positive">↑ All earnings</span>
                        </div>
                    </div>

                    {/* KPI Expense Card */}
                    <div className="bento-card kpi-card expense-kpi">
                        <div className="kpi-header">
                            <span className="kpi-title">Total Expenses</span>
                            <span className="kpi-icon expense-icon">📉</span>
                        </div>
                        <h2 className="kpi-value">Rs. {Math.abs(expense).toLocaleString("en-IN")}</h2>
                        <div className="kpi-footer">
                            <span className="kpi-trend negative">↓ All spending</span>
                        </div>
                    </div>

                    {/* Monthly Summary Bento Box */}
                    <div className="bento-card monthly-summary-bento">
                        <div className="bento-card-header">
                            <h3 className="bento-card-title">Recent Monthly Summary</h3>
                            <button
                                type="button"
                                className="bento-action-button"
                                onClick={() => handleNavigation("/dashboard/monthly-reports")}
                            >
                                Full Report
                            </button>
                        </div>
                        {isLoading ? (
                            <div className="bento-loading">Loading summary...</div>
                        ) : recentMonthlySummary.length === 0 ? (
                            <div className="bento-empty">No summaries recorded.</div>
                        ) : (
                            <ul className="bento-monthly-list">
                                {recentMonthlySummary.map((summary, index) => {
                                    const isPositive = Number(summary.total) >= 0;
                                    return (
                                        <li key={`${summary.month}-${index}`} className="bento-monthly-item">
                                            <span className="bento-month-name">{getMonthName(summary.month)}</span>
                                            <span className={`bento-month-value ${isPositive ? "val-positive" : "val-negative"}`}>
                                                {isPositive ? "+" : ""}Rs. {Number(summary.total).toLocaleString("en-IN")}
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    {/* Recent Activity Bento Box */}
                    <div className="bento-card recent-activity-bento">
                        <div className="bento-card-header">
                            <h3 className="bento-card-title">Recent Activity</h3>
                            <button
                                type="button"
                                className="bento-action-button"
                                onClick={() => handleNavigation("/dashboard/recent-transactions")}
                            >
                                View All
                            </button>
                        </div>
                        {isLoading ? (
                            <div className="bento-loading">Loading transactions...</div>
                        ) : recentTransactions.length === 0 ? (
                            <div className="bento-empty">No transactions added yet.</div>
                        ) : (
                            <div className="bento-activity-list">
                                {recentTransactions.map((tx) => {
                                    const isExpense = Number(tx.amount) < 0;
                                    return (
                                        <div key={tx.id} className="bento-activity-item">
                                            <div className="activity-info">
                                                <span className="activity-category-badge">{tx.category}</span>
                                                <span className="activity-text">{tx.text}</span>
                                            </div>
                                            <span className={`activity-amount ${isExpense ? "val-negative" : "val-positive"}`}>
                                                {isExpense ? "-" : "+"}Rs. {Math.abs(Number(tx.amount)).toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Chart Bento Box */}
                    <div className="bento-card chart-bento">
                        <div className="bento-card-header">
                            <h3 className="bento-card-title">Cash Flow Analytics</h3>
                        </div>
                        <div className="bento-chart-container">
                            {isLoading ? (
                                <div className="bento-loading">Loading chart...</div>
                            ) : recentMonthlySummary.length === 0 ? (
                                <div className="bento-empty">No chart data available.</div>
                            ) : (
                                <Bar data={recentMonthlySummaryBarData} options={recentMonthlySummaryBarOptions} />
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
