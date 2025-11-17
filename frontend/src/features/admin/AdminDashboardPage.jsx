import React from "react";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <article className="bg-white p-4 rounded shadow">
          Total sales: --
        </article>
        <article className="bg-white p-4 rounded shadow">
          Total orders: --
        </article>
        <article className="bg-white p-4 rounded shadow">
          Active users: --
        </article>
      </div>
    </div>
  );
}
