import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Stocks from "../../assets/api/Stocks";
import { fetchInitialData } from "../Redux/fetchData";
import { deleteStockItem, updateStockItem, addStockItem } from "../Redux/slices/StockSlice";

import { message, Popconfirm, Table, Spin, Select, Modal } from "antd";
import { CircleHelp, Pencil, Trash2, Loader2, ArrowLeft, ArrowRight, X, Check, Plus, Info, TriangleAlert, Package, ScanBarcode } from "lucide-react";
import Fuse from "fuse.js";
import { TextInput, SelectInput, SearchSelectInput } from "../UI/MyInputs";
import QRCodeScanner from "../UI/QrCodeScanner";

export default function StockList() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stockItems } = useSelector((state) => state.stock);
  const { medicines } = useSelector((state) => state.medicines);
  const { locations } = useSelector((state) => state.locations);
  const [stockItem, setStockItem] = useState(null);
  const [editedStockItem, setEditedStockItem] = useState(null);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newStockItem, setNewStockItem] = useState({ 
    medicine_id: "", 
    location_id: "", 
    quantity: 0, 
    expiration_date: ""
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [pageSize, setPageSize] = useState(window.innerWidth <= 768 ? 8 : 6);
  const [openScanner, setOpenScanner] = useState(false);

  const [query, setQuery] = useState("");
  const stockFuse = new Fuse(stockItems, { 
    keys: ["medicine.name", "location.name"], 
    threshold: 0.3 
  });
  const items = query ? stockFuse.search(query).map((r) => r.item) : stockItems;

  useEffect(() => {
    if (stockItem || adding) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [stockItem, adding]);

  useEffect(() => {
    const fetchData = async () => {
      if (!stockItems.length) {
        await fetchInitialData(dispatch, user); 
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await Stocks.Delete(id);
      if (response.success) {
        dispatch(deleteStockItem(id));
        messageApi.success("Stock item deleted successfully");
        goBack();
      } else {
        messageApi.error(response.message);
      }
    } catch (error) {
      messageApi.error("Error deleting stock item");
    }
  };

  const handleCreateStockItem = async (values) => {
    try {
      if (!values) return;
      
      const response = await Stocks.Create(values);
      if (response.success) {
        dispatch(addStockItem(response.data));
        messageApi.success("Stock item added successfully");
        goBack();
      } else {
        messageApi.error(response.message);
        setErrors(response.errors);
      }
    } catch (error) {
      console.error("Create error:", error);
      messageApi.error(error.response?.data?.message || error.response?.data?.error || "Error adding stock item");
    }
  };

  const showStockItem = (stockData) => {
    setStockItem(stockData);
    setEditedStockItem({ ...stockData });
  };

  const goBack = () => {
    setStockItem(null);
    setEditing(false);
    setAdding(false);
    setNewStockItem({ 
      medicine_id: "", 
      location_id: "", 
      quantity: 0, 
      expiration_date: ""
    });
    setEditedStockItem(null);
    setErrors({});
  };

  const editStockItem = async (values) => {
    try {
      if (!values) return;
      
      const response = await Stocks.Update(values.id, values);
      if (response.success) {
        dispatch(updateStockItem(response.data));
        messageApi.success("Stock item updated successfully");
        goBack();
      } else {
        messageApi.error(response.message);
        console.log("Update error:", response);
        setErrors(response.errors);
      }
    } catch (error) {
      console.error("Update error:", error);
      messageApi.error(error.response?.data?.message || error.response?.data?.error || "Error updating stock item");
    }
  };
  
  const focusInput = (name) => {
    const input = document.querySelector(`input[name="${name}"], select[name="${name}"]`);
    if (input) {
      input.focus();
    }
  };

  const setScanResult = (bar_code) => {
    setOpenScanner(false);
    
    if (!bar_code) return messageApi.error("Invalid QR code");
    
    // Find stock items with medicines that have this bar code
    const med = medicines.find(med => med.bar_code === bar_code);
    med ? setQuery(med.name) : messageApi.error("No medicine found with this bar code");
  };

  const columns = [
    {
      title: "Medicine",
      key: "medicine_name",
      align: "center",
      className: "capitalize",
      render: (record) => record.medicine?.name || 'N/A',
      sorter: (a, b) => (a.medicine?.name || '').localeCompare(b.medicine?.name || ''),
    },
    {
      title: "Location",
      key: "location_name",
      align: "center",
      render: (record) => record.location?.name || 'N/A',
      sorter: (a, b) => (a.location?.name || '').localeCompare(b.location?.name || ''),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Expiry Date",
      dataIndex: "expiration_date",
      key: "expiration_date",
      align: "center",
      render: (date) => date ? new Date(date).toLocaleDateString() : 'N/A',
    },
    {
      title: <div className="capitalize">Details</div>,
      key: "details",
      align: "center",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <button className="btn btn-soft btn-primary btn-sm" onClick={() => showStockItem({ ...record })}>
          <ArrowRight size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="border-sh rounded-xl overflow-hidden mx-1 md:mx-4 h-fit my-4 ">
      {contextHolder}
      <div className="flex flex-wrap justify-between items-center gap-6 my-4 px-3">
        <div className="flex gap-4">
          <h1 className="text-2xl font-bold pb-2">Stock Management</h1>
        </div>
      </div>
      <div className="flex justify-between gap-8 items-center mt-8">
        <div className="flex gap-2 justify-center items-center">
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by medicine or location"
            />
          </label>
          
          <button className="btn btn-accent btn-sm btn-circle" onClick={() => {
            setOpenScanner(true);
          }}>
            <ScanBarcode size={16} />
          </button>
        </div>

        <button className="btn btn-primary btn-sm" onClick={() => {
          setStockItem(null);
          setAdding(true);
          setEditing(true);
        }}>
          <Plus size={16} /> Add Stock Item
        </button>
      </div>

      <div className="my-2">
        <Table
          rowSelection={{fixed: true, columnWidth: 50}}
          columns={columns}
          dataSource={items}
          scroll={{ x: "max-content" }}
          rowKey="id"
          loading={{
            indicator: (
              <Spin
                indicator={
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
      
      {/* View/Edit Stock Item Details Sidebar */}
      <div className={`fixed top-0 inset-0 z-[5] bg-black/50 transition-opacity duration-300 ease-in ${stockItem ? "opacity-100 visible" : "opacity-0 invisible"}`} />
      <aside className={`fixed top-0 z-[6] left-0 w-full h-full overflow-y-auto bg-base-100 shadow-lg p-2 sm:p-6 transform transition-transform duration-300 ease-in ${stockItem ? "translate-x-0" : "translate-x-full"}`}>
         {stockItem && editedStockItem && (
          <div className="flex flex-col bg-base-200 w-full h-full gap-4 mx-auto shadow-2xl p-2 sm:p-6 rounded-2xl">
            <div className="flex justify-between items-center">
              {!editing ? (
                <>
                  <button className="btn btn-secondary btn-sm" onClick={goBack}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  {user?.role === 'admin' &&
                    <div className="flex gap-2">
                        <button className="btn btn-primary btn-sm w-22" onClick={() => setEditing(true)}>
                          <Pencil size={16} /> Edit
                        </button>
                      <Popconfirm
                        placement="bottomLeft"
                        title="Delete the Stock Item?"
                        description="Are you sure you want to delete this stock item?"
                        okText="Yes"
                        cancelText="No"
                        icon={<CircleHelp size={16} className="m-1" />}
                        onConfirm={() => handleDelete(stockItem.id)}
                      >
                        <button className="btn btn-error btn-sm w-22">
                          <Trash2 size={16} /> Delete
                        </button>
                      </Popconfirm>
                    </div>
                  }
                </>
              ) : (
                <>
                  <button className="btn btn-secondary btn-sm w-22" onClick={() => { setEditing(false); setEditedStockItem(stockItem); setErrors({}); }}>
                    <X size={16} /> Cancel
                  </button>
                  <Popconfirm
                    placement="bottomRight"
                    title="Save changes?"
                    description="Are you sure you want to save changes?"
                    okText="Yes"
                    cancelText="No"
                    icon={<CircleHelp size={16} className="m-1" />}
                    onConfirm={() => editStockItem(editedStockItem)}
                  >
                    <button className="btn btn-primary btn-sm w-22">
                      <Check size={16} /> Save
                    </button>
                  </Popconfirm>
                </>
              )}
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

              <div className="flex gap-2 text-2xl items-center font-semibold" ><Package /><span>Stock Item Information</span></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SearchSelectInput
                  label="Medicine"
                  value={Number(editedStockItem?.medicine_id)}
                  onChange={value => setEditedStockItem({ ...editedStockItem, medicine_id: value })}
                  disabled={!editing}
                  editing={editing}
                  name="medicine_id"
                  className={errors?.medicine_id ? "input-error border-2" : ""}
                  options={[
                    { value: 0, label: "Select Medicine" },
                    ...medicines.map(medicine => ({ value: medicine.id, label: medicine.name }))
                  ]}
                />
                <SearchSelectInput
                  label="Location"
                  value={Number(editedStockItem?.location_id)}
                  onChange={value => setEditedStockItem({ ...editedStockItem, location_id: value })}
                  disabled={!editing}
                  editing={editing}
                  name="location_id"
                  className={errors?.location_id ? "input-error border-2" : ""}
                  options={[
                    { value: 0, label: "Select Location" },
                    ...locations.map(location => ({ value: location.id, label: location.name }))
                  ]}
                />
                <TextInput
                  label="Quantity"
                  type="number"
                  value={editedStockItem?.quantity}
                  onChange={e => setEditedStockItem({ ...editedStockItem, quantity: parseInt(e.target.value) || 0 })}
                  disabled={!editing}
                  editing={editing}
                  placeholder="Enter quantity"
                  name="quantity"
                  className={errors?.quantity ? "input-error border-2" : ""}
                />
                <TextInput
                  label="Expiry Date"
                  type="date"
                  value={editedStockItem?.expiration_date}
                  onChange={e => setEditedStockItem({ ...editedStockItem, expiration_date: e.target.value })}
                  disabled={!editing}
                  editing={editing}
                  placeholder="Select expiry date"
                  name="expiration_date"
                  className={errors?.expiration_date ? "input-error border-2" : ""}
                />
              </div>
            </div>
          </div>
        )}
      </aside>
      
      {/* Add Stock Item Sidebar */}
      <div className={`fixed top-0 inset-0 z-[5] bg-black/50 transition-opacity duration-300 ease-in ${adding ? "opacity-100 visible" : "opacity-0 invisible"}`} />
      <aside className={`fixed top-0 z-[6] left-0 w-full h-full overflow-y-auto bg-base-100 shadow-lg p-2 sm:p-6 transform transition-transform duration-300 ease-in ${adding ? "translate-x-0" : "translate-x-full"}`}>
        {adding && (
          <div className="flex flex-col bg-base-200 w-full h-full gap-4 mx-auto shadow-2xl p-2 sm:p-6 rounded-2xl">
            <div className="flex justify-between items-center">
              <button className="btn btn-secondary btn-sm" onClick={goBack}>
                <ArrowLeft size={16} /> Back
              </button>
              <Popconfirm
                placement="bottomRight"
                title="Add stock item?"
                description="Are you sure you want to add this stock item?"
                okText="Yes"
                cancelText="No"
                icon={<CircleHelp size={16} className="m-1" />}
                onConfirm={() => handleCreateStockItem(newStockItem)}
              >
                <button className="btn btn-primary btn-sm w-22">
                  <Check size={16} /> Save
                </button>
              </Popconfirm>
            </div>
            <div className="flex flex-col gap-3 sm:gap-6 mt-4">
              {/* Error Display Area */}
              {errors && Object.keys(errors).length > 0 && (
                <div className="flex flex-col gap-1.5 mb-4">
                  {Object.entries(errors).filter(([key]) => ['medicine_id', 'location_id', 'quantity', 'expiration_date'].includes(key)).map(([key, value]) => (
                    <div key={key} onClick={() => focusInput(key)} className="btn btn-error h-fit justify-start btn-xs font-semibold">
                      <TriangleAlert size={16} />
                      {Array.isArray(value) ? value[0] : value}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 text-2xl items-center font-semibold" ><Package /><span>New Stock Item Information</span></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SearchSelectInput
                  label="Medicine"
                  value={Number(newStockItem.medicine_id)}
                  onChange={value => setNewStockItem({ ...newStockItem, medicine_id: value })}
                  name="medicine_id"
                  className={errors?.medicine_id ? "input-error border-2" : ""}
                  editing={true}
                  placeholder="Select Medicine"
                  options={[
                    { value: 0, label: "Select Medicine" },
                    ...medicines.map(medicine => ({ value: medicine.id, label: medicine.name }))
                  ]}
                />
                <SearchSelectInput
                  label="Location"
                  value={Number(newStockItem.location_id)}
                  onChange={value => setNewStockItem({ ...newStockItem, location_id: value })}
                  name="location_id"
                  className={errors?.location_id ? "input-error border-2" : ""}
                  editing={true}
                  placeholder="Select Location"
                  options={[
                    { value: 0, label: "Select Location" },
                    ...locations.map(location => ({ value: location.id, label: location.name }))
                  ]}
                />
                <TextInput
                  label="Quantity"
                  type="number"
                  value={newStockItem.quantity}
                  onChange={e => setNewStockItem({ ...newStockItem, quantity: parseInt(e.target.value) || 0 })}
                  placeholder="Enter quantity"
                  name="quantity"
                  className={errors?.quantity ? "input-error border-2" : ""}
                  editing={true}
                />
                <TextInput
                  label="Expiry Date"
                  type="date"
                  value={newStockItem.expiration_date}
                  onChange={e => setNewStockItem({ ...newStockItem, expiration_date: e.target.value })}
                  placeholder="Select expiry date"
                  name="expiration_date"
                  className={errors?.expiration_date ? "input-error border-2" : ""}
                  editing={true}
                />
              </div>
            </div>
          </div>
        )}
      </aside>
      {openScanner && <ShowModal isOpen={openScanner} onClose={() => setOpenScanner(false)} title="QR Code Scanner" content={<QRCodeScanner setScanResult={setScanResult} />} />}
    </div>
  );
}

function ShowModal({ isOpen, onClose, content, title = null}) {
  return (
    <Modal
      title={title && <h1 className="text-xl font-bold text-center">{title}</h1>}
      open={isOpen}
      onCancel={onClose}
      footer={null}>
      {content}
    </Modal>
  )
}