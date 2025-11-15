const API_BASE = "https://ypxsttk6ni.execute-api.ap-south-1.amazonaws.com/dev";

// Add Expense
export async function addExpense(expenseData) {
  const res = await fetch(`${API_BASE}/add-expense`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expenseData),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => null);
    console.error("addExpense failed", res.status, text);
    throw new Error(text || `Failed to add expense (status ${res.status})`);
  }
  const json = await res.json().catch(() => null);
  console.log("addExpense response:", json);
  return json;
}

// Get Expenses
export async function getExpenses() {
  const res = await fetch(`${API_BASE}/get-expense`);
  if (!res.ok) {
    const text = await res.text().catch(() => null);
    console.error("getExpenses failed", res.status, text);
    throw new Error(text || `Failed to fetch expenses (status ${res.status})`);
  }
  const json = await res.json().catch(() => null);
  console.log("getExpenses response:", json);
  return json;
}

// Delete Expense
export async function deleteExpense(expenseId) {
  const res = await fetch(`${API_BASE}/delete-expense`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ expenseId }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => null);
    console.error("deleteExpense failed", res.status, text);
    throw new Error(text || `Failed to delete expense (status ${res.status})`);
  }
  const json = await res.json().catch(() => null);
  console.log("deleteExpense response:", json);
  return json;
}
