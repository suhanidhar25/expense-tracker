import React, { useEffect, useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import { getExpenses } from "./api";
import logo from "./assets/logo.svg";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const data = await getExpenses();
      console.log("Expenses loaded:", data);
      let expenseArray = Array.isArray(data) ? data : data.expenses || [];
      setExpenses(expenseArray);
    } catch (err) {
      console.error("Error fetching expenses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a1f35] via-[#0d2a4a] to-[#051220]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={logo} alt="Budgetly" className="w-14 h-14" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white">Budgetly</h1>
              <p className="text-sm text-slate-300">Expense Tracker</p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-slate-300 font-light">Manage and track your expenses with clarity</p>
          <p className="text-xs text-slate-400 mt-2">Secure · Fast · Simple</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-linear-to-r from-[#0b2540] to-[#1a4d7a] px-6 sm:px-8 py-4 sm:py-6 border-b border-blue-100">
              <h2 className="text-2xl font-bold text-white">Add New Expense</h2>
            </div>
            <div className="p-6 sm:p-8">
              <ExpenseForm onAdd={loadExpenses} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-linear-to-r from-[#0b2540] to-[#1a4d7a] px-6 sm:px-8 py-4 sm:py-6 border-b border-blue-100">
              <h2 className="text-2xl font-bold text-white">Recent Expenses</h2>
            </div>
            <div className="p-6 sm:p-8">
              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0b2540]"></div>
                  <p className="text-gray-500 mt-3">Loading expenses...</p>
                </div>
              ) : (
                <ExpenseList expenses={expenses} refresh={loadExpenses} />
              )}
            </div>
          </div>
        </main>

        <footer className="mt-16 text-center">
          <p className="text-sm text-blue-300 font-light">Built by Suhani Dhar </p>
          <p className="text-xs text-blue-400 mt-1">© 2025 Expense Tracker. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
