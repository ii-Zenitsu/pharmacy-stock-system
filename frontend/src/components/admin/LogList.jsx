import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Table, Spin, Tag, Tooltip } from "antd";
import { Eye, Clock, User, Activity, MapPin, RefreshCw, Search, ArrowLeft, ArrowRight } from "lucide-react";
import ActivityLogs from "../../assets/api/ActivityLogs";
import Fuse from "fuse.js";
import { setActivityLogs, setRecentLogs, setLoading } from "../Redux/slices/ActivityLogSlice";
import { fetchInitialData } from "../Redux/fetchData";
import { TextInput } from "../UI/MyInputs";

export default function LogList() {
  const dispatch = useDispatch();
  const { activityLogs, loading } = useSelector((state) => state.activityLogs);
  const { loading: globalLoading } = useSelector((state) => state.loading);
  const currentUser = useSelector((state) => state.auth.user);
  const [log, setLog] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [pageSize, setPageSize] = useState(window.innerWidth <= 768 ? 8 : 10);
  const [refreshing, setRefreshing] = useState(false);

  const [query, setQuery] = useState("");
  const logsFuse = new Fuse(activityLogs, { 
    keys: ["action", "description", "user_name", "ip_address"], 
    threshold: 0.3 
  });
  const items = query ? logsFuse.search(query).map(r => r.item) : activityLogs;

  useEffect(() => {
    const fetchData = async () => {
      if (!globalLoading && !activityLogs.length) {
        await fetchInitialData(dispatch, currentUser);
      }
    };
    fetchData();
  }, []);

  const refreshLogs = async () => {
    try {
      setRefreshing(true);
      const response = await ActivityLogs.GetAll();
      if (response.success) {
        dispatch(setActivityLogs(response.data));
        messageApi.success("Activity logs refreshed successfully");
      } else {
        messageApi.error(response.message);
      }
    } catch (error) {
      messageApi.error("Error refreshing activity logs");
    } finally {
      setRefreshing(false);
    }
  };

  const showLog = (logItem) => {
    setLog(logItem);
  };

  const goBack = () => {
    setLog(null);
  };

  const getActionColor = (action) => {
    const actionColors = {
      // Authentication
      user_login: "green",
      user_logout: "blue", 
      user_registered: "cyan",
      login_failed: "red",
      profile_updated: "orange",
      
      // CRUD Operations - Create
      medicine_created: "green",
      user_created: "green",
      order_created: "green",
      stock_created: "green",
      provider_created: "green",
      location_created: "green",
      notification_created: "green",
      
      // CRUD Operations - Update
      medicine_updated: "orange",
      user_updated: "orange",
      stock_updated: "orange",
      provider_updated: "orange",
      location_updated: "orange",
      notification_updated: "orange",
      
      // CRUD Operations - Delete
      medicine_deleted: "red",
      user_deleted: "red",
      stock_deleted: "red",
      provider_deleted: "red",
      location_deleted: "red",
      notification_deleted: "red",
      notifications_bulk_deleted: "red",
      
      // Sales & Transactions
      sale: "purple",
      stock_batch_adjusted: "gold",
      
      // View Operations
      medicine_viewed: "geekblue",
    };
    
    return actionColors[action] || "default";
  };

  const getActionIcon = (action) => {
    if (action.includes('login') || action.includes('logout') || action.includes('registered')) {
      return <User size={14} />;
    }
    if (action.includes('sale') || action.includes('batch_adjusted')) {
      return <Activity size={14} />;
    }
    if (action.includes('viewed')) {
      return <Eye size={14} />;
    }
    return <Activity size={14} />;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 minute
    if (diff < 60000) {
      return "Just now";
    }
    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    // Show full date
    return date.toLocaleString();
  };

  const columns = [
    {
      title: "Action",
      key: "action",
      align: "center",
      width: 160,
      render: (_, record) => (
        <Tag 
          color={getActionColor(record.action)} 
          icon={getActionIcon(record.action)}
          className="font-medium w-fit flex items-center justify-center gap-1"
        >
          {record.action.replace(/_/g, ' ').toUpperCase()}
        </Tag>
      ),
      sorter: (a, b) => a.action.localeCompare(b.action),
    },
    {
      title: "User",
      key: "user",
      align: "center",
      width: 200,
      render: (_, record) => (
        <div className="flex flex-col">
          <span className="font-medium">{record.user_name || "System"}</span>
          {record.ip_address && (
            <span className="text-xs text-gray-500">{record.ip_address}</span>
          )}
        </div>
      ),
      sorter: (a, b) => (a.user_name || "").localeCompare(b.user_name || ""),
    },
    {
      title: "Description",
      key: "description",
      align: "center",
      render: (_, record) => (
          <div className="max-w-xs truncate">
            {record.description}
          </div>
      ),
    },
    {
      title: "Time",
      key: "created_at",
      align: "center",
      width: 150,
      render: (_, record) => (
        <Tooltip title={new Date(record.created_at).toLocaleString()}>
          <div className="flex items-center gap-1 text-sm">
            <Clock size={14} />
            {formatTimestamp(record.created_at)}
          </div>
        </Tooltip>
      ),
      sorter: (a, b) => new Date(b.created_at) - new Date(a.created_at),
      defaultSortOrder: 'ascend',
    },
    {
      title: "Details",
      key: "details",
      align: "center",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <button 
          className="btn btn-soft btn-primary btn-sm" 
          onClick={() => showLog(record)}
        >
          <ArrowRight size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="border-sh rounded-xl overflow-hidden mx-1 md:mx-4 h-fit my-4">
      {contextHolder}
      
      <div className="flex flex-wrap justify-between items-center gap-6 my-4 px-3">
        <div className="flex gap-4">
          <h1 className="text-2xl font-bold pb-2">Activity Logs</h1>
        </div>
        
        <div className="flex gap-2 items-center">
          <button 
            className="btn btn-primary btn-sm gap-2"
            onClick={refreshLogs}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-3 mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search logs by action, user, or description..."
            className="input input-bordered w-full pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {globalLoading || loading ? (
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={items}
          columns={columns}
          rowKey="id"
          className="custom-table"
          size="middle"
          scroll={{ x: 800 }}
          pagination={{
            pageSize: pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `${range[0]}-${range[1]} of ${total} logs`,
            pageSizeOptions: ['8', '10', '20', '50'],
            onShowSizeChange: (current, size) => setPageSize(size),
          }}
        />
      )}

      {/* Log Details Modal */}
      <div className={`fixed top-0 inset-0 z-[5] bg-black/50 transition-opacity duration-300 ease-in ${log ? "opacity-100 visible" : "opacity-0 invisible"}`} />
      <aside className={`fixed top-0 z-[6] left-0 w-full h-full overflow-y-auto bg-base-100 shadow-lg p-2 sm:p-6 transform transition-transform duration-300 ease-in ${log ? "translate-x-0" : "translate-x-full"}`}>
        {log && (
  <div className="flex flex-col bg-base-200 w-full h-full gap-4 mx-auto shadow-2xl p-2 sm:p-6 rounded-2xl">
    <div className="flex justify-between items-center">
      <button className="btn btn-secondary btn-sm" onClick={goBack}>
        <ArrowLeft size={16} /> Back
      </button>
    </div>
    
    <div className="flex flex-col gap-3 sm:gap-6 mt-4">
      <div className="flex gap-2 text-2xl items-center font-semibold">
        <Activity />
        <span>Activity Log Details</span>
      </div>
      
      <Tag 
        color={getActionColor(log.action)} 
        icon={getActionIcon(log.action)}
        className="font-medium text-lg w-fit flex items-center justify-center gap-1"
      >
        {log.action.replace(/_/g, ' ').toUpperCase()}
      </Tag>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <TextInput
          label="User"
          value={log.user_name || "System"}
          editing={false}
          disabled={true}
        />
        
        <TextInput
          label="IP Address"
          value={log.ip_address || "N/A"}
          editing={false}
          disabled={true}
        />
        
        <TextInput
          label="Timestamp"
          value={new Date(log.created_at).toLocaleString()}
          editing={false}
          disabled={true}
        />
      </div>
      
        <textarea 
          className="textarea textarea-disabled w-full border-neutral bg-base-200 rounded-2xl" 
          rows="4"
          value={log.description}
          readOnly
        />
      
      {log.additional_data && (
        <div className="form-control">
          <label className="label font-semibold">Additional Data</label>
          <pre className="bg-base-100 p-4 rounded-lg text-sm overflow-auto border border-neutral/20 max-h-64">
            {JSON.stringify(JSON.parse(log.additional_data), null, 2)}
          </pre>
        </div>
      )}
    </div>
  </div>
)}
      </aside>
    </div>
  );
}
