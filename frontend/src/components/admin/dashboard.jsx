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
import { Loader2, Package, Building2, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";
import { Table, Spin, message } from "antd";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const { medicines } = useSelector((state) => state.medicines);
  const { providers } = useSelector((state) => state.providers);
  const [messageApi, contextHolder] = message.useMessage();

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
  const { user } = useSelector((state) => state.auth);
  const { medicines } = useSelector((state) => state.medicines);
  const { providers } = useSelector((state) => state.providers);

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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Sales Overview',
        font: {
          size: 16,
          family: 'Inter'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            family: 'Inter'
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            family: 'Inter'
          }
        }
      }
    }
  };

  const chartData = {
              labels: salesChart.labels,
              datasets: [
                {
        label: 'Sales',
                  data: salesChart.data,
        backgroundColor: '#67AE6E',
        borderRadius: 8,
      },
    ],
  };

  const lowStockColumns = [
    {
      title: 'Medicine',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="font-semibold">{text}</span>
    },
    {
      title: 'Current Stock',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, record) => (
        <span className={quantity <= record.alert_threshold ? "text-error font-semibold" : ""}>
          {quantity}
        </span>
      )
    },
    {
      title: 'Alert Threshold',
      dataIndex: 'alert_threshold',
      key: 'alert_threshold',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <span className={`badge ${record.quantity <= record.alert_threshold ? "badge-error" : "badge-success"}`}>
          {record.quantity <= record.alert_threshold ? "Low Stock" : "In Stock"}
                  </span>
      )
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin indicator={<Loader2 className="animate-spin text-primary" size={32} />} />
    </div>
  );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-6 py-8">
        {contextHolder}
        
        {/* Stats Cards - Made larger and more prominent */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-base-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Package className="text-primary" size={24} />
              </div>
    <div>
                <h3 className="text-base-content/60 text-base font-medium">Total Medicines</h3>
                <p className="text-2xl font-bold mt-1">{stats.medicines}</p>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-secondary/10 p-3 rounded-lg">
                <Building2 className="text-secondary" size={24} />
              </div>
              <div>
                <h3 className="text-base-content/60 text-base font-medium">Suppliers</h3>
                <p className="text-2xl font-bold mt-1">{stats.suppliers}</p>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-success/10 p-3 rounded-lg">
                <TrendingUp className="text-success" size={24} />
              </div>
              <div>
                <h3 className="text-base-content/60 text-base font-medium">Total Sales</h3>
                <p className="text-2xl font-bold mt-1">{stats.sales}</p>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-error/10 p-3 rounded-lg">
                <AlertTriangle className="text-error" size={24} />
              </div>
              <div>
                <h3 className="text-base-content/60 text-base font-medium">Low Stock Items</h3>
                <p className="text-2xl font-bold mt-1">{stats.lowStock}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid - Adjusted for better proportions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales Chart - Takes 2 columns */}
          <div className="lg:col-span-2 bg-base-100 rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Sales Overview</h2>
              <button className="btn btn-ghost btn-sm gap-2">
                View Details <ArrowRight size={16} />
            </button>
          </div>
            <div className="h-[400px]">
              {salesChart.labels.length > 0 ? (
                <Bar options={chartOptions} data={chartData} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-base-content/60">
                  <TrendingUp size={48} className="mb-4" />
                  <p className="text-lg">No sales data available yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Low Stock Table - Takes 1 column */}
          <div className="bg-base-100 rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Low Stock Alerts</h2>
              <button className="btn btn-ghost btn-sm gap-2">
                View All <ArrowRight size={16} />
            </button>
            </div>
            <div className="overflow-x-auto">
              <Table
                dataSource={lowStockList}
                columns={lowStockColumns}
                pagination={{ pageSize: 6 }}
                rowKey="id"
                className="custom-table"
                size="middle"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployeeDashboard = () => {
  const { medicines } = useSelector((state) => state.medicines);
  const [stats, setStats] = useState({
    medicines: 0,
    lowStock: 0,
    recentSales: 0,
    totalValue: 0,
  });
  const [lowStockList, setLowStockList] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    setLoading(true);
    if (!medicines) {
      setLoading(false);
      return;
    }

    // Calculate low stock medicines
    const lowStock = medicines.filter(
      (med) => med.quantity <= med.alert_threshold
    );

    // Calculate total value of inventory with proper checks
    const totalValue = medicines.reduce((sum, med) => {
      const price = parseFloat(med.price) || 0;
      const quantity = parseInt(med.quantity) || 0;
      return sum + (price * quantity);
    }, 0);

    setStats({
      medicines: medicines.length,
      lowStock: lowStock.length,
      recentSales: 0, // TODO: Replace with actual sales data
      totalValue: totalValue,
    });

    setLowStockList(lowStock);
    // TODO: Get recent sales data when available
    setRecentSales([]);
    setLoading(false);
  }, [medicines]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin indicator={<Loader2 className="animate-spin text-primary" size={32} />} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-6 py-8">
        {contextHolder}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-base-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Package className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-base-content/60 text-base font-medium">Total Medicines</h3>
                <p className="text-2xl font-bold mt-1">{stats.medicines}</p>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-error/10 p-3 rounded-lg">
                <AlertTriangle className="text-error" size={24} />
              </div>
              <div>
                <h3 className="text-base-content/60 text-base font-medium">Low Stock Items</h3>
                <p className="text-2xl font-bold mt-1">{stats.lowStock}</p>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-success/10 p-3 rounded-lg">
                <TrendingUp className="text-success" size={24} />
              </div>
              <div>
                <h3 className="text-base-content/60 text-base font-medium">Recent Sales</h3>
                <p className="text-2xl font-bold mt-1">{stats.recentSales}</p>
              </div>
            </div>
      </div>

          <div className="bg-base-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-secondary/10 p-3 rounded-lg">
                <Building2 className="text-secondary" size={24} />
              </div>
              <div>
                <h3 className="text-base-content/60 text-base font-medium">Total Value</h3>
                <p className="text-2xl font-bold mt-1">
                  ${typeof stats.totalValue === 'number' ? stats.totalValue.toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Sales Table - Takes 2 columns */}
          <div className="lg:col-span-2 bg-base-100 rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Sales</h2>
              <button className="btn btn-ghost btn-sm gap-2">
                View All <ArrowRight size={16} />
              </button>
            </div>
            <div className="overflow-x-auto">
              {recentSales.length > 0 ? (
                <Table
                  dataSource={recentSales}
                  columns={[
                    {
                      title: 'Date',
                      dataIndex: 'date',
                      key: 'date',
                      render: (date) => new Date(date).toLocaleDateString(),
                    },
                    {
                      title: 'Medicine',
                      dataIndex: 'medicine',
                      key: 'medicine',
                      render: (text) => <span className="font-medium">{text}</span>,
                    },
                    {
                      title: 'Quantity',
                      dataIndex: 'quantity',
                      key: 'quantity',
                      render: (quantity) => <span className="font-medium">{quantity}</span>,
                    },
                    {
                      title: 'Total',
                      dataIndex: 'total',
                      key: 'total',
                      render: (total) => <span className="font-medium">${total.toFixed(2)}</span>,
                    },
                  ]}
                  pagination={{ pageSize: 6 }}
                  rowKey="id"
                  className="custom-table"
                  size="middle"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-base-content/60">
                  <TrendingUp size={48} className="mb-4" />
                  <p className="text-lg">No recent sales data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Low Stock Table - Takes 1 column */}
          <div className="bg-base-100 rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Low Stock Alerts</h2>
              <button className="btn btn-ghost btn-sm gap-2">
                View All <ArrowRight size={16} />
              </button>
            </div>
            <div className="overflow-x-auto">
              {lowStockList.length > 0 ? (
                <Table
                  dataSource={lowStockList}
                  columns={lowStockColumns}
                  pagination={{ pageSize: 6 }}
                  rowKey="id"
                  className="custom-table"
                  size="middle"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] text-base-content/60">
                  <Package size={48} className="mb-4" />
                  <p className="text-lg">No low stock alerts</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  return user?.role === "admin" ? <AdminDashboard /> : <EmployeeDashboard />;
};

export default Dashboard;

