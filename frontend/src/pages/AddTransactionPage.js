import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar";
import dashboardNavItems from "../constants/dashboardNavItems";

function AddTransactionPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [focusedField, setFocusedField] = useState("");

  const addTransaction = async () => {
    if (!text.trim() || !amount) {
      return;
    }

    await axios.post(
      "http://localhost:5000/api/transactions",
      { text, amount, category },
      {
        headers: { Authorization: token }
      }
    );

    setText("");
    setAmount("");
    setCategory("Food");
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
        activeSection="/dashboard/add-transaction"
        onNavigate={handleNavigation}
        onLogout={handleLogout}
      />

      <div className="dashboard-main-content">
        <div className="dashboard-card">
          <h2 className="dashboard-title">Add Transaction</h2>

          <div className="dashboard-form">
            <input
              className={`dashboard-input ${focusedField === "text" ? "focused" : ""}`}
              placeholder="Description"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setFocusedField("text")}
              onBlur={() => setFocusedField("")}
            />

            <input
              className={`dashboard-input ${focusedField === "amount" ? "focused" : ""}`}
              placeholder="Amount (Rs.)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onFocus={() => setFocusedField("amount")}
              onBlur={() => setFocusedField("")}
            />

            <select
              className={`dashboard-select ${focusedField === "category" ? "focused" : ""}`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              onFocus={() => setFocusedField("category")}
              onBlur={() => setFocusedField("")}
            >
              <option>Food</option>
              <option>Transport</option>
              <option>Salary</option>
              <option>Shopping</option>
              <option>Bills</option>
            </select>

            <button className="dashboard-button" onClick={addTransaction}>
              Add Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTransactionPage;
