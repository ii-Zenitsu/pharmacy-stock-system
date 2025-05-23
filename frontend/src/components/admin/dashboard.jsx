import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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

const USERS_PER_PAGE = 8;

const AdminDashboard = () => {
  const { medicines } = useSelector((state) => state.medicines);
  const { providers } = useSelector((state) => state.providers);

  const [stats, setStats] = useState({
    medicines: 0,
    suppliers: 0,
    sales: 0,
    lowStock: 0,
  });
  const [recentSales, setRecentSales] = useState([]);
  const [lowStockList, setLowStockList] = useState([]);
  const [salesChart, setSalesChart] = useState({ labels: [], data: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (!medicines || !providers) {
      setLoading(false);
      return;
    }
    // Low stock calculation
    const lowStock = medicines.filter(
      (med) =>
        typeof med.quantity !== "undefined" &&
        typeof med.alert_threshold !== "undefined" &&
        med.quantity <= med.alert_threshold
    );
    // TODO: Replace with actual sales data from Redux if available
    const sales = [];
    setStats({
      medicines: medicines.length,
      suppliers: providers.length,
      sales: sales.length,
      lowStock: lowStock.length,
    });
    setLowStockList(lowStock);
    setRecentSales([]); // Replace with actual sales data if available
    setSalesChart({ labels: [], data: [] }); // Replace with actual chart data if available
    setLoading(false);
  }, [medicines, providers]);

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

      {/* User Management Section */}
      <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "8px", marginTop: "2rem" }}>
        <h3>Gestion des utilisateurs</h3>
        <UserManagement />
      </div>
    </div>
  );
};

// User Management Component with Add User Form
function UserManagement() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employe",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/users?page=${page}&limit=${USERS_PER_PAGE}`)
      .then(res => res.json())
      .then(data => {
        setUsers(data.users || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, showForm]);

  const handleAddUser = () => {
    setShowForm(true);
    setFormError("");
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);

    // Validation simple
    if (!form.name || !form.email || !form.password || !form.role) {
      setFormError("Tous les champs sont obligatoires.");
      setFormLoading(false);
      return;
    }

    // Appel API pour ajouter l'utilisateur
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        setFormError(err.message || "Erreur lors de l'ajout.");
      } else {
        setShowForm(false);
        setForm({ name: "", email: "", password: "", role: "employe" });
        setPage(1); // Optionnel: revenir à la première page
      }
    } catch {
      setFormError("Erreur réseau.");
    }
    setFormLoading(false);
  };

  return (
    <div>
      <button
        onClick={handleAddUser}
        style={{
          background: "#4e73df",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "0.7rem 1.2rem",
          fontWeight: "bold",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        + Ajouter un utilisateur
      </button>

      {showForm && (
        <form
          onSubmit={handleFormSubmit}
          style={{
            background: "#f8f9fc",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "1.5rem",
            maxWidth: 400,
          }}
        >
          <h4 style={{ marginTop: 0 }}>Nouvel utilisateur</h4>
          <div style={{ marginBottom: "0.7rem" }}>
            <label>Nom :</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #d1d3e2",
                marginTop: "0.2rem",
              }}
              required
            />
          </div>
          <div style={{ marginBottom: "0.7rem" }}>
            <label>Email :</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleFormChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #d1d3e2",
                marginTop: "0.2rem",
              }}
              required
            />
          </div>
          <div style={{ marginBottom: "0.7rem" }}>
            <label>Mot de passe :</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleFormChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #d1d3e2",
                marginTop: "0.2rem",
              }}
              required
            />
          </div>
          <div style={{ marginBottom: "0.7rem" }}>
            <label>Rôle :</label>
            <select
              name="role"
              value={form.role}
              onChange={handleFormChange}
              style={{
                width: "100%",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #d1d3e2",
                marginTop: "0.2rem",
              }}
              required
            >
              <option value="employe">Employé</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {formError && (
            <div style={{ color: "#e74a3b", marginBottom: "0.7rem" }}>{formError}</div>
          )}
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="submit"
              disabled={formLoading}
              style={{
                background: "#1cc88a",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "0.5rem 1.2rem",
                fontWeight: "bold",
                cursor: formLoading ? "not-allowed" : "pointer",
              }}
            >
              {formLoading ? "Ajout..." : "Ajouter"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                background: "#e74a3b",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                padding: "0.5rem 1.2rem",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div>Chargement...</div>
      ) : (
        <>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8f9fc" }}>
                <th style={{ padding: "0.5rem" }}>Nom</th>
                <th style={{ padding: "0.5rem" }}>Email</th>
                <th style={{ padding: "0.5rem" }}>Rôle</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", padding: "1rem" }}>
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ padding: "0.5rem" }}>{user.name}</td>
                  <td style={{ padding: "0.5rem" }}>{user.email}</td>
                  <td style={{ padding: "0.5rem" }}>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "1rem", gap: "1rem" }}>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              style={{
                background: "#f8f9fc",
                color: "#4e73df",
                border: "1px solid #d1d3e2",
                borderRadius: "4px",
                padding: "0.4rem 1rem",
                cursor: page === 1 ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              Précédent
            </button>
            <span style={{ fontWeight: "bold" }}>Page {page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={users.length < USERS_PER_PAGE}
              style={{
                background: "#f8f9fc",
                color: "#4e73df",
                border: "1px solid #d1d3e2",
                borderRadius: "4px",
                padding: "0.4rem 1rem",
                cursor: users.length < USERS_PER_PAGE ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
}

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

const EmployeeDashboard = () => {
  const { medicines } = useSelector((state) => state.medicines);
  const [lowStockList, setLowStockList] = useState([]);
  const [recentSales, setRecentSales] = useState([]);

  useEffect(() => {
    if (!medicines) return;
    // Calculate low stock medicines
    const lowStock = medicines.filter(
      (med) => med.quantity <= med.alert_threshold
    );
    setLowStockList(lowStock);
    // TODO: Get recent sales data when available
    setRecentSales([]);
  }, [medicines]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Employee Dashboard</h2>
      
      {/* Quick Actions */}
      <div style={{ display: "flex", gap: "2rem", margin: "2rem 0" }}>
        <SummaryCard title="Total Medicines" value={medicines?.length || 0} color="#4e73df" />
        <SummaryCard title="Low Stock Items" value={lowStockList.length} color="#e74a3b" />
      </div>

      {/* Main Content */}
      <div style={{ display: "flex", gap: "2rem", flexDirection: "column" }}>
        {/* Low Stock Alerts */}
        <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "8px" }}>
          <h3>Low Stock Alerts</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {lowStockList.length === 0 && <li>All medicines in stock.</li>}
            {lowStockList.map((med) => (
              <li key={med.id} style={{ marginBottom: "0.5rem", color: "#e74a3b" }}>
                <strong>{med.name}</strong> - Current Stock: {med.quantity}
                {med.alert_threshold && <span> (Alert at: {med.alert_threshold})</span>}
              </li>
            ))}
          </ul>
        </div>

        {/* Recent Sales */}
        <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "8px" }}>
          <h3>Your Recent Sales</h3>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <>
      {user?.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <EmployeeDashboard />
      )}
    </>
  )
}

export default Dashboard;
