import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Medicines from "../../assets/api/Medicines";
import { fetchInitialData } from "../Redux/fetchData";
import { deleteMedicine, updateMedicine, addMedicine } from "../Redux/slices/MedicineSlice";

import { message, Popconfirm, Table, Spin, Modal, ConfigProvider } from "antd";
import { CircleHelp, Pencil, Trash2, Loader2, ArrowLeft, ArrowRight, X, Check, Plus, Info, PackageOpen, TriangleAlert, ScanBarcode, ShoppingBag } from "lucide-react";
import Fuse from "fuse.js";
import defaultPic from "../../assets/images/defaultPic.png";
import { CheckboxInput, FileInput, SearchSelectInput, SelectInput, TextInput } from "../UI/MyInputs";
import QRCodeScanner from "../UI/QrCodeScanner";
import { useCart } from "../hooks/useCart";


export default function MedicinesList() {
  const { user } = useSelector((state) => state.auth);

  if (user?.role === "admin") return <AdminList user={user} />;
  else if (user?.role === "employe") return <EmployeList user={user} />;
  else return <div className="text-center text-2xl font-bold">You don't have permission to access this page.</div>;
}

function AdminList({user}) {
  const dispatch = useDispatch();
  const { medicines } = useSelector((state) => state.medicines);
  const { providers } = useSelector((state) => state.providers);
  const { stockItems } = useSelector((state) => state.stock);
  const [medicine, setMedicine] = useState(null);
  const [editedMedicine, setEditedMedicine] = useState(null);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [preview, setPreview] = useState(null);
  const [openScanner, setOpenScanner] = useState(false);
  const [newMedicine, setNewMedicine] = useState({ name: "", bar_code: "", dosage: "-mg", formulation: "syrup", price: 0, image: null, alert_threshold: 10, provider_id: "", automatic_reorder: false, reorder_quantity: 1 });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [pageSize, setPageSize] = useState(window.innerWidth <= 768 ? 8 : 6);

  const [query, setQuery] = useState("");
  const medicinesFuse = new Fuse(medicines, { keys: ["name", "bar_code"], threshold: 0.3 });
  const items = query ? medicinesFuse.search(query).map((r) => r.item) : medicines;
  

  useEffect(() => {
    const fetchData = async () => {
    if (!medicines.length) {
      await fetchInitialData(dispatch, user);
    }
    setLoading(false);
  };
  fetchData();
  }, []);

  // useEffect(() => {
  //   if (medicine || adding) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = 'auto';
  //   }
  // }, [medicine, adding]);

  const handleDelete = async (id) => {
    try {
      const response = await Medicines.Delete(id);
      if (response.success) {
        dispatch(deleteMedicine(id));
        messageApi.success("Medicine deleted successfully");
        goBack();
      } else {
        messageApi.error(response.message);
      }
    } catch (error) {
      messageApi.error("Error deleting medicine");
    }
  };

  const handleCreateMedicine = async (values) => {
    try {
      if (!values) return;
      if (values.dosage.startsWith("-")) {
        setErrors({...errors, dosage: "Dosage is required."});
        messageApi.error("Dosage is required.");
        return;
      }
      const formData = new FormData();

      Object.keys(values).forEach(key => {
        if (key === 'image' && values[key] instanceof File) {
          formData.append(key, values[key]);
        } else if (key === 'automatic_reorder') {
          formData.append(key, values[key] ? 1 : 0);
        } else {
          if (values[key] === null) values[key] = "";
          formData.append(key, values[key]);
        }
      });

      const response = await Medicines.Create(formData);
      if (response.success) {
        dispatch(addMedicine(response.data));
        messageApi.success("Medicine added successfully");
        goBack();
      } else {
        messageApi.error(response.message);
        setErrors(response.errors);
      }
    } catch (error) {
      console.error("Create error:", error);
      messageApi.error(error.response?.data?.message || error.response?.data?.error || "Error adding medicine");
    }
  };

  const showMedicine = (medicine) => {
    setMedicine(medicine);
    setEditedMedicine({ ...medicine });
  };

  const goBack = () => {
    setMedicine(null);
    setEditing(false);
    setAdding(false);
    setNewMedicine({ name: "", bar_code: "", dosage: "-mg", formulation: "syrup", price: 0, image: null, alert_threshold: 10, provider_id: "", automatic_reorder: false, reorder_quantity: 1 });
    setEditedMedicine(null);
    setErrors({});
    setPreview(null);
  };

  const editMedicine = async (values) => {
    try {
      if (!values) return;
      if (values.dosage.startsWith("-")) {
        setErrors({...errors, dosage: "Dosage is required."});
        messageApi.error("Dosage is required.");
        return;
      }
      

      const formData = new FormData();
      const excludeFromForm = ['id', 'provider', 'created_at']
      Object.keys(values).forEach(key => {
        if (key === 'image') {
          if (values[key] instanceof File) {
            formData.append(key, values[key]);
          } else if (values[key] === 'REMOVE_IMAGE') {
            formData.append(key, '');
          }
        }
        else if (!excludeFromForm.includes(key)) {
          if (key === 'automatic_reorder') {
            formData.append(key, values[key] ? 1 : 0);
          } else {
            if (values[key] === null) values[key] = "";
            formData.append(key, values[key]);
          }
        }
      });
      formData.append('_method', 'PUT');

      const response = await Medicines.Update(values.id, formData);
      if (response.success) {
        dispatch(updateMedicine(response.data));
        messageApi.success("Medicine updated successfully");
        goBack();
      } else {
        messageApi.error(response.message);
        console.log("Update error:", response);
        setErrors(response.errors);
      }
    } catch (error) {
      console.error("Update error:", error);
      messageApi.error(error.response?.data?.message || error.response?.data?.error || "Error updating medicine");
    }
  };

  const getDosage = (med, value = "", unit = "") => {
    let [valuePart, unitPart] = med.dosage.split("-");
    if (value !== -1) valuePart = value;
    if (unit) unitPart = unit;
    return `${valuePart}-${unitPart}`;
  };

  const focusInput = (name) => {
    const input = document.querySelector(`input[name="${name}"]`);
    if (input) {
      input.focus();
    }
  };

const setScanResult = (bar_code) => {
  setOpenScanner(false);
  
  if (!bar_code) return messageApi.error("Invalid QR code");
  
  if (adding) return setNewMedicine((prev) => ({ ...prev, bar_code }));
  
  if (medicine && editing) return setEditedMedicine((prev) => ({ ...prev, bar_code }));

  const med = medicines.find(m => m.bar_code === bar_code);
  if (med) { setQuery(bar_code); showMedicine(med);}
  else messageApi.error("Medicine not found");
};

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      minWidth: 124,
      className: "capitalize",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Bar Code",
      dataIndex: "bar_code",
      key: "bar_code",
      align: "center",
    },
    {
      title: "Dosage",
      dataIndex: "dosage",
      key: "dosage",
      align: "center",
      render: (text) => text?.replace("-", " "),
    },
    {
      title: "Formulation",
      dataIndex: "formulation",
      key: "formulation",
      align: "center",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (price) => `${price} MAD`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: <div className="capitalize">Details</div>,
      key: "details",
      align: "center",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <button className="btn btn-soft btn-primary btn-sm" onClick={() => showMedicine({ ...record })}>
          <ArrowRight size={16} />
        </button>
      ),
    },
  ];

  const token = {
    components: {
      Table: {
        headerBg: "#67ae6e",
        headerSortActiveBg: "#328e6e",
        headerSortHoverBg: "#328e6e",
        borderColor: "rgb(0,0,0)"
      }
    }
  }

  const getStock = (id) => stockItems.filter(item => item.medicine_id === id)

  const stockColumns = [
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      align: "center",
      render: (location) => location?.name || 'N/A',
    },
    {
      title: <><span className="hidden sm:inline">Quantity</span><span className="inline sm:hidden">Qty</span></>,
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Expiration Date",
      dataIndex: "expiration_date",
      key: "expiration_date",
      align: "center",
      responsive: ['sm'],
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.expiration_date) - new Date(b.expiration_date),
    },
    {
      title: "Days Left",
      dataIndex: "expiration_date",
      key: "expiration_date",
      align: "center",
      defaultSortOrder: 'ascend',
      sorter: (a, b) => new Date(a.expiration_date) - new Date(b.expiration_date),
      render: (date) => {
        const today = new Date();
        const expirationDate = new Date(date);
        const diffTime = expirationDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 ? `${diffDays} days` : "Expired";
      }
    },
    {
      title: <div className="flex items-center justify-center"><ShoppingBag className="inline sm:hidden" /><span className="hidden sm:inline">Add to Cart</span></div>,
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, record) => <CartBtn item={record} name={medicine?.name} price={medicine?.price} />,
    },
  ];

  return (
    <div className="border-sh rounded-xl overflow-hidden mx-1 md:mx-4 h-fit my-4 ">
      {contextHolder}
      <div className="flex flex-wrap justify-between items-center gap-6 my-4 px-3">
        <div className="flex gap-4">
          <h1 className="text-2xl font-bold pb-2">Medicines Management</h1>
        </div>
      </div>
      <div className="flex justify-between gap-6 items-center mt-8">
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
            placeholder="Search by name or bar code"
          />
        </label>
        
        <button className="btn btn-accent btn-sm btn-circle" onClick={() => {
          setOpenScanner(true);
        }}>
          <ScanBarcode size={16} />
        </button>
      </div>

        <button className="btn btn-primary btn-sm" onClick={() => {
          setMedicine(null);
          setAdding(true);
          setEditing(true);
        }}>
          <Plus size={16} /> Add
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
            pageSize: pageSize ,
            pageSizeOptions: [6, 12, 24, 50],
            className: "m-2",
            position: ["topCenter"],
            showSizeChanger: true,
            onShowSizeChange: (c, size) => {setPageSize(size);}
          }}
        />
      </div>
      <div className={`fixed top-0 inset-0 z-[5] bg-black/50 transition-opacity duration-300 ease-in ${medicine ? "opacity-100 visible" : "opacity-0 invisible"}`} />
      <aside className={`fixed top-0 z-[6] left-0 w-full h-full overflow-y-auto bg-base-100 shadow-lg p-2 sm:p-6 transform transition-transform duration-300 ease-in ${medicine ? "translate-x-0" : "translate-x-full"}`}>
         {medicine && (
          <div className="flex flex-col bg-base-200 w-full h-full gap-4 mx-auto shadow-2xl p-2 sm:p-6 rounded-2xl">
            <div className="flex justify-between items-center">
              {!editing ? (
                <>
                  <button className="btn btn-secondary btn-sm" onClick={goBack}>
                    <ArrowLeft size={16} /> Back
                  </button>
                  <div className="flex gap-2">
                    <button className="btn btn-primary btn-sm w-22" onClick={() => setEditing(true)}>
                      <Pencil size={16} /> Edit
                    </button>
                    <Popconfirm
                      placement="bottomLeft"
                      title="Delete the Medicine?"
                      description="Are you sure you want to delete this medicine?"
                      okText="Yes"
                      cancelText="No"
                      icon={<CircleHelp size={16} className="m-1" />}
                      onConfirm={() => handleDelete(medicine.id)}
                    >
                      <button className="btn btn-error btn-sm w-22">
                        <Trash2 size={16} /> Delete
                      </button>
                    </Popconfirm>
                  </div>
                </>
              ) : (
                <>
                  <button className="btn btn-secondary btn-sm w-22" onClick={() => { setEditing(false); setPreview(null); setEditedMedicine(medicine); setErrors({}); }}>
                    <X size={16} /> Cancel
                  </button>
                  <Popconfirm
                    placement="bottomRight"
                    title="Save changes?"
                    description="Are you sure you want to save changes?"
                    okText="Yes"
                    cancelText="No"
                    icon={<CircleHelp size={16} className="m-1" />}
                    onConfirm={() => editMedicine(editedMedicine)}
                  >
                    <button className="btn btn-primary btn-sm w-22">
                      <Check size={16} /> Save
                    </button>
                  </Popconfirm>
                </>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-4">
              <div className="flex flex-col sm:w-1/3 gap-1.5">

                <div className="flex justify-center items-center p-2 h-fit border border-neutral/50 bg-base-300 rounded-lg">
                  <FileInput
                    clear={() => {setEditedMedicine(prev => ({ ...prev, image: 'REMOVE_IMAGE' })); setPreview(null);}}
                    onChange={e => {setEditedMedicine(prev => ({ ...prev, image: e.target.files[0] })); setPreview(URL.createObjectURL(e.target.files[0])); e.target.value = null;}}
                    name="image"
                    className={errors?.image ? "input-error" : ""}
                    editing={editing}
                    disabled={!editing}
                    accept="image/png, image/jpeg, image/jpg"
                    previewUrl={preview}
                    existingImageUrl={editedMedicine?.image || null}
                    defaultImage={preview || editedMedicine?.image ? null : defaultPic}
                    altText={editedMedicine?.name || "Medicine"}
                  />
                </div>
                {errors && Object.entries(errors).map(([key, value]) => (
                  <div key={key} onClick={() => focusInput(key)} className="btn btn-error h-fit justify-start btn-xs font-semibold">
                    <TriangleAlert size={16} />
                    {Array.isArray(value) ? value[0] : value}
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:w-2/3 gap-3 sm:gap-6">
                <div className="flex gap-2 text-2xl items-center font-semibold" ><Info /><span>Basic information</span></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    label="Name"
                    value={editedMedicine?.name}
                    onChange={e => setEditedMedicine({ ...editedMedicine, name: e.target.value })}
                    disabled={!editing}
                    editing={editing}
                    placeholder="Enter medicine name"
                    name="name"
                    className={errors?.name ? "input-error border-2" : ""}
                  />

                  <TextInput
                    label="Bar Code"
                    value={editedMedicine?.bar_code}
                    onChange={e => setEditedMedicine({ ...editedMedicine, bar_code: e.target.value })}
                    disabled={!editing}
                    editing={editing}
                    placeholder="Enter bar code"
                    name="bar_code"
                    scanner={setOpenScanner}
                    className={errors?.bar_code ? "input-error border-2" : ""}
                  />

                  <label className={`input w-full transition-colors duration-300 ${!editing && "cursor-text! text-base-content! border-neutral!"} ${errors?.dosage ? "input-error border-2" : ""}`}>
                    <span className="label font-bold w-56">Dosage</span>
                    <input
                      type="number"
                      placeholder="Enter dosage value"
                      className={`disabled:cursor-text! w-full`}
                      value={editedMedicine?.dosage.split("-")[0]}
                      onChange={(e) => setEditedMedicine({ ...editedMedicine, dosage: getDosage(editedMedicine, e.target.value, "") })}
                      disabled={!editing}
                      name="dosage"
                    />
                    <select
                      className="outline-0 w-fit p-0 rounded-l-none pl-2 pr-1 border-l h-7 border-black/10 disabled:cursor-text! disabled:bg-transparent"
                      value={editedMedicine?.dosage.split("-")[1] || "mg"}
                      onChange={(e) => setEditedMedicine({ ...editedMedicine, dosage: getDosage(editedMedicine, -1, e.target.value || "mg") })}
                      disabled={!editing}
                    >
                      <option value="mg">mg</option>
                      <option value="ml">ml</option>
                      <option value="g">g</option>
                    </select>
                  </label>

                  <SearchSelectInput
                    label="Formulation"
                    value={editedMedicine?.formulation}
                    onChange={value => setEditedMedicine({ ...editedMedicine, formulation: value })}
                    disabled={!editing}
                    editing={editing}
                    name="formulation"
                    className={errors.formulation ? "input-error border-2" : ""}
                    options={[
                      { value: "tablet", label: "Tablet" },
                      { value: "syrup", label: "Syrup" },
                      { value: "injection", label: "Injection" },
                      { value: "ointment", label: "Ointment" },
                    ]}
                    />

                  <TextInput
                    label="Price"
                    type="number"
                    value={editedMedicine?.price}
                    onChange={e => setEditedMedicine({ ...editedMedicine, price: Number(e.target.value) })}
                    disabled={!editing}
                    editing={editing}
                    placeholder="Enter price"
                    name="price"
                    className={errors?.price ? "input-error border-2" : ""}
                  />

                  <TextInput
                    label="Total Quantity"
                    type="number"
                    value={editedMedicine?.total_quantity}
                    disabled={true}
                    editing={false}
                  />
                </div>

                <div className="flex gap-2 text-2xl items-center font-semibold" ><PackageOpen /><span>Inventory</span></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    label="Alert Threshold"
                    value={editedMedicine?.alert_threshold}
                    onChange={(e) => setEditedMedicine({ ...editedMedicine, alert_threshold: e.target.value })}
                    disabled={!editing}
                    editing={editing}
                    placeholder="Enter alert threshold"
                    name="alert_threshold"
                    className={errors?.alert_threshold ? "input-error border-2" : ""}
                  />

                  <SearchSelectInput
                    label="Provider"
                    value={Number(editedMedicine?.provider_id)}
                    onChange={value => setEditedMedicine({ ...editedMedicine, provider_id: value })}
                    disabled={!editing}
                    editing={editing}
                    name="provider_id"
                    className={errors?.provider_id ? "input-error border-2" : ""}
                    options={[{ value: 0, label: "No Provider" }, ...providers.map((p) => ({ value: p.id, label: p.name }))]}
                  />

                  <CheckboxInput
                    label="Automatic Reorder"
                    checked={editedMedicine?.automatic_reorder}
                    onChange={e => setEditedMedicine({ ...editedMedicine, automatic_reorder: e.target.checked })}
                    disabled={!editing}
                    editing={editing}
                    name="automatic_reorder"
                    className={errors?.automatic_reorder ? "input-error border-2" : ""}
                  />

                  <TextInput
                    label="Reorder Quantity"
                    type="number"
                    value={editedMedicine?.reorder_quantity}
                    onChange={e => setEditedMedicine({ ...editedMedicine, reorder_quantity: e.target.value })}
                    disabled={!editing}
                    editing={editing && editedMedicine?.automatic_reorder}
                    placeholder="Enter reorder quantity"
                    name="reorder_quantity"
                    className={errors?.reorder_quantity ? "input-error border-2" : ""}
                  />
                  
                </div>
                <ConfigProvider theme={token}>
                  {!editing && getStock(editedMedicine?.id).length > 0 && <Table dataSource={getStock(editedMedicine?.id)} className="sm:mt-6" bordered={true} size="small" columns={stockColumns} rowKey="id" pagination={false} />}
                </ConfigProvider>
              </div>
            </div>
          </div>
        )}
      </aside>
      
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
                title="Add medicine?"
                description="Are you sure you want to add this medicine?"
                okText="Yes"
                cancelText="No"
                icon={<CircleHelp size={16} className="m-1" />}
                onConfirm={() => handleCreateMedicine(newMedicine)}
              >
                <button className="btn btn-primary btn-sm w-22">
                  <Check size={16} /> Save
                </button>
              </Popconfirm>
            </div>
            {/* Updated structure to mirror editing section */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-4">
              <div className="flex flex-col sm:w-1/3 gap-1.5">
                <div className="flex justify-center items-center p-2 h-full border border-neutral/50 bg-base-300 rounded-lg">
                  <FileInput
                    clear={() => { setNewMedicine(prev => ({ ...prev, image: 'REMOVE_IMAGE' })); setPreview(null); }}
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setNewMedicine(prev => ({ ...prev, image: file }));
                        setPreview(URL.createObjectURL(file));
                      }
                      e.target.value = null;
                    }}
                    name="image"
                    className={errors?.image ? "input-error" : ""}
                    editing={true}
                    disabled={false}
                    accept="image/png, image/jpeg, image/jpg"
                    previewUrl={preview}
                    existingImageUrl={null}
                    defaultImage={preview ? null : defaultPic}
                    altText={newMedicine?.name || "New Medicine"}
                  />
                </div>
                {/* Consistent error display */}
                {errors && Object.entries(errors).filter(([key]) => ['name', 'bar_code', 'dosage', 'formulation', 'price', 'image', 'alert_threshold', 'provider_id', 'automatic_reorder', 'reorder_quantity'].includes(key)).map(([key, value]) => (
                  <div key={key} onClick={() => focusInput(key)} className="btn btn-error h-fit justify-start btn-xs font-semibold">
                    <TriangleAlert size={16} />
                    {Array.isArray(value) ? value[0] : value}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:w-2/3 gap-3 sm:gap-6">
                <div className="flex gap-2 text-2xl items-center font-semibold" ><Info /><span>Basic information</span></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    label="Name"
                    value={newMedicine.name}
                    onChange={e => setNewMedicine({ ...newMedicine, name: e.target.value })}
                    placeholder="Enter medicine name"
                    name="name"
                    className={errors?.name ? "input-error border-2" : ""}
                    editing={true}
                  />
                  <TextInput
                    label="Bar Code"
                    value={newMedicine.bar_code}
                    onChange={e => setNewMedicine({ ...newMedicine, bar_code: e.target.value })}
                    placeholder="Enter bar code"
                    name="bar_code"
                    className={errors?.bar_code ? "input-error border-2" : ""}
                    editing={true}
                    scanner={setOpenScanner}
                  />
                  <label className={`input w-full transition-colors duration-300 ${errors?.dosage ? "input-error border-2" : ""}`}>
                    <span className="label font-bold w-56">Dosage</span>
                    <input
                      type="number"
                      placeholder="Enter dosage value"
                      className="disabled:cursor-text! w-full"
                      value={newMedicine?.dosage.split("-")[0]}
                      onChange={e => setNewMedicine({ ...newMedicine, dosage: getDosage(newMedicine, e.target.value, "") })}
                      disabled={false}
                      name="dosage"
                    />
                    <select
                      className="outline-0 w-fit p-0 rounded-l-none pl-2 pr-1 border-l h-7 border-black/10"
                      value={newMedicine?.dosage.split("-")[1] || "mg"}
                      onChange={e => setNewMedicine({ ...newMedicine, dosage: getDosage(newMedicine, -1, e.target.value || "mg") })}
                      disabled={false}
                    >
                      <option value="mg">mg</option>
                      <option value="ml">ml</option>
                      <option value="g">g</option>
                    </select>
                  </label>
                  <SearchSelectInput
                    label="Formulation"
                    value={newMedicine.formulation}
                    onChange={value => setNewMedicine({ ...newMedicine, formulation: value })}
                    name="formulation"
                    className={errors?.formulation ? "input-error border-2" : ""}
                    editing={true}
                    disabled={false}
                    options={[
                      { value: "tablet", label: "Tablet" },
                      { value: "syrup", label: "Syrup" },
                      { value: "injection", label: "Injection" },
                      { value: "ointment", label: "Ointment" },
                    ]}
                  />
                  <TextInput
                    label="Price"
                    type="number"
                    value={newMedicine.price}
                    onChange={e => setNewMedicine({ ...newMedicine, price: Number(e.target.value) })}
                    placeholder="Enter price"
                    name="price"
                    className={errors?.price ? "input-error border-2" : ""}
                    editing={true}
                  />
                </div>
                <div className="flex gap-2 text-2xl items-center font-semibold" ><PackageOpen /><span>Inventory</span></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    label="Alert Threshold"
                    value={newMedicine.alert_threshold}
                    onChange={e => setNewMedicine({ ...newMedicine, alert_threshold: e.target.value })}
                    placeholder="Enter alert threshold"
                    name="alert_threshold"
                    className={errors?.alert_threshold ? "input-error border-2" : ""}
                    editing={true}
                  />
                  <SearchSelectInput
                    label="Provider"
                    value={Number(newMedicine.provider_id)}
                    onChange={value => setNewMedicine({ ...newMedicine, provider_id: value })}
                    name="provider_id"
                    className={errors?.provider_id ? "input-error border-2" : ""}
                    editing={true}
                    disabled={false}
                    options={[{ value: 0, label: "No Provider" }, ...providers.map((p) => ({ value: p.id, label: p.name }))]}
                  />
                  <CheckboxInput
                    label="Automatic Reorder"
                    checked={newMedicine.automatic_reorder}
                    onChange={e => setNewMedicine({ ...newMedicine, automatic_reorder: e.target.checked })}
                    name="automatic_reorder"
                    className={errors?.automatic_reorder ? "input-error border-2" : ""}
                    editing={true}
                  />
                  <TextInput
                    label="Reorder Quantity"
                    type="number"
                    value={newMedicine.reorder_quantity}
                    onChange={e => setNewMedicine({ ...newMedicine, reorder_quantity: e.target.value })}
                    placeholder="Enter reorder quantity"
                    name="reorder_quantity"
                    min={1}
                    className={errors?.reorder_quantity ? "input-error border-2" : ""}
                    editing={newMedicine.automatic_reorder}
                    disabled={!newMedicine.automatic_reorder}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
      {openScanner && <ShowModal isOpen={openScanner} onClose={() => setOpenScanner(false)} title="QR Code Scanner" content={<QRCodeScanner setScanResult={setScanResult} />} />}
    </div>
  );
}

function EmployeList({ user }) {
  const dispatch = useDispatch();
  const { medicines } = useSelector((state) => state.medicines);
  const { stockItems } = useSelector((state) => state.stock);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(window.innerWidth <= 768 ? 8 : 10);
  const [query, setQuery] = useState("");
  const [openScanner, setOpenScanner] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const medicinesFuse = new Fuse(medicines || [], { keys: ["name", "bar_code", "formulation"], threshold: 0.3 });
  const items = query && medicines?.length ? medicinesFuse.search(query).map((r) => r.item) : medicines || [];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if ((!medicines || medicines.length === 0) && user) {
        await fetchInitialData(dispatch, user);
      }
      setLoading(false);
    };
    fetchData();
  }, [dispatch, user, medicines?.length]);


  const showMedicineDetails = (medicine) => {
    setSelectedMedicine(medicine);
  };

  const goBack = () => {
    setSelectedMedicine(null);
  };

  const setScanResult = (bar_code) => {
    setOpenScanner(false);
    
    if (!bar_code) return messageApi.error("Invalid QR code");
    
    const med = medicines.find(m => m.bar_code === bar_code);
    if (med) {
      setQuery(bar_code);
      showMedicineDetails(med);
    } else {
      messageApi.error("Medicine not found");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      className: "capitalize",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Bar Code",
      dataIndex: "bar_code",
      key: "bar_code",
      align: "center",
    },
    {
      title: "Dosage",
      dataIndex: "dosage",
      key: "dosage",
      align: "center",
      render: (text) => text?.replace("-", " "),
    },
    {
      title: "Formulation",
      dataIndex: "formulation",
      key: "formulation",
      align: "center",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (price) => `${price} MAD`,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Details",
      key: "details",
      align: "center",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <button className="btn btn-soft btn-primary btn-sm" onClick={() => showMedicineDetails(record)}>
          <ArrowRight size={16} />
        </button>
      ),
    },
  ];

  const token = {
    components: {
      Table: {
        headerBg: "#67ae6e",
        headerSortActiveBg: "#328e6e",
        headerSortHoverBg: "#328e6e",
        borderColor: "rgb(0,0,0)"
      }
    }
  }

  const getStock = (id) => stockItems.filter(item => item.medicine_id === id)

  const stockColumns = [
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      align: "center",
      render: (location) => location?.name || 'N/A',
    },
    // title is Quantity in large screens, but Qty in small screens
    {
      title: <><span className="hidden sm:inline">Quantity</span><span className="inline sm:hidden">Qty</span></>,
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Expiration Date",
      dataIndex: "expiration_date",
      key: "expiration_date",
      align: "center",
      responsive: ['sm'],
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.expiration_date) - new Date(b.expiration_date),
    },
    {
      title: "Days Left",
      dataIndex: "expiration_date",
      key: "expiration_date",
      align: "center",
      defaultSortOrder: 'ascend',
      sorter: (a, b) => new Date(a.expiration_date) - new Date(b.expiration_date),
      render: (date) => {
        const today = new Date();
        const expirationDate = new Date(date);
        const diffTime = expirationDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 ? `${diffDays} days` : "Expired";
      }
    },
    {
      title: <div className="flex items-center justify-center"><ShoppingBag className="inline sm:hidden" /><span className="hidden sm:inline">Add to Cart</span></div>,
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (_, record) => <CartBtn item={record} name={selectedMedicine?.name} price={selectedMedicine?.price} />,
    },
  ];
  
  return (
    <div className="border-sh rounded-xl overflow-hidden mx-1 md:mx-4 h-fit my-4 ">
      {contextHolder}
      <div className="flex flex-wrap justify-between items-center gap-6 my-4 px-3">
        <h1 className="text-2xl font-bold pb-2">Medicines List</h1>
      </div>
      <div className="flex justify-start gap-2 items-center mt-8 mb-2 px-3">
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
            placeholder="Search by name, bar code..."
          />
        </label>
        
        <button className="btn btn-accent btn-sm btn-circle" onClick={() => {
          setOpenScanner(true);
        }}>
          <ScanBarcode size={16} />
        </button>
      </div>

      <div className="my-2">
        <Table
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
            pageSizeOptions: [10, 20, 50, 100],
            className: "m-2",
            position: ["topCenter", "bottomCenter"],
            showSizeChanger: true,
            onShowSizeChange: (c, size) => { setPageSize(size); }
          }}
        />
      </div>

      {/* Details View Modal/Aside */}
      <div className={`fixed top-0 inset-0 z-[5] bg-black/50 transition-opacity duration-300 ease-in ${selectedMedicine ? "opacity-100 visible" : "opacity-0 invisible"}`} />
      <aside className={`fixed top-0 z-[6] left-0 w-full h-full overflow-y-auto bg-base-100 shadow-lg p-2 sm:p-6 transform transition-transform duration-300 ease-in ${selectedMedicine ? "translate-x-0" : "translate-x-full"}`}>
        {selectedMedicine && (
          <div className="flex flex-col bg-base-200 w-full h-full gap-4 mx-auto shadow-2xl p-2 sm:p-6 rounded-2xl">
            <div className="flex justify-start items-center">
              <button className="btn btn-secondary btn-sm" onClick={goBack}>
                <ArrowLeft size={16} /> Back
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-4">
              <div className="flex flex-col sm:w-1/3 gap-1.5">
                <div className="flex justify-center items-center p-2 h-fit border border-neutral/50 bg-base-300 rounded-lg">
                  <FileInput
                    name="image"
                    editing={false}
                    disabled={true}
                    existingImageUrl={selectedMedicine.image || null}
                    defaultImage={selectedMedicine.image ? null : defaultPic}
                    altText={selectedMedicine.name}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:w-2/3 gap-3 sm:gap-6">
                <div className="flex gap-2 text-2xl items-center font-semibold" ><Info /><span>Basic information</span></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput label="Name" value={selectedMedicine.name} editing={false} disabled={true} />
                  <TextInput label="Bar Code" value={selectedMedicine.bar_code} editing={false} disabled={true} />
                  <TextInput label="Dosage" value={selectedMedicine.dosage?.replace("-", " ")} editing={false} disabled={true} />
                  <TextInput label="Formulation" value={selectedMedicine.formulation} editing={false} disabled={true} />
                  <TextInput label="Price" value={`${selectedMedicine.price} MAD`} editing={false} disabled={true} />
                  <TextInput label="Total Quantity" value={selectedMedicine.total_quantity} disabled={true} editing={false} />
                </div>
                <ConfigProvider theme={token}>
                  {getStock(selectedMedicine?.id).length > 0 && <Table dataSource={getStock(selectedMedicine?.id)} className="my-4 sm:mt-6" bordered={true} size="small" columns={stockColumns} rowKey="id" pagination={false} />}
                </ConfigProvider>
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

function CartBtn({item, price, name}) {
  const { addItem, isInCart, isAtMaxQuantity } = useCart();
  const isExpired = new Date(item.expiration_date) < new Date();
  const hasStock = item.quantity > 0;
  const itemInCart = isInCart(item.id);
  // const itemInCart = isInCart(item.id, name);
  const atMaxQuantity = isAtMaxQuantity(item.id);

  return (
    <button
      onClick={() => addItem(item.id, 1, item.quantity, price, name)}
      className="btn btn-sm btn-accent min-w-16 p-0"
      disabled={!hasStock || isExpired || itemInCart || atMaxQuantity}
      title={
        !hasStock ? 'Out of stock' :
        isExpired ? 'Expired' :
        atMaxQuantity ? 'Maximum quantity reached' :
        itemInCart ? 'Already in cart' : 'Add to cart'
      }
    >
      {!hasStock ? 'No Stock' : 
        isExpired ? 'Expired' :
        atMaxQuantity ? 'Max Qty' :
        itemInCart ? 'In Cart' : 'Add'}
    </button>
  );
}