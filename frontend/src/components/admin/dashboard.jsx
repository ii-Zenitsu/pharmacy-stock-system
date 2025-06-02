import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Statistic, Row, Col, List, Avatar, Tag, Progress, Spin, Table } from "antd";
import { 
  Users, 
  Package, 
  ShoppingCart, 
  Bell, 
  MapPin, 
  Truck, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Calendar
} from "lucide-react";
import { fetchInitialData } from "../Redux/fetchData";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.users);
  const { orders } = useSelector((state) => state.orders);
  const { medicines } = useSelector((state) => state.medicines);
  const { stockItems } = useSelector((state) => state.stock);
  const { providers } = useSelector((state) => state.providers);
  const { locations } = useSelector((state) => state.locations);
  const { notifications } = useSelector((state) => state.notifications);
  const { activityLogs } = useSelector((state) => state.activityLogs);
  const { loading } = useSelector((state) => state.loading);

  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalMedicines: 0,
    totalStock: 0,
    totalProviders: 0,
    totalLocations: 0,
    unreadNotifications: 0,
    lowStockItems: 0,
    expiringSoonItems: 0,
    expiredItems: 0,
    recentOrders: 0,
    activeUsers: 0
  });

  useEffect(() => {
    if (!loading && (!users.length || !orders.length)) {
      fetchInitialData(dispatch, user);
    }
  }, []);

  useEffect(() => {
    if (users.length || orders.length || medicines.length) {
      calculateStats();
    }
  }, [users, orders, medicines, stockItems, providers, locations, notifications]);

  const calculateStats = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    // Calculate low stock items (quantity < 10)
    const lowStock = stockItems.filter(item => item.quantity < 10);

    // Calculate expiring soon items (expiring within 14 days)
    const expiringSoon = stockItems.filter(item => {
      if (!item.expiration_date) return false;
      const expirationDate = new Date(item.expiration_date);
      return expirationDate >= now && expirationDate <= fourteenDaysFromNow && item.quantity > 0;
    });

    // Calculate expired items (expired and still have quantity)
    const expired = stockItems.filter(item => {
      if (!item.expiration_date) return false;
      const expirationDate = new Date(item.expiration_date);
      return expirationDate < now && item.quantity > 0;
    });

    // Calculate recent orders (last 7 days)
    const recentOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= weekAgo;
    });

    // Calculate active users (users who logged in recently or have recent activity)
    const activeUsers = users.filter(user => user.email_verified_at);

    // Calculate unread notifications
    const unreadNotifs = notifications.filter(notif => !notif.read_at);

    setDashboardStats({
      totalUsers: users.length,
      totalOrders: orders.length,
      totalMedicines: medicines.length,
      totalStock: stockItems.length,
      totalProviders: providers.length,
      totalLocations: locations.length,
      unreadNotifications: unreadNotifs.length,
      lowStockItems: lowStock.length,
      expiringSoonItems: expiringSoon.length,
      expiredItems: expired.length,
      recentOrders: recentOrders.length,
      activeUsers: activeUsers.length
    });
  };

  const getRecentActivities = () => {
    return activityLogs
      .slice(0, 5)
      .map(log => ({
        ...log,
        avatar: getActivityIcon(log.action),
        color: getActivityColor(log.action)
      }));
  };

  const getActivityIcon = (action) => {
    if (action.includes('user')) return <Users size={16} />;
    if (action.includes('medicine')) return <Package size={16} />;
    if (action.includes('order')) return <ShoppingCart size={16} />;
    if (action.includes('stock')) return <Package size={16} />;
    if (action.includes('provider')) return <Truck size={16} />;
    if (action.includes('location')) return <MapPin size={16} />;
    return <Activity size={16} />;
  };

  const getActivityColor = (action) => {
    if (action.includes('created')) return 'green';
    if (action.includes('updated')) return 'orange';
    if (action.includes('deleted')) return 'red';
    if (action.includes('login')) return 'blue';
    return 'default';
  };

  const getStockHealthPercentage = () => {
    if (stockItems.length === 0) return 0;
    const healthyItems = stockItems.length - dashboardStats.lowStockItems;
    return Math.round((healthyItems / stockItems.length) * 100);
  };

  const getOrderStatusDistribution = () => {
    const statusCount = orders.reduce((acc, order) => {
      acc[order.status || 'pending'] = (acc[order.status || 'pending'] || 0) + 1;
      return acc;
    }, {});
    return statusCount;
  };

  const getLowStockItems = () => {
    return stockItems
      .filter(item => item.quantity < 10)
      .slice(0, 5);
  };

  const getExpiringSoonItems = () => {
    const now = new Date();
    const fourteenDaysFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    return stockItems
      .filter(item => {
        if (!item.expiration_date) return false;
        const expirationDate = new Date(item.expiration_date);
        return expirationDate >= now && expirationDate <= fourteenDaysFromNow && item.quantity > 0;
      })
      .sort((a, b) => new Date(a.expiration_date) - new Date(b.expiration_date))
      .slice(0, 5);
  };

  const getExpiredItems = () => {
    const now = new Date();
    
    return stockItems
      .filter(item => {
        if (!item.expiration_date) return false;
        const expirationDate = new Date(item.expiration_date);
        return expirationDate < now && item.quantity > 0;
      })
      .sort((a, b) => new Date(b.expiration_date) - new Date(a.expiration_date))
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  const stockHealth = getStockHealthPercentage();
  const recentActivities = getRecentActivities();
  const lowStockItems = getLowStockItems();
  const expiringSoonItems = getExpiringSoonItems();
  const expiredItems = getExpiredItems();

  const lowStockColumns = [
    {
      title: "Medicine",
      dataIndex: "medicine",
      key: "medicine",
      render: (medicine) => medicine?.name || "N/A",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location", 
      render: (location) => location?.name || "N/A",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => <Tag color="red">{quantity} units</Tag>,
    },
  ];

  const expiringSoonColumns = [
    {
      title: "Medicine",
      dataIndex: "medicine",
      key: "medicine",
      render: (medicine) => medicine?.name || "N/A",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (location) => location?.name || "N/A",
    },
    {
      title: "Expires In",
      dataIndex: "expiration_date",
      key: "expires_in",
      render: (date) => {
        if (!date) return "N/A";
        const now = new Date();
        const expirationDate = new Date(date);
        const diffTime = expirationDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return <Tag color="orange">{diffDays} days</Tag>;
      },
    },
  ];

  const expiredColumns = [
    {
      title: "Medicine",
      dataIndex: "medicine",
      key: "medicine",
      render: (medicine) => medicine?.name || "N/A",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (location) => location?.name || "N/A",
    },
    {
      title: "Expired",
      dataIndex: "expiration_date",
      key: "expired_date",
      render: (date) => {
        if (!date) return "N/A";
        const now = new Date();
        const expirationDate = new Date(date);
        const diffTime = now - expirationDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return <Tag color="red">{diffDays} days ago</Tag>;
      },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.first_name}!</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium">{new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* Main Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={dashboardStats.totalUsers}
              prefix={<Users className="text-blue-500" size={20} />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={<div>Orders <Tag color="blue" size="small">this week</Tag></div>}
              value={dashboardStats.totalOrders}
              prefix={<ShoppingCart className="text-purple-500" size={20} />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Medicines"
              value={dashboardStats.totalMedicines}
              prefix={<Package className="text-green-500" size={20} />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title={<div>Low Stock Items {dashboardStats.lowStockItems > 0 && <Tag color="red" size="small">needs attention</Tag>}</div>}
              value={dashboardStats.lowStockItems}
              prefix={<AlertTriangle className="text-red-500" size={20} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Secondary Statistics */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title={<div>Expiring Soon <Tag color="orange" size="small">in 14 days</Tag></div>}
              value={dashboardStats.expiringSoonItems}
              prefix={<Calendar className="text-orange-500" size={20} />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={8} lg={6}>
          <Card>
            <Statistic
              title={<div>Expired Items {dashboardStats.expiredItems > 0 && <Tag color="red" size="small">urgent</Tag>}</div>}
              value={dashboardStats.expiredItems}
              prefix={<AlertTriangle className="text-red-500" size={20} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts and Progress */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Stock Health" extra={<Package size={16} />}>
            <div className="space-y-4">
              <Progress
                percent={stockHealth}
                status={stockHealth > 80 ? "success" : stockHealth > 60 ? "normal" : "exception"}
                strokeColor={stockHealth > 80 ? "#52c41a" : stockHealth > 60 ? "#1890ff" : "#ff4d4f"}
              />
              <div className="flex justify-between text-sm">
                <span>Healthy Stock: {stockItems.length - dashboardStats.lowStockItems}</span>
                <span className="text-red-500">Low Stock: {dashboardStats.lowStockItems}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-orange-500">Expiring Soon: {dashboardStats.expiringSoonItems}</span>
                <span className="text-red-600">Expired: {dashboardStats.expiredItems}</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Recent Activity" extra={<Activity size={16} />}>
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(activity) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar size="small" style={{ backgroundColor: '#f56a00' }}>
                        {activity.avatar}
                      </Avatar>
                    }
                    title={
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{activity.user_name || 'System'}</span>
                        <Tag color={activity.color} size="small">
                          {activity.action.replace('_', ' ')}
                        </Tag>
                      </div>
                    }
                    description={
                      <div className="text-xs text-gray-500">
                        <div>{activity.description}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock size={12} />
                          {new Date(activity.created_at).toLocaleString()}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
              locale={{ emptyText: "No recent activity" }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Low Stock Items" extra={<AlertTriangle size={16} />}>
            {lowStockItems.length > 0 ? (
              <Table
                dataSource={lowStockItems}
                columns={lowStockColumns}
                rowKey="id"
                pagination={false}
                size="small"
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="mx-auto mb-2 opacity-50" size={32} />
                <p className="text-sm">All stock levels are healthy!</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Stock Alerts */}
      <Row gutter={[16, 16]}>

        <Col xs={24} lg={12}>
          <Card title="Expiring Soon" extra={<Calendar size={16} />}>
            {expiringSoonItems.length > 0 ? (
              <Table
                dataSource={expiringSoonItems}
                columns={expiringSoonColumns}
                rowKey="id"
                pagination={false}
                size="small"
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="mx-auto mb-2 opacity-50" size={32} />
                <p className="text-sm">No items expiring soon!</p>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Expired Items" extra={<AlertTriangle className="text-red-500" size={16} />}>
            {expiredItems.length > 0 ? (
              <Table
                dataSource={expiredItems}
                columns={expiredColumns}
                rowKey="id"
                pagination={false}
                size="small"
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="mx-auto mb-2 opacity-50" size={32} />
                <p className="text-sm">No expired items!</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}