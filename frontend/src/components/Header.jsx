import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Bell, CircleAlert, Menu, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Auth from '../assets/api/Auth';
import { logout } from './Redux/slices/AuthSlice';
import { Outlet } from 'react-router-dom';
import { motion, useAnimation } from "framer-motion";
import logo from "../assets/images/icon.png";
import { useCart } from './hooks/useCart';
import { message, Popconfirm, Popover } from 'antd';
import Stocks from '../assets/api/Stocks';
import { adjustBatchesQuantity } from './Redux/slices/StockSlice';
import { useNotification } from './hooks/useNotification';


export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const controls = useAnimation();
    const { clear } = useCart();
    
    const { user, token, isLoading } = useSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [color, setColor] = useState("bg-neutral text-neutral-content");
    
    const switchTab = (el) => {
      const activeTab = el?.getBoundingClientRect ? el : document.querySelector(`[data-path="/${location.pathname.split('/')[1]}"]`);
      if (activeTab) {
        const { offsetLeft, offsetWidth } = activeTab;
        controls.start({
          x: offsetLeft,
          width: offsetWidth,
          transition: { type: "spring", stiffness: 500, damping: 50 },
        });
      }
    };

    useEffect(() => {
      if (user) {
        const colors = [
          "bg-info text-info-content",
          "bg-error text-error-content",
          "bg-accent text-accent-content",
          "bg-neutral text-neutral-content",
          "bg-primary text-primary-content",
          "bg-success text-success-content",
          "bg-warning text-warning-content",
          "bg-secondary text-secondary-content",
        ]
        setColor(colors[user.id % colors.length]);
      }
    }, [user]);
    
    
    const logoutUser = async () => {
      const res = await Auth.Logout();
      if (res.success) {
        dispatch(logout());
        navigate("/");
        clear();
      }
    };

    const navLinkClass = ({ isActive }) => {
      if (isActive) { switchTab()}
      return `px-3 py-2 font-semibold transition-colors duration-200 whitespace-nowrap ${isActive ? "text-primary-content hover:text-base-100": " hover:text-primary"}`;
    }

    return (
      <>
        <div className="navbar bg-base-100 border-b-2 border-base-200 z-[-2]">
          <NavLink className="navbar-start w-fit ml-2 mr-6 gap-2" to="/">
            <img className='h-12' src={logo} alt="" />
            <div className="text-lg logo font-semibold w-40">
                <span className="text-primary">Pharma</span>
                <span className="text-[#1e6f61]">WISE</span>
            </div>
          </NavLink>
          
          <div className="gap-5 hidden md:inline-flex relative z-[1]">
            <div data-path="/" onClick={e => switchTab(e.target)}><NavLink className={navLinkClass} to="/">Home</NavLink></div>

            {user && (
              <>
                <div data-path="/menu" onClick={e => switchTab(e.target)}><NavLink className={navLinkClass} to="/menu">Menu</NavLink></div>
                <div data-path="/profile" onClick={e => switchTab(e.target)}><NavLink className={navLinkClass} to="/profile">Profile</NavLink></div>
              </>
            )}
            <motion.div className="absolute z-[-1] -top-1 rounded-full left-0 h-8 bg-primary" animate={controls} initial={{ x: 0, width: 0 }} />
          </div>
            
          <div className="navbar-end w-full gap-2 sm sm:gap-4">
          { isLoading ? (
            <span className="loading loading-spinner loading-md text-neutral" />
          ) : token ? (
            <>
              {user.role === "admin" && <Notification />}
              <Cart />
              <Popconfirm title="Are you sure you want to logout?" onConfirm={logoutUser} icon={null}>
                <button className='btn btn-sm btn-neutral mx-2 hover:bg-base-100 hover:text-neutral not-sm:hidden'>Logout</button>
              </Popconfirm>
              </>
            ) : (
              <NavLink
              className={({ isActive }) => `btn btn-sm btn-neutral mx-2 hover:bg-base-100 hover:text-neutral not-md:hidden ${isActive ? "btn-active" : ""}`}
              to="/sign"
              >
                Login
              </NavLink>
            )
          }
          {!isLoading && <button className="btn btn-ghost btn-neutral btn-circle md:hidden hover:scale-105 transition-transform duration-100" onClick={() => setIsOpen(!isOpen)}><Menu/></button>}
          </div>
        </div>
        {/* sidebar */}
        <div className={`fixed inset-0 z-10 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setIsOpen(false)} />
        <aside className={`fixed top-0 z-20 left-0 w-full h-fit bg-white shadow-lg p-4 transform transition-transform duration-300 ${isOpen ? "translate-y-0" : "-translate-y-full"}`}>
          <div className='flex justify-between items-center mb-2'>
          { token &&
            <div className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform duration-100">
              <div className={`hover:ring ring-offset-2 ring-neutral ring-offset-base-100 w-10 rounded-full ${color} flex! items-center justify-center text-lg font-bold`}>
                <NavLink to="/profile" onClick={() => setIsOpen(false)}>{user.first_name[0]}{user.last_name[0]}</NavLink>
              </div>
            </div>
          }
            <button className="btn btn-ghost btn-neutral btn-circle hover:scale-105 transition-transform duration-100" onClick={() => setIsOpen(false)}><X/></button>
          </div>
          <div className='flex flex-col items-center gap-2 px-2'>
            { token && <div className='text-center font-semibold mb-2'>Welcome {user.first_name} ({user.role})</div>}
            <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/" onClick={() => setIsOpen(false)}>Home</NavLink>
            
            {user && (
              <>
                <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/menu" onClick={() => setIsOpen(false)}>Menu</NavLink>
                <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/profile" onClick={() => setIsOpen(false)}>Profile</NavLink>
              </>
            )}
            
            { token ? (
              <button className="btn btn-outline btn-neutral mx-2 w-full mt-2" onClick={logoutUser}>Logout</button>
            ) : (
              <NavLink className={({ isActive }) => `btn btn-outline btn-neutral mx-2 w-full mt-2 ${isActive ? "btn-active" : ""}`} to="/sign" onClick={() => setIsOpen(false)}>Login</NavLink>
            )}
          </div>
        </aside>
      
      <Outlet />
        

    </>
    )
    }

function Cart() {
  const { cartItems, totalItems, totalPrice, totalItemPrice, loading, error, removeItem, updateQuantity, increment, decrement, clear, isAtMaxQuantity } = useCart();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const checkout = async () => {
      try {
        const response = await Stocks.AdjustBatchesQuantity(cartItems);
        if (response.success) {
          dispatch(adjustBatchesQuantity(response.data));
          messageApi.success("Checkout successful!");
          clear();
          setOpen(false);
        } else {
          messageApi.error(response.message);
        }
      } catch (error) {
        messageApi.error("Checkout failed. Please try again.");
      }
    };

  const handleQuantityChange = (id, quantity) => {
    const numQuantity = parseInt(quantity);
    if (numQuantity > 0) {
      updateQuantity(id, numQuantity);
    } else {
      removeItem(id);
    }
  };

  const content =
  loading ? (<div className="p-4 text-center"><span className="loading loading-spinner loading-sm"></span><p className="text-sm mt-2">Loading cart...</p></div>
  ) : error ? (<div className="p-4 text-center text-error"><p className="text-sm">Error: {error}</p></div>
  ) : (
    <div className="w-80 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between p-3 border-b">
        <h2 className="font-semibold">Your Cart ({totalItems})</h2>
        {cartItems.length > 0 && (
          <button
            onClick={clear}
            className="btn btn-error btn-xs"
          >
            Clear All
          </button>
        )}
      </div>
      
      {cartItems.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <ShoppingBag className="mx-auto mb-2 opacity-50" size={32} />
          <p className="text-sm">Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="p-2 space-y-2">
            {cartItems.map((cartItem) => (
              <div key={cartItem.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex-1">
                  <h3 className="text-sm font-medium">{cartItem.name}</h3>
                  <p className="text-xs text-gray-600">{cartItem.price} × {cartItem.quantity}</p>
                  <p className="text-xs font-semibold text-secondary">{totalItemPrice(cartItem.id).toFixed(2)} MAD</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => decrement(cartItem.id)}
                    className="btn btn-circle btn-xs btn-outline"
                  >
                    <Minus size={10} />
                  </button>
                  <input
                    type="number"
                    value={cartItem.quantity}
                    onChange={(e) => handleQuantityChange(cartItem.id, e.target.value)}
                    className="input input-xs w-12 text-center"
                    min="1"
                  />
                  <button
                    onClick={() => increment(cartItem.id)}
                    className="btn btn-circle btn-xs btn-outline"
                    disabled={isAtMaxQuantity(cartItem.id)}
                  >
                    <Plus size={10} />
                  </button>
                  <button
                    onClick={() => removeItem(cartItem.id)}
                    className="btn btn-circle btn-xs btn-error ml-1"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t rounded-b-lg">
            <div className="flex justify-between items-center font-semibold">
              <span className='self-end'>Total:<span className="text-lg text-secondary align- ml-2">{totalPrice.toFixed(2)} MAD</span></span>
              <button className="btn btn-primary btn-sm" onClick={checkout}>Checkout</button>
            </div>
          </div>
        </>
      )}
    </div>
  )


  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      placement="bottomRight"
      content={content}
      color='#e1eebc'
    >{contextHolder}
      <button className="btn btn-ghost btn-accent btn-circle hover:ring ring-offset-2 ring-neutral ring-offset-base-100 hover:scale-105 transition-transform duration-100 relative">
        <ShoppingBag />
        {totalItems > 0 && (
          <span className="badge badge-sm badge-primary absolute -top-1 -right-2">{totalItems}</span>
        )}
      </button>
    </Popover>
  );
}

function Notification(){
  const { notifications, loading, error, fetchAll, deleteOne, clearAll, getCount } = useNotification();
  const [open, setOpen] = useState(false);
  const [loadings, setLoadings] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
      fetchAll();
  }, []);

  const handleDeleteOne = async (id) => {
    setLoadings((prev) => {
      const newLoadings = [...prev];
      newLoadings[id] = true;
      return newLoadings;
    });
    await deleteOne(id);
    setLoadings((prev) => {
      const newLoadings = [...prev];
      newLoadings[id] = false;
      return newLoadings;
    });
  };

  const handleClearAll = async () => {
    setLoadings((prev) => {
      const newLoadings = [...prev];
      newLoadings[0] = true;
      return newLoadings;
    });
    await clearAll();
    setLoadings((prev) => {
      const newLoadings = [...prev];
      newLoadings[0] = false;
      return newLoadings;
    });
  };

  const content = loading ? (
    <div className="p-4 text-center"><span className="loading loading-spinner loading-sm"></span><p className="text-sm mt-2">Loading notifications...</p></div>
  ) : error ? (
    <div className="p-4 text-center text-error"><p className="text-sm">Error: {error}</p></div>
  ) : (
    <div className="w-80 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between p-3 border-b">
        <h2 className="font-semibold">Notifications ({getCount()})</h2>
        {notifications.length > 0 && (
          <button
            onClick={handleClearAll}
            className="btn btn-error btn-xs"
            disabled={loadings[0]}
          >
            Clear All {loadings[0] && <span className="loading loading-spinner loading-xs"></span>}
          </button>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <Bell className="mx-auto mb-2 opacity-50" size={32} />
          <p className="text-sm">No notifications</p>
        </div>
      ) : (
        <div className="p-2 space-y-2">
          {notifications.map((n) => {
            const message = `${n.title} at ${n.location}`
            const date = `${new Date(n.created_at).toLocaleDateString()} ${new Date(n.created_at).toLocaleTimeString()}`
            return (
            <div key={n.id} className="flex items-center justify-between p-1.5 border rounded">
              <div className="flex-1">
                <h3 className="text-sm font-medium">{n.medicine}<span className='badge badge-warning badge-xs font-extrabold ml-2 px-1'>{n.title}</span></h3>
                <p className="text-xs text-gray-600 mt-1" title={`${message} for ${n.medicine} on ${date}`}>{message}</p>
                <p className="text-xs text-gray-400 mt-1">{date}</p>
              </div>
              <button className="btn btn-circle btn-xs btn-error ml-2" disabled={loadings[n.id]} onClick={() => handleDeleteOne(n.id)}>
                {loadings[n.id] ? <span className="loading loading-spinner loading-xs"></span> : <X size={20} />}
              </button>
            </div>
          )}
          )}
        </div>
      )}
    </div>
  )

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger="click"
      placement="bottomRight"
      content={content}
      color='#e1eebc'
    >
      {contextHolder}
      <button className="btn btn-ghost btn-warning btn-circle hover:ring ring-offset-2 ring-neutral ring-offset-base-100 hover:scale-105 transition-transform duration-100 relative">
        <Bell />
        {getCount() > 0 && (
          <span className="badge badge-sm badge-warning absolute -top-1 -right-2">{getCount()}</span>
        )}
      </button>
    </Popover>
  );
}
