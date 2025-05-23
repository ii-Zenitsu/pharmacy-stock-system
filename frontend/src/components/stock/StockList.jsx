import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// Import actions and API class as needed
// import { setStockItems, updateStockItem } from "../Redux/slices/StockSlice";
// import Stocks from "../../assets/api/Stocks";
import { Table, Spin, message, Popconfirm, Button } from "antd";
import { Eye, Edit, Plus, Loader2, Filter } from "lucide-react"; // Example icons

export default function StockList() {
  const dispatch = useDispatch();
  // const { stockItems, loading, error } = useSelector((state) => state.stock); // Assuming 'stock' is the slice name
  const [selectedStockItem, setSelectedStockItem] = useState(null);
  const [editing, setEditing] = useState(false); // For editing stock quantity, perhaps
  const [adding, setAdding] = useState(false); // For adding new stock item or adjustment
  const [query, setQuery] = useState(""); // For search/filter
  const [messageApi, contextHolder] = message.useMessage();

  // Placeholder data
  const stockItems = []; // Replace with actual data from Redux store
  const loading = false; // Replace with actual loading state

  useEffect(() => {
    // Fetch stock items when component mounts
    // Example: dispatch(fetchStockItemsAction());
  }, [dispatch]);

  const handleAdjustStock = async (values) => {
    messageApi.info("Adjusting stock...");
    // Implement stock adjustment logic
  };

  const showStockDetails = (record) => {
    setSelectedStockItem(record);
    setEditing(false);
  };

  const goBack = () => {
    setSelectedStockItem(null);
    setEditing(false);
    setAdding(false);
  };
  
  // Columns will depend on what data 'Stock' represents.
  // This is an example assuming stock is medicine quantity per location.
  const columns = [
    { title: "Medicine Name", dataIndex: ["medicine", "name"], key: "medicine_name", align: "center" }, // Assuming nested data
    { title: "Location Name", dataIndex: ["location", "name"], key: "location_name", align: "center" }, // Assuming nested data
    { title: "Quantity", dataIndex: "quantity", key: "quantity", align: "center" },
    { title: "Last Updated", dataIndex: "last_updated", key: "last_updated", align: "center" },
    // Actions like 'Adjust Stock' or 'View History' could be here
    {
      title: "Actions",
      key: "actions",
      align: "center",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <button className="btn btn-soft btn-primary btn-sm" onClick={() => showStockDetails(record)}>
            <Eye size={16} />
          </button>
          <button className="btn btn-soft btn-warning btn-sm" onClick={() => { setSelectedStockItem(record); setEditing(true); /* Potentially for adjustment */ }}>
            <Edit size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="border-sh rounded-xl overflow-hidden mx-1 md:mx-4 h-fit my-4 ">
      {contextHolder}
      <div className="flex flex-wrap justify-between items-center gap-6 my-4 px-3">
        <h1 className="text-2xl font-bold pb-2">Stock Management</h1>
        {/* Button for global stock actions like 'New Stock Entry' or 'Run Inventory Check' */}
        <button className="btn btn-primary btn-sm" onClick={() => { setAdding(true); setSelectedStockItem({}); /* For new stock adjustment form */ }}>
          <Plus size={16} /> Adjust Stock
        </button>
      </div>
      {/* Filters for medicine, location, etc. can be added here */}
      <div className="my-4">
        <Table
          columns={columns}
          dataSource={stockItems} // Use filtered items if search/filter is implemented
          scroll={{ x: "max-content" }}
          rowKey={(record) => `${record.medicine_id}-${record.location_id}`} // Example composite key
          loading={{
            indicator: <Spin indicator={<Loader2 className="h-8 w-8 animate-spin text-primary" />} />,
            spinning: loading,
          }}
          pagination={{ pageSize: 10, className: "m-2", position: ["topCenter"] }}
        />
      </div>

      {/* Modal/Drawer for Adding/Editing Stock (e.g., Stock Adjustment Form) */}
      {(adding || (selectedStockItem && editing)) && (
        <aside className="fixed top-16 z-[6] left-0 w-full h-full bg-base-100 shadow-lg p-4 transform transition-transform duration-300 translate-x-0">
          <div className="flex flex-col max-w-2xl bg-base-200 w-full gap-4 mx-auto mt-16 shadow-2xl p-6 rounded-2xl">
            <h2 className="text-xl font-bold">{adding ? "New Stock Adjustment" : "Edit Stock Quantity"}</h2>
            {/* Form fields for stock adjustment: medicine, location, quantity change, reason */}
            <p>Stock adjustment form fields go here...</p>
            <p>Selected Item: {selectedStockItem?.medicine?.name} at {selectedStockItem?.location?.name}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-secondary btn-sm" onClick={goBack}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={() => handleAdjustStock(selectedStockItem)}>
                {adding ? "Submit Adjustment" : "Save Changes"}
              </button>
            </div>
          </div>
        </aside>
      )}
      
      {/* Drawer for Viewing Stock Item Details (if more details than table row) */}
      {selectedStockItem && !editing && !adding && (
         <aside className="fixed top-16 z-[6] left-0 w-full h-full bg-base-100 shadow-lg p-4 transform transition-transform duration-300 translate-x-0">
          <div className="flex flex-col max-w-2xl bg-base-200 w-full gap-4 mx-auto mt-16 shadow-2xl p-6 rounded-2xl">
            <div className="flex justify-between items-center">
                <button className="btn btn-secondary btn-sm" onClick={goBack} >
                  Back
                </button>
                {/* Further actions for a selected stock item */}
            </div>
            <div className="flex flex-col w-full gap-6 mt-4">
              <p><strong>Medicine:</strong> {selectedStockItem.medicine?.name}</p>
              <p><strong>Location:</strong> {selectedStockItem.location?.name}</p>
              <p><strong>Current Quantity:</strong> {selectedStockItem.quantity}</p>
              {/* Display other stock item details, history, etc. */}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
