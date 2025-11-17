import React from "react";
import { deleteExpense } from "../api";

export default function ExpenseList({ expenses, refresh, onEdit }) {
  async function handleDelete(id) {
    const confirmDelete = confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;

    try {
      await deleteExpense(id);
      refresh(); // reload list after delete
    } catch (err) {
      alert("Error deleting expense!");
      console.error(err);
    }
  }

  const list = Array.isArray(expenses) ? expenses : [];

  return (
    <div>
      {list.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-500 text-lg font-light">
            No expenses recorded yet
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Start by adding your first expense above
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Total */}
          <div className="text-sm text-gray-600 font-medium px-2 mb-4">
            Total:{" "}
            <span className="text-[#0b2540] font-bold">
              ₹
              {list
                .reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
                .toLocaleString()}
            </span>
          </div>

          <ul className="space-y-3">
            {list.map((exp) => {
              const id =
                exp.expenseId ||
                exp.id ||
                exp.expense_id ||
                (exp.pk && exp.pk.S) ||
                String(exp._id || "");

              const category = (exp.category || "").toString();
              const amount = exp.amount ?? "-";
              const dateRaw = exp.date;
              const date = dateRaw ? new Date(dateRaw).toLocaleDateString() : "";

              const title = `${category || "Uncategorized"} - ₹${amount}`;

              return (
                <li
                  key={id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-all"
                >
                  {/* Left */}
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 text-base">{title}</p>
                    <p className="text-sm text-slate-500 mt-1">{date}</p>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center gap-3 mt-3 sm:mt-0">
                    {/* EDIT BUTTON */}
                    <button
                      onClick={() => onEdit(exp)}
                      className="px-3 py-1.5 border border-blue-200 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
                    >
                      Edit
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => handleDelete(id)}
                      className="px-3 py-1.5 border border-red-200 text-red-600 font-medium rounded-md hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
