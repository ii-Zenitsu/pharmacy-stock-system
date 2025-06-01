import React, { useState, useEffect } from "react";
import { Table, DatePicker, Input, Select, Spin, message } from "antd";
import { Search, Filter, Download, RefreshCw } from "lucide-react";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const LogsPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [logType, setLogType] = useState("all");

  // Mock data - Replace with actual API call
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual API call
        const mockLogs = [
          {
            id: 1,
            timestamp: "2024-03-20 10:30:00",
            type: "user_action",
            action: "login",
            user: "admin@example.com",
            details: "User logged in successfully",
            ip_address: "192.168.1.1",
          },
          {
            id: 2,
            timestamp: "2024-03-20 10:35:00",
            type: "system",
            action: "medicine_update",
            user: "admin@example.com",
            details: "Updated medicine stock: Paracetamol",
            ip_address: "192.168.1.1",
          },
          {
            id: 3,
            timestamp: "2024-03-20 10:40:00",
            type: "error",
            action: "api_error",
            user: "system",
            details: "Failed to connect to payment gateway",
            ip_address: "192.168.1.1",
          },
        ];
        setLogs(mockLogs);
        setFilteredLogs(mockLogs);
      } catch (error) {
        messageApi.error("Failed to fetch logs");
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
      render: (text) => dayjs(text).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        { text: "User Action", value: "user_action" },
        { text: "System", value: "system" },
        { text: "Error", value: "error" },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            type === "error"
              ? "bg-red-100 text-red-800"
              : type === "user_action"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {type.replace("_", " ").toUpperCase()}
        </span>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text) => text.replace("_", " ").toUpperCase(),
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      ellipsis: true,
    },
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
    filterLogs(value, dateRange, logType);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    filterLogs(searchText, dates, logType);
  };

  const handleLogTypeChange = (value) => {
    setLogType(value);
    filterLogs(searchText, dateRange, value);
  };

  const filterLogs = (search, dates, type) => {
    let filtered = [...logs];

    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        (log) =>
          log.details.toLowerCase().includes(search.toLowerCase()) ||
          log.user.toLowerCase().includes(search.toLowerCase()) ||
          log.action.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply date range filter
    if (dates && dates[0] && dates[1]) {
      filtered = filtered.filter(
        (log) =>
          dayjs(log.timestamp).isAfter(dates[0]) &&
          dayjs(log.timestamp).isBefore(dates[1])
      );
    }

    // Apply type filter
    if (type && type !== "all") {
      filtered = filtered.filter((log) => log.type === type);
    }

    setFilteredLogs(filtered);
  };

  const handleRefresh = () => {
    // TODO: Implement actual refresh logic
    messageApi.success("Logs refreshed");
  };

  const handleExport = () => {
    // TODO: Implement export logic
    messageApi.success("Logs exported successfully");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {contextHolder}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
          <p className="text-gray-600">Monitor and track system activities</p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <Input
                prefix={<Search className="text-gray-400" size={16} />}
                placeholder="Search logs..."
                onChange={(e) => handleSearch(e.target.value)}
                allowClear
              />
            </div>
            <div className="flex gap-4 flex-wrap">
              <RangePicker
                onChange={handleDateRangeChange}
                className="w-[300px]"
              />
              <Select
                defaultValue="all"
                style={{ width: 150 }}
                onChange={handleLogTypeChange}
                options={[
                  { value: "all", label: "All Types" },
                  { value: "user_action", label: "User Actions" },
                  { value: "system", label: "System" },
                  { value: "error", label: "Errors" },
                ]}
              />
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow-sm">
          <Table
            columns={columns}
            dataSource={filteredLogs}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} logs`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LogsPage; 