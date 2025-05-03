import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { message, Popconfirm, Modal, Form, Input, Select, Table, Spin } from "antd"
import { CircleHelp, Pencil, Trash2, Loader2, ArrowLeft, ArrowRight, X, Check, Plus } from "lucide-react"
import Users from "../../assets/api/Users"
import Fuse from "fuse.js"
import { setUsers, deleteUser, updateUser, addUser } from "../Redux/slices/UserSlice"
import { SideLogo } from "../login/Signup"
import Auth from "../../assets/api/Auth"

export default function UsersList() {
  const dispatch = useDispatch()
  const { users } = useSelector(state => state.users)
  const [user, setUser] = useState(null)
  const [editedUser, setEditedUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(true)
  const [messageApi, contextHolder] = message.useMessage()
  
  const [query, setQuery] = useState("")
  const usersFuse = new Fuse(users, { keys: ["first_name", "last_name", "email"], threshold: 0.3 })
  const items = query ? usersFuse.search(query).map(r => r.item) : users
  
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await Users.GetAll()
      if (response.success) {
        dispatch(setUsers(response.data))
      } else {
        messageApi.error(response.message)
      }
    } catch (error) {
      console.log("Error fetching Users:", error)
      messageApi.error("Failed to load Users. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id) => {
    try {
      const response = await Users.Delete(id)
      if (response.success) {
        dispatch(deleteUser(id))
        messageApi.success("User deleted successfully")
        goBack()
      } else {
        messageApi.error(response.message)
      }
    } catch (error) {
      messageApi.error("Error deleting user")
    }
  }

  const showUser = (user) => {
    setUser(user)
    setEditedUser({...user})
  }


  const goBack = () => {
    setUser(null)
    setEditing(false)
    setAdding(false)
  }

  const editUser = async (values) => {
    try {
      if (!values) return

      const response = await Users.Update(values.id, values)
      if (response.success) {
        dispatch(updateUser(response.data))
        messageApi.success("User updated successfully")
        handleModalCancel()
      } else {
        messageApi.error(response.message)
      }
    } catch (error) {
      console.error("Update error:", error)
      messageApi.error(error.response?.data?.message || error.response?.data?.error || "Error updating user")
    }
  }

  const columns = [
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      fixed: 'left',
      render: (text) => <div className="flex capitalize items-center gap-2">{text}</div>,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      render: (text) => <div className="flex capitalize items-center gap-2">{text}</div>,
    },
    {
        title: "Age",
        dataIndex: "birth_date",
        key: "age",
        width: 60,
        render: (date) => {
            if (!date) return "N/A";
            
            const birthDate = new Date(date);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) { age-- }
            return age;
        },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      className: "capitalize",
    },
    {
      title: <div className="capitalize">Details</div>,
      key: "details",
      align: "center",
      fixed: 'right',
      width: 80,
      render: (_, record) => (
          <button className="btn btn-soft btn-primary btn-sm" onClick={() => showUser({...record})}>
            <ArrowRight size={16} />
          </button>
      ),
    },
  ]

  return (
    <div className="border-sh rounded-xl overflow-hidden mx-1 md:mx-4 h-fit my-4 ">
      {contextHolder}
      <div className="flex flex-wrap justify-between items-center gap-6 my-4 px-3">
        <div className="flex gap-4">
          <h1 className="text-2xl font-bold pb-2">Users Management</h1>
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
          <Plus size={16} /> Register
        </button>
      </div>

      <div className="my-4">
        <Table
          // rowSelection={{ fixed: true }}
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
      <div className={`fixed top-16 inset-0 z-[5] bg-black/50 transition-opacity duration-300 ${user ? "opacity-100 visible" : "opacity-0 invisible"}`} />
      <aside className={`fixed top-16 z-[6] left-0 w-full h-full bg-base-100 shadow-lg p-4 transform transition-transform duration-300 ${user ? "translate-x-0" : "translate-x-full"}`}>
        {user && (
          <div className="flex flex-col max-w-2xl bg-base-200 w-full gap-4 mx-auto mt-16 shadow-2xl p-6 rounded-2xl">
            <div className="flex justify-between items-center">
              {!editing ? (
                <>
                  <button className="btn btn-secondary btn-sm" onClick={goBack} >
                    <ArrowLeft size={16} /> Back
                  </button>
                  <div className="flex gap-2">
                    <button className="btn btn-primary btn-sm w-22" onClick={() => setEditing(true)} >
                      <Pencil size={16} /> Edit
                    </button>
                    <Popconfirm placement="bottomLeft" title="Delete the User?" description="Are you sure you want to delete this User?"
                      okText="Yes" cancelText="No" icon={<CircleHelp size={16} className="m-1" />}
                      onConfirm={() => handleDelete(user.id)}
                    >
                      <button className="btn btn-error btn-sm w-22">
                        <Trash2 size={16} /> Delete
                      </button>
                    </Popconfirm>
                  </div>
                </>
              ) : (
                <>
                  <button className="btn btn-secondary btn-sm w-22" onClick={() => {setEditing(false); setUser(editedUser)}}>
                    <X size={16} /> Cancel
                  </button>
                  <Popconfirm placement="bottomRight" title="Save changes?" description="Are you sure you want to save changes?"
                      okText="Yes" cancelText="No" icon={<CircleHelp size={16} className="m-1" />}
                      onConfirm={() => editUser(user)}editUser
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
                <span className="label font-bold w-36">First Name</span>
                <input type="text" placeholder="Enter first name" className="disabled:cursor-text!" value={user.first_name} onChange={(e) => setUser({ ...user, first_name: e.target.value })} disabled={!editing}/>
              </label>

              <label className={`input w-full transition-colors duration-300 ${!editing && "cursor-text! text-base-content! border-neutral!"}`}>
                <span className="label font-bold w-36">Last Name</span>
                <input type="text" placeholder="Enter last name" className="disabled:cursor-text!" value={user.last_name} onChange={(e) => setUser({ ...user, last_name: e.target.value })} disabled={!editing}/>
              </label>

              <label className={`input w-full transition-colors duration-300 ${!editing && "cursor-text! text-base-content! border-neutral!"}`}>
                <span className="label font-bold w-36">Email</span>
                <input type="email" placeholder="Enter email" className="disabled:cursor-text!" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} disabled={!editing}/>
              </label>

              <label className={`input w-full transition-colors duration-300 ${!editing && "cursor-text! text-base-content! border-neutral!"}`}>
                <span className="label font-bold w-36">Birth Date</span>
                <input type="date" className="disabled:cursor-text!" value={user.birth_date?.split("T")[0]} onChange={(e) => setUser({ ...user, birth_date: e.target.value })} disabled={!editing} />
              </label>

              <label className={`select w-full transition-colors duration-300 ${!editing && "cursor-text! text-base-content! border-neutral!"}`}>
                <span className="label font-bold w-36">Role</span>
                <select className="disabled:cursor-text!" value={user.role} onChange={(e) => setUser({ ...user, role: e.target.value })} disabled={!editing}>
                  <option value="admin">Admin</option>
                  <option value="employe">Employe</option>
                </select>
              </label>
            </div>
          </div>
        )}
      </aside>
      <div className={`fixed top-16 inset-0 z-[5] bg-black/50 transition-opacity duration-300 ${adding ? "opacity-100 visible" : "opacity-0 invisible"}`} />
      <aside className={`fixed top-16 z-[6] left-0 w-full h-full bg-base-100 shadow-lg p-4 transform transition-transform duration-300 ${adding ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col w-fit gap-4 mx-auto mt-16 shadow-2xl">
          <SignupForm cancel={goBack}/>
        </div>
      </aside>
    </div>
  );
}

export function SignupForm({ cancel}) {
  const dispatch = useDispatch()
  const [messageApi, contextHolder] = message.useMessage()
  const [user, setUser] = useState({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      birth_date: "",
      role: "employe",
  });
  const [key, setKey] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setErrors({})
    setUser({ first_name: "", last_name: "", email: "", password: "",
      password_confirmation: "", birth_date: "", role: "employe"})
    setLoading(false)
    setKey((prevKey) => prevKey + 1);

  }
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      
      setLoading(true)
      const res = await Auth.Register(user, false);
      if (res.success) {
        dispatch(addUser(res.user))
        messageApi.success("User added successfully")
        cancel()
        resetForm()
      }
      else {
        setLoading(false);
        setErrors(res.errors)
      }
      
  };

  return (
      <div className="flex justify-center w-sm md:w-4xl gap-6 bg-base-200 border border-base-300 p-4 rounded-box">{contextHolder}
          <fieldset className="fieldset w-full md:w-1/2">
              <h2 className="font-bold text-xl">Welcome to PharmaWise</h2>
              <p className="text-sm max-w-sm mt-2">
                  Create an account to manage your pharmacy operations
              </p>
              <form key={key} className="mt-2 flex flex-col gap-1.5" onSubmit={handleSubmit} >
                  <div className="flex flex-col md:flex-row gap-2">
                      <label className="floating-label w-full not-focus:[&>span]:text-sm not-focus:[&>span]:bg-base-200">
                          <input className={`input w-full validator ${errors?.first_name ? "input-error!" : ""}`} placeholder="First name" type="text" onChange={e => setUser({ ...user, first_name: e.target.value.trim() })} value={user.first_name} required />
                          {errors?.first_name ? (<div className="text-error mb-1 text-xs">{errors?.first_name[0]}</div>) : (<div className="validator-hint mt-0 mb-1">First name is required</div>)}
                          <span className="text-xl" >First name</span>
                      </label>

                      <label className="floating-label w-full not-focus:[&>span]:text-sm not-focus:[&>span]:bg-base-200">
                          <input className={`input w-full validator ${errors?.last_name ? "input-error!" : ""}`} placeholder="Last name" type="text" onChange={e => setUser({ ...user, last_name: e.target.value.trim() })} value={user.last_name} required />
                          {errors?.last_name ? (<div className="text-error mb-1 text-xs">{errors?.last_name[0]}</div>) : (<div className="validator-hint mt-0 mb-1">Last name is required</div>)}
                          <span className="text-xl" >Last name</span>
                      </label>
                  </div>

                  <label className="floating-label w-full not-focus:[&>span]:text-sm not-focus:[&>span]:bg-base-200">
                      <input className={`input w-full validator ${errors?.email ? "input-error!" : ""}`} placeholder="Email" type="email" onChange={e => setUser({ ...user, email: e.target.value.trim() })} value={user.email} required />
                      {errors?.email ? (<div className="text-error mb-1 text-xs">{errors?.email[0]}</div>) : (<div className="validator-hint mt-0 mb-1 visible">Enter a valid email address</div>)}
                      <span className="text-xl" >Email</span>
                  </label>

                  <label className="floating-label w-full not-focus:[&>span]:text-sm not-focus:[&>span]:bg-base-200">
                      <input className={`input w-full validator ${errors?.birth_date ? "input-error!" : ""}`} type="date" onChange={e => setUser({ ...user, birth_date: e.target.value })} value={user.birth_date} required max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]} />
                      {errors?.birth_date ? (<div className="text-error mb-1 text-xs">{errors?.birth_date[0]}</div>) : (<div className="validator-hint mt-0 mb-1 visible">Enter a valid birthday date</div>)}
                      <span className="text-xl" >Birth date</span>
                  </label>


                  <div className="flex flex-col md:flex-row gap-2 mb-6">
                      <label className="floating-label w-full not-focus:[&>span]:text-sm not-focus:[&>span]:bg-base-200 relative">
                          <input className={`input w-full validator ${errors?.password ? "input-error!" : ""}`} placeholder="Password" type="password" onChange={e => setUser({ ...user, password: e.target.value })}  value={user.password} minLength={8} required />
                          <span className="text-xl" >Password</span>
                          {errors?.password ? (<div className="text-error mb-1 text-xs w-96 absolute not-md:top-22">{errors?.password[0]}</div>) : (<div className="validator-hint mt-0 mb-1 visible w-96 absolute">Password must be at least 8 characters</div>)}
                      </label>

                      <label className="floating-label w-full not-focus:[&>span]:text-sm not-focus:[&>span]:bg-base-200">
                          <input className={`input w-full validator ${errors?.password ? "input-error!" : ""}`} placeholder="Confirm Password" type="password" onChange={e => setUser({ ...user, password_confirmation: e.target.value})} value={user.password_confirmation} minLength={8} required />
                          <span className="text-xl" >Confirm Password</span>
                      </label>
                  </div>

                  <button className="btn btn-primary w-full" type="submit" > Sign Up {loading ? <Loader2 className="mt-1 animate-spin" /> : <Check className="mt-1"/>}</button>
              </form>
              <div className="divider"></div>
              <button className="btn btn-secondary btn-soft w-full" onClick={cancel}><ArrowLeft size={22} className="mt-1"/>Cancel</button>
          </fieldset>
          <SideLogo />
      </div>
  );
}