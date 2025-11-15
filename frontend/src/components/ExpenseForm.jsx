import React, { useState } from "react";
import { addExpense } from "../api";

export default function ExpenseForm({ onAdd }) {
  // remove title from the form state entirely
  const [form, setForm] = useState({ amount: "", category: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.amount || !form.category) {
      alert("Please fill in amount and category");
      return;
    }

    setLoading(true);
    try {
      const newExpense = {
        // Title intentionally omitted per request
        amount: Number(form.amount),
        category: form.category,
        date: new Date().toISOString(),
      };
      const resp = await addExpense(newExpense);
      console.log("addExpense returned:", resp);
      setForm({ amount: "", category: "" });
      // Immediately refresh list
      onAdd && onAdd();
    } catch (err) {
      const msg = err?.message || String(err);
      alert("Error adding expense: " + msg);
      console.error("Error adding expense:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹)</label>
        <input
          type="number"
          placeholder="Enter amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:border-[#0b2540] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
        <input
          type="text"
          placeholder="e.g. food, travel, utilities"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-base focus:border-[#0b2540] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg text-white font-semibold text-base transition-all duration-200 ${
          loading
            ? "bg-gray-400 cursor-not-allowed shadow-md"
            : "bg-[#0b2540] hover:bg-[#051720] shadow-lg hover:shadow-xl active:shadow-md"
        }`}
      >
        {loading ? "Adding..." : "+ Add Expense"}
      </button>
    </form>
  );
}
