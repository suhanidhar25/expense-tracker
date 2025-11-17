import React, { useState, useEffect } from "react";
import { addExpense, updateExpense } from "../api";

export default function ExpenseForm({ onAdd, editingExpense, clearEdit }) {
  const [form, setForm] = useState({ amount: "", category: "" });
  const [loading, setLoading] = useState(false);

  // LOAD DATA WHEN EDITING
  useEffect(() => {
    if (editingExpense) {
      setForm({
        expenseId: editingExpense.expenseId,
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: editingExpense.date,
      });
    }
  }, [editingExpense]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.amount || !form.category) {
      alert("Please fill in both fields");
      return;
    }

    setLoading(true);

    try {
      // ------------ EDIT MODE ------------
      if (editingExpense) {
        const payload = {
          expenseId: form.expenseId,
          title: form.category,
          amount: Number(form.amount),
          category: form.category,
          date: form.date || new Date().toISOString(),
        };

        await updateExpense(payload);
        clearEdit();
        onAdd && onAdd();
        return;
      }

      // ------------ ADD MODE ------------
      const payload = {
        title: form.category,
        amount: Number(form.amount),
        category: form.category,
        date: new Date().toISOString(),
      };

      await addExpense(payload);
      setForm({ amount: "", category: "" });
      onAdd && onAdd();
    } catch (err) {
      alert("Error: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-bold text-[#0b2540]">
        {editingExpense ? "Edit Expense" : "Add New Expense"}
      </h2>

      <div>
        <label className="block mb-1 font-medium text-gray-600">Amount (₹)</label>
        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="Enter amount"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-600">Category</label>
        <input
          type="text"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="e.g. food, travel"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-[#0b2540] text-white py-2 rounded-md hover:brightness-110"
        >
          {editingExpense ? "Save Changes" : "Add Expense"}
        </button>

        {editingExpense && (
          <button
            type="button"
            onClick={clearEdit}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
