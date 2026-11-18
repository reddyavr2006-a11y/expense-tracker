import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

import "./App.css";

function App() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: new Date()
  .toISOString()
  .split("T")[0],

    note: ""
  });

  useEffect(() => {
    localStorage.setItem(
      "expenses",
      JSON.stringify(expenses)
    );
  }, [expenses]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.amount || Number(form.amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    if (!form.category) {
      alert("Select a category");
      return;
    }

    const newExpense = {
      id: Date.now(),
      ...form
    };

    setExpenses([...expenses, newExpense]);

    setForm({
      amount: "",
      category: "",
      date: "",
      note: ""
    });
  };

  const deleteExpense = (id) => {
    if (window.confirm("Delete Expense?")) {
      setExpenses(
        expenses.filter(
          (expense) => expense.id !== id
        )
      );
    }
  };

  const exportCSV = () => {
    const headers =
      "Amount,Category,Date,Note\n";

    const rows = expenses
      .map(
        (expense) =>
          `${expense.amount},${expense.category},${expense.date},${expense.note}`
      )
      .join("\n");

    const csv = headers + rows;

    const blob = new Blob(
      [csv],
      { type: "text/csv" }
    );

    const url =
      window.URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download = "expenses.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  };

  const total = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount),
    0
  );

  const chartData = expenses.reduce(
    (acc, expense) => {
      const found = acc.find(
        (item) =>
          item.name ===
          expense.category
      );

      if (found) {
        found.value += Number(
          expense.amount
        );
      } else {
        acc.push({
          name: expense.category,
          value: Number(
            expense.amount
          )
        });
      }

      return acc;
    },
    []
  );

  const monthlyData = expenses.reduce(
    (acc, expense) => {
      const month = expense.date
        ? expense.date.substring(0, 7)
        : "Unknown";

      const found = acc.find(
        (item) => item.month === month
      );

      if (found) {
        found.total += Number(
          expense.amount
        );
      } else {
        acc.push({
          month,
          total: Number(
            expense.amount
          )
        });
      }

      return acc;
    },
    []
  );

  const colors = [
    "#2563eb",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4"
  ];

  return (
    <div className="container">
      <div className="header">
        <h1>Expense Tracker Dashboard</h1>
      </div>

      <div className="summary-card">
        <h3>Total Spending</h3>
        <p>₹{total}</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
            />

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              <option value="">
                Select Category
              </option>
              <option>Food</option>
              <option>Transport</option>
              <option>Bills</option>
              <option>Shopping</option>
              <option>Entertainment</option>
              <option>Other</option>
            </select>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />

            <input
              type="text"
              name="note"
              placeholder="Note"
              value={form.note}
              onChange={handleChange}
            />

          </div>

          <br />

          <button
            className="btn"
            type="submit"
          >
            Add Expense
          </button>

          <button
            type="button"
            className="btn"
            onClick={exportCSV}
            style={{
              marginLeft: "10px"
            }}
          >
            Export CSV
          </button>
        </form>
      </div>

      <div className="card">
        <h2>Category Breakdown</h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >
              {chartData.map(
                (entry, index) => (
                  <Cell
                    key={index}
                    fill={
                      colors[
                        index %
                          colors.length
                      ]
                    }
                  />
                )
              )}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2>Monthly Expense Trend</h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <BarChart
            data={monthlyData}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="total"
              fill="#2563eb"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2>Expense List</h2>

        {expenses.length === 0 ? (
          <p>
            No expenses added yet.
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map(
                (expense) => (
                  <tr
                    key={expense.id}
                  >
                    <td>
                      ₹
                      {expense.amount}
                    </td>

                    <td>
                      {expense.category}
                    </td>

                    <td>
                      {expense.date}
                    </td>

                    <td>
                      {expense.note}
                    </td>

                    <td>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteExpense(
                            expense.id
                          )
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;