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
    const [monthlyData, setMonthlyData] = useState([]);
    const [isLoadingMonthlyData, setIsLoadingMonthlyData] = useState(true);

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
        const loadMonthlySummary = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/transactions/monthly", {
                    headers: { Authorization: token }
                });

                setMonthlyData(res.data);
            } catch (error) {
                setMonthlyData([]);
            } finally {
                setIsLoadingMonthlyData(false);
            }
        };

        loadMonthlySummary();
    }, [token]);

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
                    backgroundColor: "rgba(102, 126, 234, 0.8)",
                    borderColor: "rgba(118, 75, 162, 1)",
                    borderWidth: 1,
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
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `Rs. ${value}`
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

            <div className="dashboard-main-content">
                <div className="dashboard-card">
                    <h2 className="dashboard-title">Dashboard</h2>
                    <h4 className="dashboard-subtitle">Welcome to CashFlow!</h4><br /> 

                    <div className="recent-monthly-summary-section">
                        <div className="recent-monthly-summary-header">
                            <h5 className="recent-monthly-summary-title">Recent Monthly Summary</h5>
                            <button
                                type="button"
                                className="recent-monthly-summary-view-all"
                                onClick={() => handleNavigation("/dashboard/monthly-reports")}
                            >
                                View Full Report
                            </button>
                        </div>

                        {isLoadingMonthlyData ? (
                            <p className="empty-state">Loading monthly summary...</p>
                        ) : recentMonthlySummary.length === 0 ? (
                            <p className="empty-state">No monthly summary available yet.</p>
                        ) : (
                            <>
                                <ul className="monthly-reports-list">
                                    {recentMonthlySummary.map((summary, index) => (
                                        <li key={`${summary.month}-${index}`} className="monthly-report-item">
                                            <span className="monthly-report-month">{getMonthName(summary.month)}</span>
                                            <span className="monthly-report-total">Rs.{summary.total}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="monthly-summary-chart-wrapper">
                                    <Bar data={recentMonthlySummaryBarData} options={recentMonthlySummaryBarOptions} />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
