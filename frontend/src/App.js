import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import AddTransactionPage from './pages/AddTransactionPage';
import RecentTransactionsPage from './pages/RecentTransactionsPage';
import SummaryPage from './pages/SummaryPage';
import MonthlyReportsPage from './pages/MonthlyReportsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/add-transaction" element={<AddTransactionPage />} />
          <Route path="/dashboard/recent-transactions" element={<RecentTransactionsPage />} />
          <Route path="/dashboard/summary" element={<SummaryPage />} />
          <Route path="/dashboard/monthly-reports" element={<MonthlyReportsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
