import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message, Popconfirm, Modal, Form, Input, Table, Spin } from "antd";
import { CircleHelp, Pencil, Trash2, Loader2, ArrowLeft, ArrowRight, X, Check, Plus } from "lucide-react";
import Medicines from "../../assets/api/Medicines";
import Fuse from "fuse.js";
import { setMedicines, deleteMedicine, updateMedicine, addMedicine } from "../Redux/slices/MedicineSlice";

export default function MedicinesList() {
  const dispatch = useDispatch();
  const { medicines } = useSelector((state) => state);
  const [medicine, setMedicine] = useState(null);
  const [editedMedicine, setEditedMedicine] = useState(null);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const [query, setQuery] = useState("");
  const medicinesFuse = new Fuse(medicines, { keys: ["name", "bar_code"], threshold: 0.3 });
  const items = query ? medicinesFuse.search(query).map((r) => r.item) : medicines;

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await Medicines.GetAll();
      if (response.success) {
        dispatch(setMedicines(response.data));
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

  const showMedicine = (medicine) => {
    setMedicine(medicine);
    setEditedMedicine({ ...medicine });
  };

  const goBack = () => {
    setMedicine(null);
    setEditing(false);
    setAdding(false);
  };

  const editMedicine = async (values) => {
    try {
      if (!values) return;

      const response = await Medicines.Update(values.id, values);
      if (response.success) {
        dispatch(updateMedicine(response.data));
        messageApi.success("Medicine updated successfully");
        goBack();
      } else {
        messageApi.error(response.message);
      }
    } catch (error) {
      console.error("Update error:", error);
      messageApi.error(error.response?.data?.message || error.response?.data?.error || "Error updating medicine");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      render: (text) => <div className="flex capitalize items-center gap-2">{text}</div>,
    },
    {
      title: "Bar Code",
      dataIndex: "bar_code",
      key: "bar_code",
    },
    {
      title: "Dosage",
      dataIndex: "dosage",
      key: "dosage",
    },
    {
      title: "Formulation",
      dataIndex: "formulation",
      key: "formulation",
    },
    {
      title: "Expiration Date",
      dataIndex: "expiration_date",
      key: "expiration_date",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
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
        <button className="btn btn-primary btn-sm" onClick={() => setAdding(true)}>
          <Plus size={16} /> Add Medicine
        </button>
      </div>

      <div className="my-4">
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
          pagination={{ pageSize: 6 }}
        />
      </div>
      <div className={`fixed top-16 inset-0 z-[5] bg-black/50 transition-opacity duration-300 ${medicine ? "opacity-100 visible" : "opacity-0 invisible"}`} />
      <aside className={`fixed top-16 z-[6] left-0 w-full h-full bg-base-100 shadow-lg p-4 transform transition-transform duration-300 ${medicine ? "translate-x-0" : "translate-x-full"}`}>
        {medicine && (
          <div className="flex flex-col max-w-2xl bg-base-200 w-full gap-4 mx-auto mt-16 shadow-2xl p-6 rounded-2xl">
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
                  <button className="btn btn-secondary btn-sm w-22" onClick={() => { setEditing(false); setEditedMedicine(medicine); }}>
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
            <div className="flex flex-col w-full gap-6 mt-4">
              <label className={`input w-full transition-colors duration-300 ${!editing && "cursor-text! text-base-content! border-neutral!"}`}>
                <span className="label font-bold w-36">Name</span>
                <input
                  type="text"
                  placeholder="Enter medicine name"
                  className="disabled:cursor-text!"
                  value={editedMedicine?.name}
                  onChange={(e) => setEditedMedicine({ ...editedMedicine, name: e.target.value })}
                  disabled={!editing}
                />
              </label>

              <label className={`input w-full transition-colors duration-300 ${!editing && "cursor-text! text-base-content! border-neutral!"}`}>
                <span className="label font-bold w-36">Bar Code</span>
                <input
                  type="text"
                  placeholder="Enter bar code"
                  className="disabled:cursor-text!"
                  value={editedMedicine?.bar_code}
                  onChange={(e) => setEditedMedicine({ ...editedMedicine, bar_code: e.target.value })}
                  disabled={!editing}
                />
              </label>

              <label className={`input w-full transition-colors duration-300 ${!editing && "cursor-text! text-base-content! border-neutral!"}`}>
                <span className="label font-bold w-36">Dosage</span>
                <input
                  type="text"
                  placeholder="Enter dosage"
                  className="disabled:cursor-text!"
                  value={editedMedicine?.dosage}
                  onChange={(e) => setEditedMedicine({ ...editedMedicine, dosage: e.target.value })}
                  disabled={!editing}
                />
              </label>

              <label className={`input w-full transition-colors duration-300 ${!editing && "cursor-text! text-base-content! border-neutral!"}`}>
                <span className="label font-bold w-36">Formulation</span>
                <input
                  type="text"
                  placeholder="Enter formulation"
                  className="disabled:cursor-text!"
                  value={editedMedicine?.formulation}
                  onChange={(e) => setEditedMedicine({ ...editedMedicine, formulation: e.target.value })}
                  disabled={!editing}
                />
              </label>

              <label className={`input w-full transition-colors duration-300 ${!editing && "cursor-text! text-base-content! border-neutral!"}`}>
                <span className="label font-bold w-36">Expiration Date</span>
                <input
                  type="date"
                  className="disabled:cursor-text!"
                  value={editedMedicine?.expiration_date?.split("T")[0]}
                  onChange={(e) => setEditedMedicine({ ...editedMedicine, expiration_date: e.target.value })}
                  disabled={!editing}
                />
              </label>

              <label className={`input w-full transition-colors duration-300 ${!editing && "cursor-text! text-base-content! border-neutral!"}`}>
                <span className="label font-bold w-36">Quantity</span>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  className="disabled:cursor-text!"
                  value={editedMedicine?.quantity}
                  onChange={(e) => setEditedMedicine({ ...editedMedicine, quantity: e.target.value })}
                  disabled={!editing}
                />
              </label>

              <label className={`input w-full transition-colors duration-300 ${!editing && "cursor-text! text-base-content! border-neutral!"}`}>
                <span className="label font-bold w-36">Price</span>
                <input
                  type="number"
                  placeholder="Enter price"
                  className="disabled:cursor-text!"
                  value={editedMedicine?.price}
                  onChange={(e) => setEditedMedicine({ ...editedMedicine, price: e.target.value })}
                  disabled={!editing}
                />
              </label>

              <label className={`input w-full transition-colors duration-300 ${!editing && "cursor-text! text-base-content! border-neutral!"}`}>
                <span className="label font-bold w-36">Location</span>
                <input
                  type="text"
                  placeholder="Enter location"
                  className="disabled:cursor-text!"
                  value={editedMedicine?.location}
                  onChange={(e) => setEditedMedicine({ ...editedMedicine, location: e.target.value })}
                  disabled={!editing}
                />
              </label>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}