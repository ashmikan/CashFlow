import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import addTransactionIllustration from "../assets/add-transaction-illustration.svg";
import Sidebar from "../components/Sidebar";
import dashboardNavItems from "../constants/dashboardNavItems";

function AddTransactionPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [focusedField, setFocusedField] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTransaction = async () => {
    if (!text.trim() || !amount) {
      return;
    }

    try {
      setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isFormReady = text.trim() && amount;

  const categoryHighlights = {
    Food: "Essentials, dining, or grocery spends.",
    Transport: "Daily travel, fuel, or ride-share costs.",
    Salary: "Income entries and recurring pay credits.",
    Shopping: "Lifestyle purchases and one-off treats.",
    Bills: "Utilities, subscriptions, and household payments."
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
        <div className="dashboard-card add-transaction-card">
          <div className="add-transaction-layout">
            <section className="add-transaction-hero">
              <span className="add-transaction-badge">Quick Entry</span>
              <h2 className="dashboard-title add-transaction-title">Add Transaction</h2>


              <div className="add-transaction-preview-card">
                <div>
                  <p className="add-transaction-preview-label">Current selection</p>
                  <h3 className="add-transaction-preview-category">{category}</h3>
                </div>
                <p className="add-transaction-preview-text">{categoryHighlights[category]}</p>
                <div className="add-transaction-preview-metrics">
                  <div className="add-transaction-preview-metric">
                    <span className="add-transaction-preview-caption">Description</span>
                    <strong>{text.trim() || "Waiting for details"}</strong>
                  </div>
                  <div className="add-transaction-preview-metric">
                    <span className="add-transaction-preview-caption">Amount</span>
                    <strong>{amount ? `Rs. ${Number(amount).toLocaleString()}` : "Rs. 0"}</strong>
                  </div>
                </div>
              </div>

              <img
                src={addTransactionIllustration}
                alt="Financial dashboard illustration"
                className="add-transaction-illustration"
              />
            </section>

            <section className="add-transaction-form-panel">
              <div className="add-transaction-form-header">
                <h3 className="add-transaction-form-title">Transaction details</h3>
                <p className="add-transaction-form-note">
                  {isFormReady ? "Everything looks ready to save." : "Fill in each field to enable a smooth save."}
                </p>
              </div>

              <div className="dashboard-form add-transaction-form">
                <label className={`add-transaction-field ${focusedField === "text" ? "is-focused" : ""}`}>
                  <span className="add-transaction-label">Description</span>
                  <input
                    className={`dashboard-input ${focusedField === "text" ? "focused" : ""}`}
                    placeholder="Lunch with team, salary credit, electricity bill..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onFocus={() => setFocusedField("text")}
                    onBlur={() => setFocusedField("")}
                  />
                </label>

                <label className={`add-transaction-field ${focusedField === "amount" ? "is-focused" : ""}`}>
                  <span className="add-transaction-label">Amount</span>
                  <input
                    className={`dashboard-input ${focusedField === "amount" ? "focused" : ""}`}
                    placeholder="Amount (Rs.)"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    onFocus={() => setFocusedField("amount")}
                    onBlur={() => setFocusedField("")}
                  />
                </label>

                <label className={`add-transaction-field add-transaction-field-full ${focusedField === "category" ? "is-focused" : ""}`}>
                  <span className="add-transaction-label">Category</span>
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
                </label>

                <button
                  className={`dashboard-button add-transaction-submit ${isFormReady ? "is-ready" : ""}`}
                  onClick={addTransaction}
                  disabled={!isFormReady || isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Add Transaction"}
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTransactionPage;
