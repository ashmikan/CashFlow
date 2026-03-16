import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar";
import dashboardNavItems from "../constants/dashboardNavItems";

function RecentTransactionsPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedTransactionId, setExpandedTransactionId] = useState(null);
  const [deletingTransactionId, setDeletingTransactionId] = useState(null);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const res = await axios.get("http://localhost:5000/api/transactions", {
        headers: { Authorization: token }
      });

      setTransactions(res.data);
    } catch (error) {
      setErrorMessage("Could not load transactions. Please refresh the page.");
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    const shouldDelete = window.confirm("Delete this transaction?");

    if (!shouldDelete) {
      return;
    }

    try {
      setDeletingTransactionId(id);
      await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
        headers: { Authorization: token }
      });

      setExpandedTransactionId((currentId) => (currentId === id ? null : currentId));
      await loadTransactions();
    } catch (error) {
      setErrorMessage("Unable to delete transaction right now. Please try again.");
    } finally {
      setDeletingTransactionId(null);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [token]);

  const categoryOptions = useMemo(() => {
    return [...new Set(transactions.map((transaction) => transaction.category).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return [...transactions]
      .filter((transaction) => {
        const matchesText =
          normalizedSearchTerm.length === 0 || String(transaction.text || "").toLowerCase().includes(normalizedSearchTerm);
        const matchesCategory = selectedCategory === "all" || transaction.category === selectedCategory;
        const numericAmount = Number(transaction.amount) || 0;
        const matchesAmountFilter =
          amountFilter === "all" ||
          (amountFilter === "income" && numericAmount >= 0) ||
          (amountFilter === "expense" && numericAmount < 0);

        return matchesText && matchesCategory && matchesAmountFilter;
      })
      .sort((a, b) => {
        const amountDifference = Number(a.amount) - Number(b.amount);
        const idDifference = Number(a.id) - Number(b.id);

        if (sortBy === "amount-asc") {
          return amountDifference;
        }

        if (sortBy === "amount-desc") {
          return -amountDifference;
        }

        if (sortBy === "oldest") {
          return idDifference;
        }

        return -idDifference;
      });
  }, [transactions, searchTerm, selectedCategory, amountFilter, sortBy]);

  const visibleAmountTotal = useMemo(() => {
    return filteredTransactions.reduce((total, transaction) => total + (Number(transaction.amount) || 0), 0);
  }, [filteredTransactions]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setAmountFilter("all");
    setSortBy("newest");
  };

  const formatTransactionDate = (dateValue) => {
    if (!dateValue) {
      return "No date available";
    }

    const parsedDate = new Date(dateValue);

    if (Number.isNaN(parsedDate.getTime())) {
      return "No date available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
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
        activeSection="/dashboard/recent-transactions"
        onNavigate={handleNavigation}
        onLogout={handleLogout}
      />

      <div className="dashboard-main-content">
        <div className="dashboard-card">
          <h2 className="dashboard-title">Recent Transactions</h2>

          <div className="transactions-section">
            <div className="recent-transactions-toolbar">
              <input
                type="text"
                className="dashboard-input recent-transaction-search"
                placeholder="Search by title"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />

              <select
                className="dashboard-select"
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                <option value="all">All categories</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                className="dashboard-select"
                value={amountFilter}
                onChange={(event) => setAmountFilter(event.target.value)}
              >
                <option value="all">All types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <button type="button" className="transaction-secondary-button transaction-clear-button" onClick={clearFilters}>
                Clear filters
              </button>
            </div>

            <p className="recent-transactions-meta">
              Showing {filteredTransactions.length} of {transactions.length} transactions • Visible total Rs.
              {visibleAmountTotal.toLocaleString()}
            </p>

            {errorMessage ? (
              <p className="empty-state">{errorMessage}</p>
            ) : isLoading ? (
              <p className="empty-state">Loading transactions...</p>
            ) : transactions.length === 0 ? (
              <p className="empty-state">No transactions yet.</p>
            ) : filteredTransactions.length === 0 ? (
              <p className="empty-state">No transactions match your filters.</p>
            ) : (
              <ul className="transactions-list">
                {filteredTransactions.map((transaction) => (
                  <li key={transaction.id} className="transaction-item">
                    <span className="transaction-text">{transaction.text}</span>
                    <span className="transaction-category">{transaction.category}</span>
                    <span className={`transaction-amount ${Number(transaction.amount) < 0 ? "transaction-amount-expense" : "transaction-amount-income"}`}>
                      Rs.{Number(transaction.amount).toLocaleString()}
                    </span>
                    <div className="transaction-actions">
                      <button
                        type="button"
                        className="transaction-secondary-button"
                        onClick={() =>
                          setExpandedTransactionId((currentId) => (currentId === transaction.id ? null : transaction.id))
                        }
                      >
                        {expandedTransactionId === transaction.id ? "Hide details" : "Details"}
                      </button>
                      <button
                        className="transaction-delete-button"
                        onClick={() => deleteTransaction(transaction.id)}
                        disabled={deletingTransactionId === transaction.id}
                      >
                        {deletingTransactionId === transaction.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>

                    {expandedTransactionId === transaction.id ? (
                      <div className="transaction-details">
                        <span>Type: {Number(transaction.amount) < 0 ? "Expense" : "Income"}</span>
                        <span>Date: {formatTransactionDate(transaction.date)}</span>
                        <span>Transaction ID: {transaction.id}</span>
                      </div>
                    ) : null}
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

export default RecentTransactionsPage;
