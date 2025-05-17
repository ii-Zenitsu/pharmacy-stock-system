import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Popconfirm, Table, Spin } from "antd";
import { CircleHelp, Pencil, Trash2, Loader2, ArrowLeft, ArrowRight, X, Check, Plus, Info, ArrowBigDownDash, ArrowBigDownDashIcon, ChevronDown, PackageOpen, CircleAlert, TriangleAlert } from "lucide-react";
import Medicines from "../../assets/api/Medicines";
import Providers from "../../assets/api/Providers";
import Fuse from "fuse.js";
import { setMedicines, deleteMedicine, updateMedicine, addMedicine } from "../Redux/slices/MedicineSlice";
import { setProviders } from "../Redux/slices/ProviderSlice";
import defaultPic from "../../assets/images/defaultPic.png";
import { CheckboxInput, SelectInput, TextInput } from "../UI/MyInputs";


export default function MedicinesList() {
  const dispatch = useDispatch();
  const { medicines } = useSelector((state) => state.medicines);
  const { providers } = useSelector((state) => state.providers);
  const [medicine, setMedicine] = useState(null);
  const [editedMedicine, setEditedMedicine] = useState(null);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newMedicine, setNewMedicine] = useState({ name: "", bar_code: "", dosage: "", formulation: "syrup", price: 0, alert_threshold: 0, provider_id: "", automatic_reorder: false, reorder_quantity: 1, image: null,});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [pageSize, setPageSize] = useState(window.innerWidth <= 768 ? 8 : 6);

  const [query, setQuery] = useState("");
  const medicinesFuse = new Fuse(medicines, { keys: ["name", "bar_code"], threshold: 0.3 });
  const items = query ? medicinesFuse.search(query).map((r) => r.item) : medicines;

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await Medicines.GetAll();
      if (response.success) {
        dispatch(setMedicines(response.data));
        console.log("Medicines :", response.data);
        const providersResponse = await Providers.GetAll();
        if (providersResponse.success) {
          dispatch(setProviders(providersResponse.data));
        } else {
          messageApi.error(providersResponse.message);
        }
      } else {
        messageApi.error(response.message);
      }
    } catch (error) {
      console.log("Error fetching Medicines:", error);
      messageApi.error("Failed to load Medicines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (medicine || adding) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [medicine, adding]);

  useEffect(() => {
    fetchMedicines();
  }, []);

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

      const response = await Medicines.Create(values);
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
    setNewMedicine({ name: "", bar_code: "", dosage: "", formulation: "syrup", price: 0, alert_threshold: 0, provider_id: "", automatic_reorder: false, reorder_quantity: 1, image: null });
    setEditedMedicine(null);
    setErrors({});
  };

  const editMedicine = async (values) => {
    try {
      if (!values) return;
      if (values.dosage.startsWith("-")) {
        setErrors({...errors, dosage: "Dosage is required."});
        messageApi.error("Dosage is required.");
        return;
      }

      const response = await Medicines.Update(values.id, values);
      if (response.success) {
        dispatch(updateMedicine(response.data));
        messageApi.success("Medicine updated successfully");
        goBack();
      } else {
        messageApi.error(response.message);
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

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      minWidth: 124,
      className: "capitalize",
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

  return (
    <div className="border-sh rounded-xl overflow-hidden mx-1 md:mx-4 h-fit my-4 ">
      {contextHolder}
      <div className="flex flex-wrap justify-between items-center gap-6 my-4 px-3">
        <div className="flex gap-4">
          <h1 className="text-2xl font-bold pb-2">Medicines Management</h1>
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
            placeholder="Search"
          />
        </label>
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
      <aside className={`fixed top-0 z-[6] left-0 w-full h-full overflow-y-auto bg-base-100 shadow-lg p-4 transform transition-transform duration-300 ease-in ${medicine ? "translate-x-0" : "translate-x-full"}`}>
         {medicine && (
          <div className="flex flex-col bg-base-200 w-full gap-4 mx-auto mt-16 shadow-2xl p-6 rounded-2xl">
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
                  <button className="btn btn-secondary btn-sm w-22" onClick={() => { setEditing(false); setEditedMedicine(medicine); setErrors({});}}>
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

                <div className="p-3 h-fit border border-neutral/50 bg-base-300 rounded-lg">
                  <img
                    src={medicine?.image || defaultPic}
                    alt="Medicine"
                    className="w-full h-[200px] rounded-lg shadow-lg"
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

                  <SelectInput
                    label="Formulation"
                    value={editedMedicine?.formulation}
                    onChange={(e) => setEditedMedicine({ ...editedMedicine, formulation: e.target.value })}
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
                    onChange={e => setEditedMedicine({ ...editedMedicine, price: e.target.value })}
                    disabled={!editing}
                    editing={editing}
                    placeholder="Enter price"
                    name="price"
                    className={errors?.price ? "input-error border-2" : ""}
                  />

                  <TextInput
                    label="Quantity"
                    type="number"
                    value={editedMedicine?.quantity}
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

                  <SelectInput
                    label="Provider"
                    value={editedMedicine?.provider_id}
                    onChange={(e) => setEditedMedicine({ ...editedMedicine, provider_id: e.target.value })}
                    disabled={!editing}
                    editing={editing}
                    options={[{ value: "", label: "No Provider" }, ...providers.map((p) => ({ value: p.id, label: p.name }))]}
                    name="provider_id"
                    className={errors?.provider_id ? "input-error border-2" : ""}
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
              </div>
            </div>
          </div>
        )}
      </aside>
      
      <div className={`fixed top-0 inset-0 z-[5] bg-black/50 transition-opacity duration-300 ease-in ${adding ? "opacity-100 visible" : "opacity-0 invisible"}`} />
      <aside className={`fixed top-0 z-[6] left-0 w-full h-full overflow-y-auto bg-base-100 shadow-lg p-4 transform transition-transform duration-300 ease-in ${adding ? "translate-x-0" : "translate-x-full"}`}>
        {adding && (
          <div className="flex flex-col bg-base-200 w-full gap-4 mx-auto mt-16 shadow-2xl p-6 rounded-2xl">
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
            <div className="flex flex-col sm:w-full gap-3 sm:gap-6 mt-4">
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
                <SelectInput
                  label="Formulation"
                  value={newMedicine.formulation}
                  onChange={e => setNewMedicine({ ...newMedicine, formulation: e.target.value })}
                  name="formulation"
                  className={errors?.formulation ? "input-error border-2" : ""}
                  editing={true}
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
                  onChange={e => setNewMedicine({ ...newMedicine, price: e.target.value })}
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
                <SelectInput
                  label="Provider"
                  value={newMedicine.provider_id}
                  onChange={e => setNewMedicine({ ...newMedicine, provider_id: e.target.value })}
                  options={[{ value: "", label: "No Provider" }, ...providers.map((p) => ({ value: p.id, label: p.name }))]}
                  name="provider_id"
                  className={errors?.provider_id ? "input-error border-2" : ""}
                  editing={true}
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
                  className={errors?.reorder_quantity ? "input-error border-2" : ""}
                  editing={newMedicine.automatic_reorder}
                  disabled={!newMedicine.automatic_reorder}
                />
              </div>
              {/* Error display */}
              {errors && Object.entries(errors).map(([key, value]) => (
                <div key={key} onClick={() => focusInput(key)} className="btn btn-error h-fit justify-start btn-xs font-semibold">
                  <TriangleAlert size={16} />
                  {Array.isArray(value) ? value[0] : value}
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
      
    </div>
  );
}