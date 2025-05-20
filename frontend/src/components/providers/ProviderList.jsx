import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Providers from "../../assets/api/Providers"; // Assuming you have a Providers API similar to Medicines
import { fetchInitialData } from "../Redux/fetchData";
import { deleteProvider, updateProvider, addProvider } from "../Redux/slices/ProviderSlice"; // Assuming these actions exist

import { message, Popconfirm, Table, Spin } from "antd";
import { CircleHelp, Pencil, Trash2, Loader2, ArrowLeft, ArrowRight, X, Check, Plus, Info, TriangleAlert, User } from "lucide-react";
import Fuse from "fuse.js";
import { TextInput } from "../UI/MyInputs";


export default function ProviderList() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { providers } = useSelector((state) => state.providers);
  const [provider, setProvider] = useState(null);
  const [editedProvider, setEditedProvider] = useState(null);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newProvider, setNewProvider] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [pageSize, setPageSize] = useState(window.innerWidth <= 768 ? 8 : 6);

  const [query, setQuery] = useState("");
  const providersFuse = new Fuse(providers, { keys: ["name", "email", "phone"], threshold: 0.3 });
  const items = query ? providersFuse.search(query).map((r) => r.item) : providers;


  useEffect(() => {
    if (provider || adding) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [provider, adding]);

  useEffect(() => {
    const fetchData = async () => {
    if (!providers.length) {
      await fetchInitialData(dispatch, user); 
    }
    setLoading(false);
  };
  fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await Providers.Delete(id);
      if (response.success) {
        dispatch(deleteProvider(id));
        messageApi.success("Provider deleted successfully");
        goBack();
      } else {
        messageApi.error(response.message);
      }
    } catch (error) {
      messageApi.error("Error deleting provider");
    }
  };

  const handleCreateProvider = async (values) => {
    try {
      if (!values) return;
      
      const response = await Providers.Create(values);
      if (response.success) {
        dispatch(addProvider(response.data));
        messageApi.success("Provider added successfully");
        goBack();
      } else {
        messageApi.error(response.message);
        setErrors(response.errors);
      }
    } catch (error) {
      console.error("Create error:", error);
      messageApi.error(error.response?.data?.message || error.response?.data?.error || "Error adding provider");
    }
  };

  const showProvider = (providerData) => {
    setProvider(providerData);
    setEditedProvider({ ...providerData });
  };

  const goBack = () => {
    setProvider(null);
    setEditing(false);
    setAdding(false);
    setNewProvider({ name: "", email: "", phone: "" });
    setEditedProvider(null);
    setErrors({});
  };

  const editProvider = async (values) => {
    try {
      if (!values) return;
      
      const dataToUpdate = { ...values };
      delete dataToUpdate.id; // id is usually not sent in the body for updates, but in the URL
      delete dataToUpdate.created_at;
      delete dataToUpdate.updated_at;


      const response = await Providers.Update(values.id, dataToUpdate);
      if (response.success) {
        dispatch(updateProvider(response.data));
        messageApi.success("Provider updated successfully");
        goBack();
      } else {
        messageApi.error(response.message);
        console.log("Update error:", response);
        setErrors(response.errors);
      }
    } catch (error) {
      console.error("Update error:", error);
      messageApi.error(error.response?.data?.message || error.response?.data?.error || "Error updating provider");
    }
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
      className: "capitalize",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: <div className="capitalize">Details</div>,
      key: "details",
      align: "center",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <button className="btn btn-soft btn-primary btn-sm" onClick={() => showProvider({ ...record })}>
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
          <h1 className="text-2xl font-bold pb-2">Providers Management</h1>
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
            placeholder="Search by name, email, phone"
          />
        </label>
        <button className="btn btn-primary btn-sm" onClick={() => {
          setProvider(null); // Clear any selected provider
          setAdding(true);
          setEditing(true); // To enable form fields directly
        }}>
          <Plus size={16} /> Add Provider
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
      
      {/* View/Edit Provider Details Sidebar */}
      <div className={`fixed top-0 inset-0 z-[5] bg-black/50 transition-opacity duration-300 ease-in ${provider ? "opacity-100 visible" : "opacity-0 invisible"}`} />
      <aside className={`fixed top-0 z-[6] left-0 w-full h-full overflow-y-auto bg-base-100 shadow-lg p-2 sm:p-6 transform transition-transform duration-300 ease-in ${provider ? "translate-x-0" : "translate-x-full"}`}>
         {provider && editedProvider && (
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
                      title="Delete the Provider?"
                      description="Are you sure you want to delete this provider?"
                      okText="Yes"
                      cancelText="No"
                      icon={<CircleHelp size={16} className="m-1" />}
                      onConfirm={() => handleDelete(provider.id)}
                    >
                      <button className="btn btn-error btn-sm w-22">
                        <Trash2 size={16} /> Delete
                      </button>
                    </Popconfirm>
                  </div>
                </>
              ) : (
                <>
                  <button className="btn btn-secondary btn-sm w-22" onClick={() => { setEditing(false); setEditedProvider(provider); setErrors({}); }}>
                    <X size={16} /> Cancel
                  </button>
                  <Popconfirm
                    placement="bottomRight"
                    title="Save changes?"
                    description="Are you sure you want to save changes?"
                    okText="Yes"
                    cancelText="No"
                    icon={<CircleHelp size={16} className="m-1" />}
                    onConfirm={() => editProvider(editedProvider)}
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

              <div className="flex gap-2 text-2xl items-center font-semibold" ><User /><span>Provider Information</span></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  label="Name"
                  value={editedProvider?.name}
                  onChange={e => setEditedProvider({ ...editedProvider, name: e.target.value })}
                  disabled={!editing}
                  editing={editing}
                  placeholder="Enter provider name"
                  name="name"
                  className={errors?.name ? "input-error border-2" : ""}
                />
                <TextInput
                  label="Email"
                  type="email"
                  value={editedProvider?.email}
                  onChange={e => setEditedProvider({ ...editedProvider, email: e.target.value })}
                  disabled={!editing}
                  editing={editing}
                  placeholder="Enter email address"
                  name="email"
                  className={errors?.email ? "input-error border-2" : ""}
                />
                <TextInput
                  label="Phone"
                  value={editedProvider?.phone}
                  onChange={e => setEditedProvider({ ...editedProvider, phone: e.target.value })}
                  disabled={!editing}
                  editing={editing}
                  placeholder="Enter phone number"
                  name="phone"
                  className={errors?.phone ? "input-error border-2" : ""}
                />
              </div>
            </div>
          </div>
        )}
      </aside>
      
      {/* Add Provider Sidebar */}
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
                title="Add provider?"
                description="Are you sure you want to add this provider?"
                okText="Yes"
                cancelText="No"
                icon={<CircleHelp size={16} className="m-1" />}
                onConfirm={() => handleCreateProvider(newProvider)}
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
                  {Object.entries(errors).filter(([key]) => ['name', 'email', 'phone'].includes(key)).map(([key, value]) => (
                    <div key={key} onClick={() => focusInput(key)} className="btn btn-error h-fit justify-start btn-xs font-semibold">
                      <TriangleAlert size={16} />
                      {Array.isArray(value) ? value[0] : value}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 text-2xl items-center font-semibold" ><User /><span>New Provider Information</span></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput
                  label="Name"
                  value={newProvider.name}
                  onChange={e => setNewProvider({ ...newProvider, name: e.target.value })}
                  placeholder="Enter provider name"
                  name="name"
                  className={errors?.name ? "input-error border-2" : ""}
                  editing={true}
                />
                <TextInput
                  label="Email"
                  type="email"
                  value={newProvider.email}
                  onChange={e => setNewProvider({ ...newProvider, email: e.target.value })}
                  placeholder="Enter email address"
                  name="email"
                  className={errors?.email ? "input-error border-2" : ""}
                  editing={true}
                />
                <TextInput
                  label="Phone"
                  value={newProvider.phone}
                  onChange={e => setNewProvider({ ...newProvider, phone: e.target.value })}
                  placeholder="Enter phone number"
                  name="phone"
                  className={errors?.phone ? "input-error border-2" : ""}
                  editing={true}
                />
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
