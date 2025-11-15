import React, { useEffect, useState } from "react";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import { getExpenses } from "./api";

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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">💰</span>
            <h2 className="text-5xl font-bold text-white">Budgetly : Expense Tracker</h2>
          </div>
          <p className="text-base text-blue-300 font-light">Manage and track your expenses with ease</p>
          <p className="text-xs text-blue-400 mt-2">Powered by AWS Lambda & DynamoDB</p>
        </header>

        <main className="space-y-8">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-linear-to-r from-[#0b2540] to-[#1a4d7a] px-8 py-6 border-b border-blue-100">
              <h2 className="text-2xl font-bold text-white">Add New Expense</h2>
            </div>
            <div className="p-8">
              <ExpenseForm onAdd={loadExpenses} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-linear-to-r from-[#0b2540] to-[#1a4d7a] px-8 py-6 border-b border-blue-100">
              <h2 className="text-2xl font-bold text-white">Recent Expenses</h2>
            </div>
            <div className="p-8">
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
          <p className="text-sm text-blue-300 font-light">Built with ❤️ by Suhani Dhar & Team</p>
          <p className="text-xs text-blue-400 mt-1">© 2025 Expense Tracker. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
