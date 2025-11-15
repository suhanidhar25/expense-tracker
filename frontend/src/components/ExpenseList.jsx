import React from "react";
import { deleteExpense } from "../api";

export default function ExpenseList({ expenses, refresh }) {
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

  // Make sure we always work with an array
  const list = Array.isArray(expenses) ? expenses : [];

  return (
    <div>
      {list.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-500 text-lg font-light">No expenses recorded yet</p>
          <p className="text-gray-400 text-sm mt-2">Start by adding your first expense above</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 font-medium px-2 mb-4">Total: <span className="text-[#0b2540] font-bold">₹{list.reduce((sum, e) => sum + (Number(e.amount) || 0), 0).toLocaleString()}</span></div>
          <ul className="space-y-3">
            {list.map((exp) => {
              // Defensive id resolution for various backend shapes
              const id = exp.expenseId || exp.id || exp.expense_id || (exp.pk && exp.pk.S) || String(exp._id || "");
              const category = (exp.category || exp.type || "").toString();
              const amount = exp.amount ?? exp.AMOUNT ?? exp.value ?? "-";
              const dateRaw = exp.date || exp.createdAt || exp.timestamp || exp.created_at;
              const date = dateRaw ? new Date(dateRaw).toLocaleString() : "";

              // Title has been removed from the UI per request. Show Category - ₹amount as primary
              const title = `${(category && category.trim()) || "Uncategorized"} - ₹${amount}`;

              return (
                <li key={id} className="flex justify-between items-center bg-linear-to-r from-gray-50 to-gray-100 border-l-4 border-[#0b2540] p-4 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-base">{title}</p>
                    <p className="text-sm text-gray-500 mt-1">{date && <span>{new Date(dateRaw).toLocaleDateString()}</span>}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(id)}
                    className="ml-4 px-4 py-2 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 hover:text-red-700 transition-all shadow-sm hover:shadow-md"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
