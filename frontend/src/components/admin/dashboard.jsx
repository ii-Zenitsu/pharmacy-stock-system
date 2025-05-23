import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [stats, setStats] = useState({
    medicines: 0,
    suppliers: 0,
    sales: 0,
    lowStock: 0,
  });
  const [recentSales, setRecentSales] = useState([]);
  const [lowStockList, setLowStockList] = useState([]);
  const [salesChart, setSalesChart] = useState({ labels: [], data: [] });
  const [userRole, setUserRole] = useState("guest");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Optionally, fetch user role from backend
        let role = "guest";
        try {
          const userRes = await fetch("/api/user");
          if (userRes.ok) {
            const user = await userRes.json();
            role = user.role || "guest";
          }
        } catch {}
        setUserRole(role);

        // Fetch dashboard data
        const [
          medRes,
          supRes,
          salesRes,
          lowStockRes,
          recentSalesRes,
          lowStockListRes,
          salesChartRes,
        ] = await Promise.all([
          fetch("/api/medicines/count"),
          fetch("/api/suppliers/count"),
          fetch("/api/sales/count"),
          fetch("/api/medicines/lowstock/count"),
          fetch("/api/sales/recent"),
          fetch("/api/medicines/lowstock"),
          fetch("/api/sales/chart"),
        ]);
        const medicines = await medRes.json();
        const suppliers = await supRes.json();
        const sales = await salesRes.json();
        const lowStock = await lowStockRes.json();
        const recentSales = await recentSalesRes.json();
        const lowStockList = await lowStockListRes.json();
        const salesChart = await salesChartRes.json();

        setStats({
          medicines: medicines.count,
          suppliers: suppliers.count,
          sales: sales.count,
          lowStock: lowStock.count,
        });
        setRecentSales(recentSales.sales || []);
        setLowStockList(lowStockList.medicines || []);
        setSalesChart({
          labels: salesChart.labels || [],
          data: salesChart.data || [],
        });
      } catch (err) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Pharmacy Dashboard</h2>
      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "2rem", margin: "2rem 0" }}>
        <SummaryCard title="Medicines" value={stats.medicines} color="#4e73df" />
        <SummaryCard title="Suppliers" value={stats.suppliers} color="#1cc88a" />
        <SummaryCard title="Sales" value={stats.sales} color="#36b9cc" />
        <SummaryCard title="Low Stock" value={stats.lowStock} color="#e74a3b" />
      </div>

      {/* Main Content */}
      <div style={{ display: "flex", gap: "2rem" }}>
        {/* Sales Chart */}
        <div style={{ flex: 2, background: "#fff", padding: "1.5rem", borderRadius: "8px" }}>
          <h3>Sales (Last 7 Days)</h3>
          <Bar
            data={{
              labels: salesChart.labels,
              datasets: [
                {
                  label: "Sales",
                  data: salesChart.data,
                  backgroundColor: "#4e73df",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
              },
            }}
          />
        </div>

        {/* Low Stock List */}
        <div style={{ flex: 1, background: "#fff", padding: "1.5rem", borderRadius: "8px" }}>
          <h3>Low Stock Medicines</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {lowStockList.length === 0 && <li>All medicines in stock.</li>}
            {lowStockList.map((med) => (
              <li key={med.id || med.name} style={{ marginBottom: "0.5rem" }}>
                <strong>{med.name}</strong>
                {/* Only show fields if present */}
                {med.bar_code && <span> | Barcode: {med.bar_code}</span>}
                {med.dosage && <span> | Dosage: {med.dosage}</span>}
                {med.formulation && <span> | Formulation: {med.formulation}</span>}
                {typeof med.price !== "undefined" && <span> | Price: ${med.price}</span>}
                {med.alert_threshold && <span> | Alert: {med.alert_threshold}</span>}
                {med.provider && (
                  <span>
                    {" "}
                    | Provider:{" "}
                    {typeof med.provider === "object"
                      ? med.provider.name
                      : med.provider}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Sales Table */}
      <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "8px", marginTop: "2rem" }}>
        <h3>Recent Sales</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fc" }}>
              <th style={{ padding: "0.5rem" }}>Date</th>
              <th style={{ padding: "0.5rem" }}>Medicine</th>
              <th style={{ padding: "0.5rem" }}>Quantity</th>
              <th style={{ padding: "0.5rem" }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: "1rem" }}>
                  No recent sales.
                </td>
              </tr>
            )}
            {recentSales.map((sale) => (
              <tr key={sale._id || sale.id}>
                <td style={{ padding: "0.5rem" }}>
                  {sale.date
                    ? new Date(sale.date).toLocaleDateString()
                    : "N/A"}
                </td>
                <td style={{ padding: "0.5rem" }}>
                  {sale.medicineName || sale.medicine?.name || "N/A"}
                </td>
                <td style={{ padding: "0.5rem" }}>{sale.quantity ?? "N/A"}</td>
                <td style={{ padding: "0.5rem" }}>
                  {typeof sale.total !== "undefined"
                    ? `$${sale.total.toFixed(2)}`
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ title, value, color }) => (
  <div
    style={{
      background: color,
      color: "#fff",
      padding: "1.5rem",
      borderRadius: "8px",
      minWidth: "150px",
      flex: 1,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    }}
  >
    <h4 style={{ margin: 0 }}>{title}</h4>
    <p style={{ fontSize: "2rem", margin: 0 }}>{value}</p>
  </div>
);

export default Dashboard;