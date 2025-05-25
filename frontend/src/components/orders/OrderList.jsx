import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, message } from "antd";
import { Plus, Loader2 } from "lucide-react";
import Fuse from "fuse.js";

import Orders from "../../assets/api/Orders";
import { fetchInitialData } from "../Redux/fetchData";
import { addOrder } from "../Redux/slices/OrderSlice";

export default function OrderList() {
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const ordersState = useSelector((state) => state.orders);
  const providersState = useSelector((state) => state.providers);
  const medicineState = useSelector((state) => state.medicines);

  const user = authState?.user || null;
  const orders = ordersState?.orders || [];
  const providers = providersState?.providers || [];
  const medicines = medicineState?.medicines || [];

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [pageSize, setPageSize] = useState(window.innerWidth <= 768 ? 8 : 6);

  const [newOrder, setNewOrder] = useState({
    provider_id: "",
    medicine_id: "",
    quantity: 1,
  });

  const fuse = new Fuse(orders, {
    keys: ["provider_name", "medicine_name"],
    threshold: 0.3,
  });

  const filteredOrders = query
    ? fuse.search(query).map((result) => result.item)
    : orders;

  useEffect(() => {
    const fetchData = async () => {
      if (!orders.length || !providers.length || !medicines.length) {
        await fetchInitialData(dispatch, user);
      }
      setLoading(false);
    };
    fetchData();
  }, [dispatch, user, orders.length, providers.length, medicines.length]);

  // ✅ DEBUG : Voir les commandes dans la console
  useEffect(() => {
    console.log("Orders depuis Redux :", orders);
  }, [orders]);

  const handleAddOrder = async () => {
    if (!newOrder.provider_id || !newOrder.medicine_id || newOrder.quantity < 1) {
      messageApi.error("Please fill in all fields correctly.");
      return;
    }

    try {
      const response = await Orders.Create(newOrder);

      if (response.success) {
        const provider = providers.find(p => p.id == newOrder.provider_id);
        const medicine = medicines.find(m => m.id == newOrder.medicine_id);

        const enrichedOrder = {
          ...response.data,
          provider_name: provider?.name || "",
          medicine_name: medicine?.name || "",
        };

        dispatch(addOrder(enrichedOrder));
        messageApi.success("Order added successfully");
        setAdding(false);
        setNewOrder({ provider_id: "", medicine_id: "", quantity: 1 });
      } else {
        messageApi.error(response.message);
      }
    } catch {
      messageApi.error("Error adding order");
    }
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Provider",
      key: "provider",
      align: "center",
      render: (record) =>
        record.provider_name || `ID: ${record.provider_id}`,
    },
    {
      title: "Medicine",
      key: "medicine",
      align: "center",
      render: (record) =>
        record.medicine_name || `ID: ${record.medicine_id}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
  ];

  return (
    <div className="rounded-xl p-4">
      {contextHolder}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Orders Management</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setAdding(true)}>
          <Plus size={16} /> Add Order
        </button>
      </div>

      <div className="flex mb-4">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Search by product or provider"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredOrders}
        loading={{
          spinning: loading,
          indicator: <Loader2 className="h-8 w-8 animate-spin text-primary" />,
        }}
        pagination={{
          pageSize,
          pageSizeOptions: [6, 12, 24],
          showSizeChanger: true,
          onShowSizeChange: (_, size) => setPageSize(size),
        }}
      />

      {adding && (
        <div className="mt-6 border p-4 rounded-xl bg-base-100">
          <h3 className="text-lg font-semibold mb-4">Add New Order</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              className="select select-bordered"
              value={newOrder.provider_id}
              onChange={(e) =>
                setNewOrder({ ...newOrder, provider_id: e.target.value })
              }
            >
              <option value="">Select Provider</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <select
              className="select select-bordered"
              value={newOrder.medicine_id}
              onChange={(e) =>
                setNewOrder({ ...newOrder, medicine_id: e.target.value })
              }
            >
              <option value="">Select Medicine</option>
              {medicines.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              className="input input-bordered"
              placeholder="Quantity"
              value={newOrder.quantity}
              onChange={(e) =>
                setNewOrder({ ...newOrder, quantity: Number(e.target.value) })
              }
            />
          </div>
          <div className="mt-4 flex gap-4">
            <button className="btn btn-success" onClick={handleAddOrder}>
              Save
            </button>
            <button className="btn btn-secondary" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
