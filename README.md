# <h1 align="center">💸 CashFlow</h1>

<p align="center">An interactive full-stack expense tracker web application built with <b>React</b>, <b>Node.js/Express</b>, and <b>MySQL</b>.</p>

---

## ✨ Features

- 🔐 User registration and login with JWT authentication
- ➕ Add income/expense transactions
- 🗑️ Delete transactions
- 📊 Dashboard summary (income, expense, balance)
- 📈 Chart visualization for transaction insights
- 🗓️ Monthly report aggregation
- 🧭 Sidebar section navigation with smooth scrolling

---

## 🛠️ Technologies Used

### 💻 Frontend:

- React
- Axios
- Chart.js
- Bootstrap

### ⚙️ Backend:

- Node.js
- Express.js
- JWT Authentication

### 🗄️ Database:

- MySQL

---

## 🗂️ Project Structure

```text
CashFlow/
├── backend/
│   ├── db.js
│   ├── server.js
│   ├── middleware/
│   │   └── auth.js
│   └── routes/
│       ├── auth.js
│       └── transactions.js
└── frontend/
    └── src/
        ├── components/
        │   └── Chart.js
        ├── pages/
        │   ├── Dashboard.js
        │   ├── Login.js
        │   └── Register.js
        └── styles/
```

---

## 🚀 Quick Start

### 1) Prerequisites

- Node.js 18+
- npm
- MySQL server

### 2) Database setup

Create a database named:

```sql
CREATE DATABASE expense_tracker;
```

Then create required tables:

<details>
<summary><b>Click to expand SQL schema</b></summary>

```sql
USE expense_tracker;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  text VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

</details>

### 3) Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
JWT_SECRET=your_super_secret_key
```

> Note: Database credentials are currently set in `backend/db.js`.

Start backend:

```bash
node server.js
```

Server runs at: `http://localhost:5000`

### 4) Frontend setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## 🔌 API Endpoints

Base URL: `http://localhost:5000`

### Auth Routes

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and get JWT token | No |

### Transaction Routes

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/transactions` | Get user transactions | Yes |
| POST | `/api/transactions` | Add a transaction | Yes |
| DELETE | `/api/transactions/:id` | Delete transaction by id | Yes |
| GET | `/api/transactions/monthly` | Get monthly totals | Yes |

Use request header for protected routes:

```http
Authorization: <token>
```

---

## 🧪 Available Scripts

### Frontend (`frontend/package.json`)

- `npm start` – runs the app in development mode
- `npm test` – launches test runner
- `npm run build` – builds production app

### Backend (`backend/package.json`)

- `npm test` – placeholder test script

---

## 🧭 Usage Flow

1. Register account
2. Login to receive token
3. Add transactions from dashboard
4. Review summary + chart
5. Check monthly reports

---

## 🛠️ Troubleshooting

<details>
<summary><b>Backend won’t start</b></summary>

- Confirm MySQL is running.
- Confirm `expense_tracker` database exists.
- Ensure `JWT_SECRET` exists in `backend/.env`.
- Verify DB credentials in `backend/db.js`.

</details>

<details>
<summary><b>Login/Register request fails</b></summary>

- Confirm backend is running on port `5000`.
- Confirm frontend calls point to `http://localhost:5000`.

</details>

<details>
<summary><b>Transactions not loading</b></summary>

- Ensure JWT token is saved in localStorage.
- Check browser devtools for failed API calls.
- Verify `Authorization` header is present.

</details>

---

## 📌 Next Improvements 

- Move DB credentials from `db.js` to environment variables
- Add backend scripts: `start` and `dev` (`nodemon`)
- Add transaction validation/error handling
---

<p align="center">Built for tracking personal finance with a clean dashboard experience! 📊</p>

---

<div align="center">
👩🏼‍💻 Credit: <a href="https://github.com/ashmikan">Ashmika Nathali </a>
Last Edited on: 27/02/2026
</div>
