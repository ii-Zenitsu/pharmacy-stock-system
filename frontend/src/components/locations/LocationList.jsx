import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// Import actions and API class as needed
// import { setLocations, addLocation, updateLocation, deleteLocation } from "../Redux/slices/LocationSlice";
// import Locations from "../../assets/api/Locations";
import { Table, Spin, message, Popconfirm, Button } from "antd";
import { Plus, Edit, Trash2, ArrowRight, ArrowLeft, X, Check, CircleHelp, Loader2 } from "lucide-react";

export default function LocationList() {
  const dispatch = useDispatch();
  // const { locations, loading, error } = useSelector((state) => state.locations);
  const [location, setLocation] = useState(null);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  // Placeholder data
  const locations = []; 
  const loading = false;

  useEffect(() => {
    // Fetch locations
  }, [dispatch]);

  const handleDelete = async (id) => {
    messageApi.info(`Deleting location with id: ${id}`);
  };

  const handleCreateLocation = async (values) => {
    messageApi.info("Creating new location...");
  };

  const showLocation = (record) => {
    setLocation(record);
    setEditing(false);
    setAdding(false);
  };

  const goBack = () => {
    setLocation(null);
    setEditing(false);
    setAdding(false);
  };

  const editLocation = async (values) => {
    messageApi.info("Editing location...");
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name", align: "center" },
    { title: "Description", dataIndex: "description", key: "description", align: "center" },
    {
      title: "Details",
      key: "details",
      align: "center",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <button className="btn btn-soft btn-primary btn-sm" onClick={() => showLocation(record)}>
          <ArrowRight size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="border-sh rounded-xl overflow-hidden mx-1 md:mx-4 h-fit my-4 ">
      {contextHolder}
      <div className="flex flex-wrap justify-between items-center gap-6 my-4 px-3">
        <h1 className="text-2xl font-bold pb-2">Locations Management</h1>
        <button className="btn btn-primary btn-sm" onClick={() => { setAdding(true); setLocation({}); }}>
          <Plus size={16} /> Add Location
        </button>
      </div>
      <div className="my-4">
        <Table
          columns={columns}
          dataSource={locations}
          scroll={{ x: "max-content" }}
          rowKey="id"
          loading={{
            indicator: <Spin indicator={<Loader2 className="h-8 w-8 animate-spin text-primary" />} />,
            spinning: loading,
          }}
          pagination={{ pageSize: 10, className: "m-2", position: ["topCenter"] }}
        />
      </div>

      {(adding || (location && editing)) && (
        <aside className="fixed top-16 z-[6] left-0 w-full h-full bg-base-100 shadow-lg p-4 transform transition-transform duration-300 translate-x-0">
          <div className="flex flex-col max-w-2xl bg-base-200 w-full gap-4 mx-auto mt-16 shadow-2xl p-6 rounded-2xl">
            <h2 className="text-xl font-bold">{adding ? "Add New Location" : "Edit Location"}</h2>
            <p>Location form fields go here...</p>
            <div className="flex justify-end gap-2 mt-4">
              <button className="btn btn-secondary btn-sm" onClick={goBack}>Cancel</button>
              <button className="btn btn-primary btn-sm" onClick={adding ? () => handleCreateLocation(location) : () => editLocation(location)}>
                {adding ? "Create" : "Save"}
              </button>
            </div>
          </div>
        </aside>
      )}

      {location && !editing && !adding && (
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
                  <Popconfirm placement="bottomLeft" title="Delete this Location?" description="Are you sure?"
                    okText="Yes" cancelText="No" icon={<CircleHelp size={16} className="m-1" />}
                    onConfirm={() => handleDelete(location.id)}
                  >
                    <button className="btn btn-error btn-sm w-22">
                      <Trash2 size={16} /> Delete
                    </button>
                  </Popconfirm>
                </div>
            </div>
            <div className="flex flex-col w-full gap-6 mt-4">
              <p><strong>Name:</strong> {location.name}</p>
              <p><strong>Description:</strong> {location.description}</p>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
