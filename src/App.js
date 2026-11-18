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
    const saved =
      localStorage.getItem("expenses");

    return saved
      ? JSON.parse(saved)
      : [];
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
      [e.target.name]:
        e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.amount ||
      Number(form.amount) <= 0
    ) {
      alert(
        "Enter valid amount"
      );
      return;
    }

    if (!form.category) {
      alert(
        "Please select category"
      );
      return;
    }

    const newExpense = {
      id: Date.now(),
      ...form
    };

    setExpenses([
      ...expenses,
      newExpense
    ]);

    setForm({
      amount: "",
      category: "",
      date: new Date()
        .toISOString()
        .split("T")[0],
      note: ""
    });
  };

  const deleteExpense = (id) => {
    if (
      window.confirm(
        "Delete Expense?"
      )
    ) {
      setExpenses(
        expenses.filter(
          (expense) =>
            expense.id !== id
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

    const csv =
      headers + rows;

    const blob = new Blob(
      [csv],
      {
        type: "text/csv"
      }
    );

    const url =
      window.URL.createObjectURL(
        blob
      );

    const a =
      document.createElement(
        "a"
      );

    a.href = url;
    a.download =
      "expenses.csv";

    a.click();
  };

  const total =
    expenses.reduce(
      (sum, expense) =>
        sum +
        Number(
          expense.amount
        ),
      0
    );

  const highestExpense =
    expenses.length > 0
      ? Math.max(
          ...expenses.map(
            (e) =>
              Number(
                e.amount
              )
          )
        )
      : 0;

  const averageExpense =
    expenses.length > 0
      ? Math.round(
          total /
            expenses.length
        )
      : 0;

  const chartData =
    expenses.reduce(
      (acc, expense) => {

        const found =
          acc.find(
            (item) =>
              item.name ===
              expense.category
          );

        if (found) {
          found.value +=
            Number(
              expense.amount
            );
        } else {
          acc.push({
            name:
              expense.category,
            value:
              Number(
                expense.amount
              )
          });
        }

        return acc;
      },
      []
    );

  const monthlyData =
    expenses.reduce(
      (acc, expense) => {

        const month =
          expense.date
            ? expense.date.substring(
                0,
                7
              )
            : "Unknown";

        const found =
          acc.find(
            (item) =>
              item.month ===
              month
          );

        if (found) {
          found.total +=
            Number(
              expense.amount
            );
        } else {

          acc.push({
            month,
            total:
              Number(
                expense.amount
              )
          });

        }

        return acc;

      },
      []
    );

  const colors = [
    "#15803d",
    "#2563eb",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4"
  ];

  return (
    <div className="container">

      <div className="header">
        <h1>
          Hello, Anusha 👋
        </h1>

        <p>
          Here's your expense overview
          for this month.
        </p>
      </div>

      <div className="stats-grid">

        <div className="stat-card">
          <h4>
            Total Expenses
          </h4>

          <h2>
            ₹{total}
          </h2>
        </div>

        <div className="stat-card">
          <h4>
            Transactions
          </h4>

          <h2>
            {
              expenses.length
            }
          </h2>
        </div>

        <div className="stat-card">
          <h4>
            Highest Expense
          </h4>

          <h2>
            ₹
            {
              highestExpense
            }
          </h2>
        </div>

        <div className="stat-card">
          <h4>
            Average Expense
          </h4>

          <h2>
            ₹
            {
              averageExpense
            }
          </h2>
        </div>

      </div>

      <div className="card">

        <form
          onSubmit={
            handleSubmit
          }
        >

          <div className="form-grid">

            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={
                form.amount
              }
              onChange={
                handleChange
              }
            />

            <select
              name="category"
              value={
                form.category
              }
              onChange={
                handleChange
              }
            >
              <option value="">
                Select Category
              </option>

              <option>
                Food
              </option>

              <option>
                Transport
              </option>

              <option>
                Bills
              </option>

              <option>
                Shopping
              </option>

              <option>
                Entertainment
              </option>

              <option>
                Other
              </option>

            </select>

            <input
              type="date"
              name="date"
              value={
                form.date
              }
              onChange={
                handleChange
              }
            />

            <input
              type="text"
              name="note"
              placeholder="Note"
              value={
                form.note
              }
              onChange={
                handleChange
              }
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
            className="btn"
            type="button"
            onClick={
              exportCSV
            }
            style={{
              marginLeft:
                "10px"
            }}
          >
            Export CSV
          </button>

        </form>

      </div>

      <div className="chart-grid">

        <div className="card">

          <h2>
            Category Breakdown
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={
                  chartData
                }
                dataKey="value"
                outerRadius={
                  100
                }
                label
              >

                {chartData.map(
                  (
                    entry,
                    index
                  ) => (
                    <Cell
                      key={
                        index
                      }
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

          <h2>
            Monthly Trend
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <BarChart
              data={
                monthlyData
              }
            >

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="total"
                fill="#15803d"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div className="card">

        <h2>
          Expense History
        </h2>

        <table>

          <thead>
            <tr>
              <th>
                Amount
              </th>

              <th>
                Category
              </th>

              <th>
                Date
              </th>

              <th>
                Note
              </th>

              <th>
                Action
              </th>
            </tr>
          </thead>

          <tbody>

            {expenses.map(
              (expense) => (
                <tr
                  key={
                    expense.id
                  }
                >

                  <td>
                    ₹
                    {
                      expense.amount
                    }
                  </td>

                  <td>
                    {
                      expense.category
                    }
                  </td>

                  <td>
                    {
                      expense.date
                    }
                  </td>

                  <td>
                    {
                      expense.note
                    }
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

      </div>

    </div>
  );
}

export default App;