import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// Import actions and API class as needed
// import { setProviders, addProvider, updateProvider, deleteProvider } from "../Redux/slices/ProviderSlice";
// import Providers from "../../assets/api/Providers";
import { Table, Spin, message, Popconfirm, Button } from "antd"; // Assuming Ant Design is used
import { Plus, Edit, Trash2, ArrowRight, ArrowLeft, X, Check, CircleHelp, Loader2 } from "lucide-react"; // Assuming Lucide icons

export default function ProviderList() {
  const dispatch = useDispatch();
  // const { providers, loading, error } = useSelector((state) => state.providers); // Assuming 'providers' is the slice name in store
  const [provider, setProvider] = useState(null); // For viewing/editing single provider
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  // Placeholder data and columns
  const providers = []; // Replace with actual data from Redux store
  const loading = false; // Replace with actual loading state from Redux store

  useEffect(() => {
    // Fetch providers when component mounts
    // Example: dispatch(fetchProvidersAction());
  }, [dispatch]);

  const handleDelete = async (id) => {
    messageApi.info(`Deleting provider with id: ${id}`);
    // Implement delete logic
  };

  const handleCreateProvider = async (values) => {
    messageApi.info("Creating new provider...");
    // Implement create logic
  };

  const showProvider = (record) => {
    setProvider(record);
    setEditing(false);
    setAdding(false);
  };

  const goBack = () => {
    setProvider(null);
    setEditing(false);
    setAdding(false);
  };

  const editProvider = async (values) => {
    messageApi.info("Editing provider...");
    // Implement edit logic
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name", align: "center" },
    { title: "Contact Person", dataIndex: "contact_person", key: "contact_person", align: "center" },
    { title: "Email", dataIndex: "email", key: "email", align: "center" },
    { title: "Phone", dataIndex: "phone", key: "phone", align: "center" },
    {
      title: "Details",
      key: "details",
      align: "center",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <button className="btn btn-soft btn-primary btn-sm" onClick={() => showProvider(record)}>
          <ArrowRight size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="border-sh rounded-xl overflow-hidden mx-1 md:mx-4 h-fit my-4 ">
      {contextHolder}
      <div className="flex flex-wrap justify-between items-center gap-6 my-4 px-3">
        <h1 className="text-2xl font-bold pb-2">Providers Management</h1>
        <button className="btn btn-primary btn-sm" onClick={() => { setAdding(true); setProvider({}); /* Initialize for new provider */ }}>
          <Plus size={16} /> Add Provider
        </button>
      </div>
      {/* Search input can be added here */}
      <div className="my-4">
        <Table
          columns={columns}
          dataSource={providers} // Use filtered items if search is implemented
          scroll={{ x: "max-content" }}
          rowKey="id"
          loading={{
            indicator: <Spin indicator={<Loader2 className="h-8 w-8 animate-spin text-primary" />} />,
            spinning: loading,
          }}
          pagination={{ pageSize: 10, className: "m-2", position: ["topCenter"] }}
        />
      </div>

      {/* Modal/Drawer for Adding/Editing Provider */}
      {/* This is a simplified example. You might use a modal or a separate form component */}
      {(adding || (provider && editing)) && (
        <aside className="fixed top-16 z-[6] left-0 w-full h-full bg-base-100 shadow-lg p-4 transform transition-transform duration-300 translate-x-0">
          <div className="flex flex-col max-w-2xl bg-base-200 w-full gap-4 mx-auto mt-16 shadow-2xl p-6 rounded-2xl">
            <h2 className="text-xl font-bold">{adding ? "Add New Provider" : "Edit Provider"}</h2>
            {/* Form fields for provider details */}
            <p>Provider form fields go here...</p>
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-secondary btn-sm" onClick={goBack}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={adding ? () => handleCreateProvider(provider) : () => editProvider(provider)}>
                {adding ? "Create" : "Save"}
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Drawer for Viewing Provider Details */}
      {provider && !editing && !adding && (
         <aside className="fixed top-16 z-[6] left-0 w-full h-full bg-base-100 shadow-lg p-4 transform transition-transform duration-300 translate-x-0">
          <div className="flex flex-col max-w-2xl bg-base-200 w-full gap-4 mx-auto mt-16 shadow-2xl p-6 rounded-2xl">
            <div className="flex justify-between items-center">
                <button className="btn btn-secondary btn-sm" onClick={goBack} >
                  <ArrowLeft size={16} /> Back
                </button>
                <div className="flex gap-2">
                  <button className="btn btn-primary btn-sm w-22" onClick={() => setEditing(true)} >
                    <Pencil size={16} /> Edit
                  </button>
                  <Popconfirm placement="bottomLeft" title="Delete this Provider?" description="Are you sure?"
                    okText="Yes" cancelText="No" icon={<CircleHelp size={16} className="m-1" />}
                    onConfirm={() => handleDelete(provider.id)}
                  >
                    <button className="btn btn-error btn-sm w-22">
                      <Trash2 size={16} /> Delete
                    </button>
                  </Popconfirm>
                </div>
            </div>
            <div className="flex flex-col w-full gap-6 mt-4">
              <p><strong>Name:</strong> {provider.name}</p>
              <p><strong>Contact Person:</strong> {provider.contact_person}</p>
              <p><strong>Email:</strong> {provider.email}</p>
              <p><strong>Phone:</strong> {provider.phone}</p>
              <p><strong>Address:</strong> {provider.address}</p>
              {/* Display other provider details */}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
