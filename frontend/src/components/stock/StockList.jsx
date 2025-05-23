import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Input, Button, Modal, Form, InputNumber, Spin, message, Tag } from "antd";
import { SearchOutlined, EditOutlined, LoadingOutlined } from "@ant-design/icons";
import Fuse from "fuse.js";
import Stocks from "../../assets/api/Stocks"; // Assuming Stocks.AdjustBatchQuantity will be here
import { fetchInitialData } from "../Redux/fetchData";
import { setStockItems, updateStockItem } from "../Redux/slices/StockSlice"; // Assuming updateStockItem is correctly implemented

const StockList = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stockItems, loading: stockLoading } = useSelector((state) => state.stock);
  const { medicines } = useSelector((state) => state.medicines);
  const { locations } = useSelector((state) => state.locations);

  const [query, setQuery] = useState("");
  const [filteredStockItems, setFilteredStockItems] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(10);
  const [componentLoading, setComponentLoading] = useState(true);
  const [adjustLoading, setAdjustLoading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const loadData = async () => {
      setComponentLoading(true);
      if (!stockItems || stockItems.length === 0) {
        // Ensure fetchInitialData populates stockItems, medicines, and locations
        await fetchInitialData(dispatch, user);
      }
      setComponentLoading(false);
    };
    loadData();
  }, [dispatch, user, stockItems?.length]);

  useEffect(() => {
    if (stockItems) {
        // Enrich stock items with medicine and location names if not already present
        // This assumes stockItems might only have medicine_id and location_id
        // Ideally, the API returns fully populated objects.
        const enrichedItems = stockItems.map(item => {
            const medicine = medicines?.find(m => m.id === item.medicine_id);
            const location = locations?.find(l => l.id === item.location_id);
            return {
                ...item,
                medicine_name: medicine ? medicine.name : `ID: ${item.medicine_id}`,
                location_name: location ? location.name : `ID: ${item.location_id}`,
            };
        });

        if (query) {
            const fuse = new Fuse(enrichedItems, {
                keys: ["medicine_name", "location_name", "expiration_date"],
                threshold: 0.3,
            });
            setFilteredStockItems(fuse.search(query).map(result => result.item));
        } else {
            setFilteredStockItems(enrichedItems);
        }
    }
  }, [query, stockItems, medicines, locations]);


  const handleOpenModal = (record) => {
    setCurrentItem(record);
    form.setFieldsValue({
      quantity: record.quantity,
      reason: "",
    });
    setIsModalVisible(true);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
    setCurrentItem(null);
    form.resetFields();
    setAdjustLoading(false);
  };

  const handleAdjustStock = async (values) => {
    if (!currentItem) return;
    setAdjustLoading(true);
    try {
      // Assuming an API method like AdjustBatchQuantity(batchId, newQuantity, reason)
      // batchId is currentItem.id (the ID from medicine_location table)
      const response = await Stocks.AdjustBatchQuantity(currentItem.id, values.quantity, values.reason);

      if (response.success && response.data) {
        dispatch(updateStockItem(response.data)); // response.data should be the updated stock item/batch
        messageApi.success("Stock adjusted successfully!");
        handleCancelModal();
      } else {
        messageApi.error(response.message || "Failed to adjust stock.");
      }
    } catch (error) {
      console.error("Adjust stock error:", error);
      messageApi.error(error.response?.data?.message || "An error occurred while adjusting stock.");
    } finally {
      setAdjustLoading(false);
    }
  };
  
  const getTagColor = (dateString) => {
    if (!dateString) return 'default';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expirationDate = new Date(dateString);
    expirationDate.setHours(0, 0, 0, 0);

    const diffTime = expirationDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'red'; // Expired
    if (diffDays <= 30) return 'orange'; // Expires in <= 30 days
    if (diffDays <= 90) return 'gold'; // Expires in <= 90 days
    return 'green'; // Expires in > 90 days
  };


  const columns = [
    {
      title: "Medicine Name",
      dataIndex: "medicine_name",
      key: "medicine_name",
      sorter: (a, b) => a.medicine_name.localeCompare(b.medicine_name),
    },
    {
      title: "Location Name",
      dataIndex: "location_name",
      key: "location_name",
      sorter: (a, b) => a.location_name.localeCompare(b.location_name),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
      align: 'right',
    },
    {
      title: "Expiration Date",
      dataIndex: "expiration_date",
      key: "expiration_date",
      render: (text) => <Tag color={getTagColor(text)}>{text || 'N/A'}</Tag>,
      sorter: (a, b) => new Date(a.expiration_date) - new Date(b.expiration_date),
    },
    {
      title: "Actions",
      key: "actions",
      align: 'center',
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => handleOpenModal(record)}
          type="link"
        >
          Adjust
        </Button>
      ),
    },
  ];

  if (componentLoading || stockLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      {contextHolder}
      <Input
        placeholder="Search by Medicine, Location, Expiration Date..."
        prefix={<SearchOutlined />}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: "20px", maxWidth: "400px" }}
      />
      <Table
        columns={columns}
        dataSource={filteredStockItems}
        rowKey="id" // Assuming 'id' is the unique ID for each stock batch (medicine_location.id)
        loading={componentLoading || stockLoading}
        pagination={{ 
            pageSize: pageSize, 
            showSizeChanger: true, 
            pageSizeOptions: ['10', '20', '50', '100'],
            onShowSizeChange: (current, size) => setPageSize(size),
            className: "m-2",
            position: ["topCenter", "bottomCenter"],
        }}
        scroll={{ x: "max-content" }}
      />
      {currentItem && (
        <Modal
          title={`Adjust Stock for ${currentItem.medicine_name} at ${currentItem.location_name}`}
          open={isModalVisible}
          onCancel={handleCancelModal}
          confirmLoading={adjustLoading}
          footer={[
            <Button key="back" onClick={handleCancelModal} disabled={adjustLoading}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" loading={adjustLoading} onClick={() => form.submit()}>
              Adjust Stock
            </Button>,
          ]}
        >
          <Form form={form} layout="vertical" onFinish={handleAdjustStock}>
            <p><strong>Current Quantity:</strong> {currentItem.quantity}</p>
            <p><strong>Expiration Date:</strong> {currentItem.expiration_date}</p>
            <Form.Item
              name="quantity"
              label="New Quantity"
              rules={[{ required: true, message: "Please input the new quantity!" }, { type: 'number', min: 0, message: "Quantity cannot be negative." }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item
              name="reason"
              label="Reason for Adjustment"
              rules={[{ required: true, message: "Please provide a reason for this adjustment!" }]}
            >
              <Input.TextArea rows={3} placeholder="e.g., Cycle count correction, Damaged goods, Stock received" />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default StockList;