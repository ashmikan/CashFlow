import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar";
import dashboardNavItems from "../constants/dashboardNavItems";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function MonthlyReportsPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [monthlyData, setMonthlyData] = useState([]);

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

    if (monthNumber >= 0 && monthNumber <= 11) {
      return monthNames[monthNumber];
    }

    return `Month ${monthValue}`;
  };

  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const formatSignedAmount = (value) => {
    const amount = Number(value);

    if (Number.isNaN(amount)) {
      return "0.00";
    }

    const sign = amount > 0 ? "+" : amount < 0 ? "-" : "";
    return `${sign}${Math.abs(amount).toFixed(2)}`;
  };

  const formatSignedPercent = (value) => {
    const num = Number(value);

    if (Number.isNaN(num)) {
      return "0.00%";
    }

    const sign = num > 0 ? "+" : num < 0 ? "-" : "";
    return `${sign}${Math.abs(num).toFixed(2)}%`;
  };

  const getPercentageColor = (percentage) => {
    const num = Number(percentage);
    if (num > 0) return "red"; // Increase in spending is bad
    if (num < 0) return "green"; // Decrease in spending is good
    return "gray";
  };

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

  const chartTotals = monthlyData.map((m) => Number(m.total));
  const chartMin = chartTotals.length ? Math.min(...chartTotals) : 0;
  const chartMax = chartTotals.length ? Math.max(...chartTotals) : 0;

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

          {monthlyData.length === 0 ? (
            <p className="empty-state">No monthly report data yet.</p>
          ) : (
            <>
              {/* Chart Section */}
              <div className="monthly-chart-section">
                <h3>Spending Trend</h3>
                <div style={{ width: "100%", height: "300px", position: "relative" }}>
                  <Line
                    data={{
                      labels: monthlyData.map((m) => getMonthName(m.month)),
                      datasets: [
                        {
                          label: "Monthly Summary (Rs.)",
                          data: chartTotals,
                          borderColor: "rgb(75, 192, 192)",
                          backgroundColor: "rgba(75, 192, 192, 0.1)",
                          tension: 0.4,
                          fill: true,
                          pointRadius: 6,
                          pointHoverRadius: 8,
                          pointBackgroundColor: chartTotals.map((total) =>
                            total >= 0 ? "#2f855a" : "#e53e3e"
                          )
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        title: {
                          display: true,
                          text: "Monthly Spending Trend"
                        },
                        legend: {
                          display: true,
                          position: "top"
                        },
                        tooltip: {
                          callbacks: {
                            label: (context) =>
                              `Monthly Summary: Rs.${formatSignedAmount(context.parsed.y)}`
                          }
                        }
                      },
                      scales: {
                        y: {
                          beginAtZero: chartMin >= 0,
                          suggestedMin: chartMin < 0 ? chartMin * 1.1 : 0,
                          suggestedMax: chartMax > 0 ? chartMax * 1.1 : 0,
                          title: {
                            display: true,
                            text: "Monthly Summary (Rs.)"
                          },
                          ticks: {
                            callback: (value) => `Rs.${formatSignedAmount(value)}`
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Detailed Table Section */}
              <div className="monthly-reports-section">
                <h3>Month-to-Month Comparison</h3>
                <table className="monthly-reports-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Total Spending (Rs.)</th>
                      <th>Change from Previous</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((m, index) => {
                      const percentageChange =
                        index === 0
                          ? "—"
                          : calculatePercentageChange(
                              Number(m.total),
                              Number(monthlyData[index - 1].total)
                            );

                      return (
                        <tr key={`${m.month}-${index}`} className="monthly-report-row">
                          <td className="monthly-report-month">
                            {getMonthName(m.month)}
                          </td>
                          <td className="monthly-report-total">
                            Rs.{formatSignedAmount(m.total)}
                          </td>
                          <td
                            className="monthly-report-change"
                            style={{
                              color:
                                percentageChange === "—"
                                  ? "gray"
                                  : getPercentageColor(percentageChange)
                            }}
                          >
                            {percentageChange === "—"
                              ? "—"
                              : formatSignedPercent(percentageChange)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MonthlyReportsPage;
