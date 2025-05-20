import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Locations from "../../assets/api/Locations";
import { fetchInitialData } from "../Redux/fetchData";
import { deleteLocation, updateLocation, addLocation } from "../Redux/slices/LocationSlice";

import { message, Popconfirm, Table, Spin } from "antd";
import { CircleHelp, Pencil, Trash2, Loader2, ArrowLeft, ArrowRight, X, Check, Plus, Info, TriangleAlert, MapPin } from "lucide-react";
import Fuse from "fuse.js";
import { TextInput } from "../UI/MyInputs";

export default function LocationList() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { locations } = useSelector((state) => state.locations);
  const [location, setLocation] = useState(null);
  const [editedLocation, setEditedLocation] = useState(null);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [messageApi, contextHolder] = message.useMessage();
  const [pageSize, setPageSize] = useState(window.innerWidth <= 768 ? 8 : 6);

  const [query, setQuery] = useState("");
  const locationsFuse = new Fuse(locations, { keys: ["name", "description"], threshold: 0.3 });
  const items = query ? locationsFuse.search(query).map((r) => r.item) : locations;

  useEffect(() => {
    if (location || adding) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [location, adding]);

  useEffect(() => {
    const fetchData = async () => {
      if (!locations.length) {
        await fetchInitialData(dispatch, user);
      }
      setLoading(false);
    };
    fetchData();
  }, [dispatch, locations.length]); 

  const handleDelete = async (id) => {
    try {
      const response = await Locations.Delete(id);
      if (response.success) {
        dispatch(deleteLocation(id));
        messageApi.success("Location deleted successfully");
        goBack();
      } else {
        messageApi.error(response.message);
      }
    } catch (error) {
      messageApi.error("Error deleting location");
    }
  };

  const handleCreateLocation = async (values) => {
    try {
      if (!values) return;
      
      const response = await Locations.Create(values);
      if (response.success) {
        dispatch(addLocation(response.data));
        messageApi.success("Location added successfully");
        goBack();
      } else {
        messageApi.error(response.message);
        setErrors(response.errors);
      }
    } catch (error) {
      console.error("Create error:", error);
      messageApi.error(error.response?.data?.message || error.response?.data?.error || "Error adding location");
    }
  };

  const showLocation = (locationData) => {
    setLocation(locationData);
    setEditedLocation({ ...locationData });
  };

  const goBack = () => {
    setLocation(null);
    setEditing(false);
    setAdding(false);
    setNewLocation({ name: "", description: "" });
    setEditedLocation(null);
    setErrors({});
  };

  const editLocation = async (values) => {
    try {
      if (!values) return;
      
      const dataToUpdate = { ...values };
      delete dataToUpdate.id; 
      delete dataToUpdate.created_at;
      delete dataToUpdate.updated_at;

      const response = await Locations.Update(values.id, dataToUpdate);
      if (response.success) {
        dispatch(updateLocation(response.data));
        messageApi.success("Location updated successfully");
        goBack();
      } else {
        messageApi.error(response.message);
        setErrors(response.errors);
      }
    } catch (error) {
      console.error("Update error:", error);
      messageApi.error(error.response?.data?.message || error.response?.data?.error || "Error updating location");
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
      title: "Description",
      dataIndex: "description",
      key: "description",
      align: "center",
    },
    {
      title: <div className="capitalize">Details</div>,
      key: "details",
      align: "center",
      fixed: "right",
      width: 80,
      render: (_, record) => (
        <button className="btn btn-soft btn-primary btn-sm" onClick={() => showLocation({ ...record })}>
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
          <h1 className="text-2xl font-bold pb-2">Locations Management</h1>
        </div>
      </div>
      <div className="flex justify-between gap-8 items-center mt-8">
        <label className="input input-primary input-sm">
          <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" className="grow" onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, description" />
        </label>
        <button className="btn btn-primary btn-sm" onClick={() => { setLocation(null); setAdding(true); setEditing(true); }}>
          <Plus size={16} /> Add Location
        </button>
      </div>

      <div className="my-2">
        <Table
          rowSelection={{fixed: true, columnWidth: 50}}
          columns={columns}
          dataSource={items}
          scroll={{ x: "max-content" }}
          rowKey="id"
          loading={{ indicator: <Spin indicator={<Loader2 className="h-8 w-8 animate-spin text-primary" />} />, spinning: loading }}
          pagination={{ pageSize: pageSize, pageSizeOptions: [6, 12, 24, 50], className: "m-2", position: ["topCenter"], showSizeChanger: true, onShowSizeChange: (c, size) => {setPageSize(size);} }}
        />
      </div>
      
      {/* View/Edit Location Details Sidebar */}
      <div className={`fixed top-0 inset-0 z-[5] bg-black/50 transition-opacity duration-300 ease-in ${location ? "opacity-100 visible" : "opacity-0 invisible"}`} />
      <aside className={`fixed top-0 z-[6] left-0 w-full h-full overflow-y-auto bg-base-100 shadow-lg p-2 sm:p-6 transform transition-transform duration-300 ease-in ${location ? "translate-x-0" : "translate-x-full"}`}>
         {location && editedLocation && (
          <div className="flex flex-col bg-base-200 w-full h-full gap-4 mx-auto shadow-2xl p-2 sm:p-6 rounded-2xl">
            <div className="flex justify-between items-center">
              {!editing ? (
                <>
                  <button className="btn btn-secondary btn-sm" onClick={goBack}> <ArrowLeft size={16} /> Back </button>
                  <div className="flex gap-2">
                    <button className="btn btn-primary btn-sm w-22" onClick={() => setEditing(true)}> <Pencil size={16} /> Edit </button>
                    <Popconfirm placement="bottomLeft" title="Delete the Location?" description="Are you sure you want to delete this location?" okText="Yes" cancelText="No" icon={<CircleHelp size={16} className="m-1" />} onConfirm={() => handleDelete(location.id)}>
                      <button className="btn btn-error btn-sm w-22"> <Trash2 size={16} /> Delete </button>
                    </Popconfirm>
                  </div>
                </>
              ) : (
                <>
                  <button className="btn btn-secondary btn-sm w-22" onClick={() => { setEditing(false); setEditedLocation(location); setErrors({}); }}> <X size={16} /> Cancel </button>
                  <Popconfirm placement="bottomRight" title="Save changes?" description="Are you sure you want to save changes?" okText="Yes" cancelText="No" icon={<CircleHelp size={16} className="m-1" />} onConfirm={() => editLocation(editedLocation)}>
                    <button className="btn btn-primary btn-sm w-22"> <Check size={16} /> Save </button>
                  </Popconfirm>
                </>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:gap-6 mt-4">
              {errors && Object.keys(errors).length > 0 && (
                <div className="flex flex-col gap-1.5 mb-4">
                  {Object.entries(errors).map(([key, value]) => (
                    <div key={key} onClick={() => focusInput(key)} className="btn btn-error h-fit justify-start btn-xs font-semibold">
                      <TriangleAlert size={16} /> {Array.isArray(value) ? value[0] : value}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 text-2xl items-center font-semibold" ><MapPin /><span>Location Information</span></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput label="Name" value={editedLocation?.name} onChange={e => setEditedLocation({ ...editedLocation, name: e.target.value })} disabled={!editing} editing={editing} placeholder="Enter location name" name="name" className={`sm:col-span-2 ${errors?.name ? "input-error border-2" : ""}`} />
                <TextInput label="Description" value={editedLocation?.description} onChange={e => setEditedLocation({ ...editedLocation, description: e.target.value })} disabled={!editing} editing={editing} placeholder="Enter description (optional)" name="description" className={`sm:col-span-2 ${errors?.description ? "input-error border-2" : ""}`} />
              </div>
            </div>
          </div>
        )}
      </aside>
      
      {/* Add Location Sidebar */}
      <div className={`fixed top-0 inset-0 z-[5] bg-black/50 transition-opacity duration-300 ease-in ${adding ? "opacity-100 visible" : "opacity-0 invisible"}`} />
      <aside className={`fixed top-0 z-[6] left-0 w-full h-full overflow-y-auto bg-base-100 shadow-lg p-2 sm:p-6 transform transition-transform duration-300 ease-in ${adding ? "translate-x-0" : "translate-x-full"}`}>
        {adding && (
          <div className="flex flex-col bg-base-200 w-full h-full gap-4 mx-auto shadow-2xl p-2 sm:p-6 rounded-2xl">
            <div className="flex justify-between items-center">
              <button className="btn btn-secondary btn-sm" onClick={goBack}> <ArrowLeft size={16} /> Back </button>
              <Popconfirm placement="bottomRight" title="Add location?" description="Are you sure you want to add this location?" okText="Yes" cancelText="No" icon={<CircleHelp size={16} className="m-1" />} onConfirm={() => handleCreateLocation(newLocation)}>
                <button className="btn btn-primary btn-sm w-22"> <Check size={16} /> Save </button>
              </Popconfirm>
            </div>
            <div className="flex flex-col gap-3 sm:gap-6 mt-4">
              {errors && Object.keys(errors).length > 0 && (
                <div className="flex flex-col gap-1.5 mb-4">
                  {Object.entries(errors).filter(([key]) => ['name', 'description'].includes(key)).map(([key, value]) => (
                    <div key={key} onClick={() => focusInput(key)} className="btn btn-error h-fit justify-start btn-xs font-semibold">
                      <TriangleAlert size={16} /> {Array.isArray(value) ? value[0] : value}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2 text-2xl items-center font-semibold" ><MapPin /><span>New Location Information</span></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <TextInput label="Name" value={newLocation.name} onChange={e => setNewLocation({ ...newLocation, name: e.target.value })} placeholder="Enter location name" name="name" className={`sm:col-span-2 ${errors?.name ? "input-error border-2" : ""}`} editing={true} />
                <TextInput label="Description" value={newLocation.description} onChange={e => setNewLocation({ ...newLocation, description: e.target.value })} placeholder="Enter description (optional)" name="description" className={`sm:col-span-2 ${errors?.description ? "input-error border-2" : ""}`} editing={true} />
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
