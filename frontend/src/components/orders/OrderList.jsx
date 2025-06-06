import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Orders from "../../assets/api/Orders";
import { fetchInitialData } from "../Redux/fetchData";
import { addOrder } from "../Redux/slices/OrderSlice";

import { message, Popconfirm, Table, Spin } from "antd";
import { CircleHelp, Pencil, Trash2, Loader2, ArrowLeft, ArrowRight, X, Check, Plus, Info, TriangleAlert, User, Package, SendHorizonal } from "lucide-react";
import Fuse from "fuse.js";
import { TextInput, SelectInput, SearchSelectInput } from "../UI/MyInputs";
import { setLoading } from "../Redux/slices/LoadingSlice";

export default function OrderList() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders } = useSelector((state) => state.orders);
  const { providers } = useSelector((state) => state.providers);
  const { loading } = useSelector((state) => state.loading);
  const [order, setOrder] = useState(null);
  const [adding, setAdding] = useState(false);
  const [newOrder, setNewOrder] = useState({ provider_id: "", medicine_id: "", quantity: 1 });
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [errors, setErrors] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [pageSize, setPageSize] = useState(window.innerWidth <= 768 ? 8 : 6);

  const [query, setQuery] = useState("");
  const ordersFuse = new Fuse(orders, { 
    keys: ["medicine.name", "provider.name", "quantity"], 
    threshold: 0.3 
  });
  const items = query ? ordersFuse.search(query).map((r) => r.item) : orders;

  useEffect(() => {
    if (order || adding) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [order, adding]);

 useEffect(() => {
     const fetchData = async () => {
     if (!loading && !orders.length) {
       await fetchInitialData(dispatch, user);
     }
     dispatch(setLoading(false));
   };
   fetchData();
   }, []);

  const handleCreateOrder = async (values) => {
    try {
      if (!values) return;
      
      const res = await Orders.Create(values);
      if (res.success) {
        dispatch(addOrder(res.data));
        messageApi.success("Order created successfully!");
        goBack();
      } else {
        messageApi.error(res.message);
        if (res.errors) {
          setErrors(res.errors);
        }
      }
    } catch (error) {
      messageApi.error("Failed to create order");
      console.error(error);
    }
  };

  const showOrder = (orderData) => {
    setOrder(orderData);
  };

  const goBack = () => {
    setOrder(null);
    setAdding(false);
    setNewOrder({ provider_id: "", medicine_id: "", quantity: 1 });
    setSelectedProvider(null);
    setAvailableMedicines([]);
    setErrors({});
  };

  const focusInput = (name) => {
    const input = document.querySelector(`input[name="${name}"]`);
    if (input) {
      input.focus();
    }
  };

  const handleProviderChange = (value) => {
    const provider = providers.find(p => p.id == value);
    setSelectedProvider(provider);
    setNewOrder(prev => ({ ...prev, provider_id: value, medicine_id: 0 }));
    setAvailableMedicines(provider?.medicines || []);
  };

  const columns = [
    {
      title: "Provider",
      key: "provider",
      align: "center",
      className: "capitalize",
      render: (_, record) => record.provider?.name || "N/A",
      sorter: (a, b) => (a.provider?.name || "").localeCompare(b.provider?.name || ""),
    },
    {
      title: "Medicine",
      key: "medicine",
      align: "center",
      className: "capitalize",
      render: (_, record) => record.medicine?.name || "N/A",
      sorter: (a, b) => (a.medicine?.name || "").localeCompare(b.medicine?.name || ""),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Order Date",
      key: "created_at",
      align: "center",
      render: (_, record) => new Date(record.created_at).toLocaleDateString(),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    {
      title: <div className="capitalize">Details</div>,
      key: "details",
      align: "center",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <button className="btn btn-soft btn-primary btn-sm" onClick={() => showOrder({ ...record })}>
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
          <h1 className="text-2xl font-bold pb-2">Orders Management</h1>
        </div>
      </div>
      <div className="flex justify-between gap-8 items-center mt-8">
        <label className="input input-primary input-sm">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            className="grow"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by provider, medicine, quantity"
          />
        </label>
        <button className="btn btn-primary btn-sm" onClick={() => {
          setOrder(null);
          setAdding(true);
        }}>
          <Plus size={16} /> New Order
        </button>
      </div>

      <div className="my-2">
        <Table
          // rowSelection={{fixed: true, columnWidth: 50}}
          columns={columns}
          dataSource={items}
          scroll={{ x: "max-content" }}
          rowKey="id"
          loading={{
            indicator: (
              <Spin
                indicator={
                  <span className="loading loading-bars loading-primary" />
                }
              />
            ),
            spinning: loading,
          }}
          pagination={{
            pageSize: pageSize,
            pageSizeOptions: [6, 12, 24, 50],
            className: "m-2",
            position: ["topCenter"],
            showSizeChanger: true,
            onShowSizeChange: (c, size) => {setPageSize(size);}
          }}
        />
      </div>
      
      {/* View Order Details Sidebar */}
      <div className={`fixed top-0 inset-0 z-[5] bg-black/50 transition-opacity duration-300 ease-in ${order ? "opacity-100 visible" : "opacity-0 invisible"}`} />
      <aside className={`fixed top-0 z-[6] left-0 w-full h-full overflow-y-auto bg-base-100 shadow-lg p-2 sm:p-6 transform transition-transform duration-300 ease-in ${order ? "translate-x-0" : "translate-x-full"}`}>
        {order && (
          <div className="flex flex-col bg-base-200 w-full h-full gap-4 mx-auto shadow-2xl p-2 sm:p-6 rounded-2xl">
            <div className="flex justify-between items-center">
              <button className="btn btn-secondary btn-sm" onClick={goBack}>
                <ArrowLeft size={16} /> Back
              </button>
            </div>
            <div className="flex flex-col gap-3 sm:gap-6 mt-4">
              <div className="flex gap-2 text-2xl items-center font-semibold"><Package /><span>Order Information</span></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  label="Order ID"
                  value={order.id}
                  disabled={true}
                  editing={false}
                />
                <TextInput
                  label="Provider"
                  value={order.provider?.name || console.log(order) || "N/A"}
                  disabled={true}
                  editing={false}
                  className="capitalize"
                />
                <TextInput
                  label="Medicine"
                  value={order.medicine?.name || "N/A"}
                  disabled={true}
                  editing={false}
                  className="capitalize"
                />
                <TextInput
                  label="Quantity"
                  value={order.quantity}
                  disabled={true}
                  editing={false}
                />
                <TextInput
                  label="Order Date"
                  value={new Date(order.created_at).toLocaleString()}
                  disabled={true}
                  editing={false}
                />
              </div>
              
              {order.medicine && (
                <>
                  <div className="flex gap-2 text-2xl items-center font-semibold mt-6"><Info /><span>Medicine Details</span></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput
                      label="Description"
                      value={order.medicine.description || "No description available"}
                      disabled={true}
                      editing={false}
                    />
                    <TextInput
                      label="Type"
                      value={order.medicine.type || "N/A"}
                      disabled={true}
                      editing={false}
                      className="capitalize"
                    />
                    <TextInput
                      label="Dosage"
                      value={order.medicine.dosage || "N/A"}
                      disabled={true}
                      editing={false}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </aside>
      
      {/* Add Order Sidebar */}
      <div className={`fixed top-0 inset-0 z-[5] bg-black/50 transition-opacity duration-300 ease-in ${adding ? "opacity-100 visible" : "opacity-0 invisible"}`} />
      <aside className={`fixed top-0 z-[6] left-0 w-full h-full overflow-y-auto bg-base-100 shadow-lg p-2 sm:p-6 transform transition-transform duration-300 ease-in ${adding ? "translate-x-0" : "translate-x-full"}`}>
        {adding && (
          <div className="flex flex-col bg-base-200 w-full h-full gap-4 mx-auto shadow-2xl p-2 sm:p-6 rounded-2xl">
            <div className="flex justify-between items-center">
              <button className="btn btn-secondary btn-sm" onClick={goBack}>
                <ArrowLeft size={16} /> Back
              </button>
            </div>
            <div className="flex flex-col gap-3 sm:gap-6 mt-4">
              {/* Error Display Area */}
              {errors && Object.keys(errors).length > 0 && (
                <div className="flex flex-col gap-1.5 mb-4">
                  {Object.entries(errors).map(([key, value]) => (
                    <div key={key} onClick={() => focusInput(key)} className="btn btn-error h-fit justify-start btn-xs font-semibold">
                      <TriangleAlert size={16} />
                      {Array.isArray(value) ? value[0] : value}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 text-2xl items-center font-semibold"><Package /><span>New Order Information</span></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SearchSelectInput
                  label="Provider"
                  value={Number(newOrder.provider_id)}
                  onChange={handleProviderChange}
                  editing={true}
                  className={errors?.provider_id ? "select-error border-2" : ""}
                  options={[
                    { value: 0, label: "Select a provider" },
                    ...providers.map(provider => ({ value: provider.id, label: provider.name}))
                  ]}
                  name="provider_id"
                />

                <SearchSelectInput
                  label="Medicine"
                  value={Number(newOrder.medicine_id)}
                  onChange={value => setNewOrder(prev => ({ ...prev, medicine_id: value }))}
                  editing={true}
                  disabled={!selectedProvider || availableMedicines.length === 0}
                  className={errors?.medicine_id ? "select-error border-2" : ""}
                  options={[
                    { 
                      value: 0, 
                      label: selectedProvider ? "Select a medicine" : "Select a provider first" 
                    },
                    ...availableMedicines.map(medicine => ({
                      value: medicine.id,
                      label: medicine.name
                    }))
                  ]}
                  name="medicine_id"
                />

                <TextInput
                  label="Quantity"
                  type="number"
                  value={newOrder.quantity}
                  onChange={e => setNewOrder(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  placeholder="Enter quantity"
                  name="quantity"
                  className={errors?.quantity ? "input-error border-2" : ""}
                  editing={true}
                  min={1}
                />
              </div>
              <div className="flex mt-2 justify-center sm:justify-end items-center">
                <Popconfirm
                  placement="bottomRight"
                  title="Send order?"
                  description="Are you sure you want to send this order?"
                  okText="Yes"
                  cancelText="No"
                  icon={<CircleHelp size={16} className="m-1" />}
                  onConfirm={() => handleCreateOrder(newOrder)}
                >
                  <button className="btn btn-primary">
                    Send Order <SendHorizonal size={18} />
                  </button>
                </Popconfirm>
              </div>

            </div>
          </div>
        )}
      </aside>
    </div>
  );
}