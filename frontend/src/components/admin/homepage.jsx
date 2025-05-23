import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loader2, Package, Building2, TrendingUp, AlertTriangle, ArrowRight, Users, ClipboardList, Calendar, Clock, Bell, ChevronRight, Clock4, MapPin, Phone, Mail } from "lucide-react";
import { Table, Spin, message, Card, Row, Col } from "antd";
import axios from "axios";

const AdminHome = () => {
  const { medicines } = useSelector((state) => state.medicines);
  const { providers } = useSelector((state) => state.providers);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const [quickStats, setQuickStats] = useState({
    pendingOrders: 0,
    todaySales: 0,
    lowStockItems: 0,
    activeSuppliers: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (!medicines || !providers) {
      setLoading(false);
      return;
    }

    // Calculate quick stats
    const lowStock = medicines.filter(
      (med) => med.quantity <= med.alert_threshold
    );

    setQuickStats({
      pendingOrders: 5, // TODO: Replace with actual data
      todaySales: 12, // TODO: Replace with actual data
      lowStockItems: lowStock.length,
      activeSuppliers: providers.length,
    });

    // TODO: Replace with actual data
    setRecentActivities([
      { id: 1, type: 'order', message: 'New order #1234 received', time: '5 minutes ago' },
      { id: 2, type: 'stock', message: 'Stock alert for Paracetamol', time: '1 hour ago' },
      { id: 3, type: 'supplier', message: 'New supplier added: PharmaCorp', time: '2 hours ago' },
    ]);

    setUpcomingTasks([
      { id: 1, title: 'Review monthly inventory', due: 'Tomorrow' },
      { id: 2, title: 'Process supplier payments', due: 'In 2 days' },
      { id: 3, title: 'Update price list', due: 'Next week' },
    ]);

    setLoading(false);
  }, [medicines, providers]);

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

        {/* Welcome Section */}
        <div className="bg-base-100 rounded-xl shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
          <p className="text-base-content/60">Here's what's happening in your pharmacy today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-base-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <ClipboardList className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-base-content/60 text-base font-medium">Pending Orders</h3>
                <p className="text-2xl font-bold mt-1">{quickStats.pendingOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-success/10 p-3 rounded-lg">
                <TrendingUp className="text-success" size={24} />
              </div>
              <div>
                <h3 className="text-base-content/60 text-base font-medium">Today's Sales</h3>
                <p className="text-2xl font-bold mt-1">{quickStats.todaySales}</p>
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
                <p className="text-2xl font-bold mt-1">{quickStats.lowStockItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-secondary/10 p-3 rounded-lg">
                <Building2 className="text-secondary" size={24} />
              </div>
              <div>
                <h3 className="text-base-content/60 text-base font-medium">Active Suppliers</h3>
                <p className="text-2xl font-bold mt-1">{quickStats.activeSuppliers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities - Takes 2 columns */}
          <div className="lg:col-span-2 bg-base-100 rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Activities</h2>
              <button className="btn btn-ghost btn-sm gap-2">
                View All <ArrowRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 bg-base-200 rounded-lg">
                  <div className="mt-1">
                    {activity.type === 'order' && <ClipboardList className="text-primary" size={20} />}
                    {activity.type === 'stock' && <AlertTriangle className="text-error" size={20} />}
                    {activity.type === 'supplier' && <Building2 className="text-secondary" size={20} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.message}</p>
                    <p className="text-sm text-base-content/60">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks - Takes 1 column */}
          <div className="bg-base-100 rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Upcoming Tasks</h2>
              <button className="btn btn-ghost btn-sm gap-2">
                View All <ArrowRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-primary" size={20} />
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-base-content/60">Due: {task.due}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-base-content/40" size={20} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployeeHome = () => {
  const { medicines } = useSelector((state) => state.medicines);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const [quickStats, setQuickStats] = useState({
    pendingOrders: 0,
    todaySales: 0,
    lowStockItems: 0,
    tasksAssigned: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [myTasks, setMyTasks] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (!medicines) {
      setLoading(false);
      return;
    }

    // Calculate quick stats
    const lowStock = medicines.filter(
      (med) => med.quantity <= med.alert_threshold
    );

    setQuickStats({
      pendingOrders: 3, // TODO: Replace with actual data
      todaySales: 8, // TODO: Replace with actual data
      lowStockItems: lowStock.length,
      tasksAssigned: 4, // TODO: Replace with actual data
    });

    // TODO: Replace with actual data
    setRecentActivities([
      { id: 1, type: 'sale', message: 'Completed sale #5678', time: '10 minutes ago' },
      { id: 2, type: 'stock', message: 'Updated stock for Aspirin', time: '1 hour ago' },
      { id: 3, type: 'task', message: 'Completed inventory check', time: '2 hours ago' },
    ]);

    setMyTasks([
      { id: 1, title: 'Process morning orders', due: 'Today' },
      { id: 2, title: 'Update shelf labels', due: 'Tomorrow' },
      { id: 3, title: 'Weekly stock count', due: 'Friday' },
    ]);

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

        {/* Welcome Section */}
        <div className="bg-base-100 rounded-xl shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to PharmaWise!</h1>
          <p className="text-base-content/60">Here's your overview for today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-base-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <ClipboardList className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="text-base-content/60 text-base font-medium">Pending Orders</h3>
                <p className="text-2xl font-bold mt-1">{quickStats.pendingOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-success/10 p-3 rounded-lg">
                <TrendingUp className="text-success" size={24} />
              </div>
              <div>
                <h3 className="text-base-content/60 text-base font-medium">Today's Sales</h3>
                <p className="text-2xl font-bold mt-1">{quickStats.todaySales}</p>
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
                <p className="text-2xl font-bold mt-1">{quickStats.lowStockItems}</p>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-secondary/10 p-3 rounded-lg">
                <Clock className="text-secondary" size={24} />
              </div>
              <div>
                <h3 className="text-base-content/60 text-base font-medium">Tasks Assigned</h3>
                <p className="text-2xl font-bold mt-1">{quickStats.tasksAssigned}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activities - Takes 2 columns */}
          <div className="lg:col-span-2 bg-base-100 rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Activities</h2>
              <button className="btn btn-ghost btn-sm gap-2">
                View All <ArrowRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 bg-base-200 rounded-lg">
                  <div className="mt-1">
                    {activity.type === 'sale' && <TrendingUp className="text-success" size={20} />}
                    {activity.type === 'stock' && <Package className="text-primary" size={20} />}
                    {activity.type === 'task' && <ClipboardList className="text-secondary" size={20} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.message}</p>
                    <p className="text-sm text-base-content/60">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Tasks - Takes 1 column */}
          <div className="bg-base-100 rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Tasks</h2>
              <button className="btn btn-ghost btn-sm gap-2">
                View All <ArrowRight size={16} />
              </button>
            </div>
            <div className="space-y-4">
              {myTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-base-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="text-primary" size={20} />
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-base-content/60">Due: {task.due}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-base-content/40" size={20} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PublicHome = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const [pharmacyInfo, setPharmacyInfo] = useState({
    name: "PharmaWise",
    address: "123 Healthcare Street, Medical District",
    phone: "+1 234 567 8900",
    email: "contact@pharmawise.com",
    openingHours: [
      { day: "Monday", hours: "8:00 AM - 8:00 PM" },
      { day: "Tuesday", hours: "8:00 AM - 8:00 PM" },
      { day: "Wednesday", hours: "8:00 AM - 8:00 PM" },
      { day: "Thursday", hours: "8:00 AM - 8:00 PM" },
      { day: "Friday", hours: "8:00 AM - 8:00 PM" },
      { day: "Saturday", hours: "9:00 AM - 6:00 PM" },
      { day: "Sunday", hours: "10:00 AM - 4:00 PM" },
    ]
  });

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/public/medicines');
        setMedicines(response.data.data);
      } catch (error) {
        messageApi.error('Failed to fetch medicines data');
        console.error('Error fetching medicines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [messageApi]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `$${price.toFixed(2)}`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
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

        {/* Welcome Section */}
        <div className="bg-base-100 rounded-xl shadow-md p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to {pharmacyInfo.name}</h1>
          <p className="text-base-content/60">Your trusted pharmacy</p>
        </div>

        {/* Available Medicines - Moved up */}
        <div className="bg-base-100 rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Available Medicines</h2>
          </div>
          <Table 
            dataSource={medicines} 
            columns={columns} 
            rowKey="id"
            pagination={{ pageSize: 10 }}
            className="bg-base-100"
          />
        </div>

        {/* Contact Information - Moved down */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-base-100 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-primary" size={20} />
                <p>{pharmacyInfo.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-primary" size={20} />
                <p>{pharmacyInfo.phone}</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-primary" size={20} />
                <p>{pharmacyInfo.email}</p>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="bg-base-100 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Opening Hours</h2>
            <div className="space-y-3">
              {pharmacyInfo.openingHours.map((schedule, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="font-medium">{schedule.day}</span>
                  <span className="text-base-content/60">{schedule.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { user } = useSelector((state) => state.auth);
  
  if (!user) {
    return <PublicHome />;
  }
  
  return user.role === "admin" ? <AdminHome /> : <EmployeeHome />;
};

export default HomePage; 