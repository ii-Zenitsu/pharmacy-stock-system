import { useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import Auth from '../assets/api/auth/Auth';
import { logout } from './Redux/slices/AuthSlice';
import { Outlet } from 'react-router-dom';
import { motion, useAnimation } from "framer-motion";
import logo from "../../public/icon.png"


export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const controls = useAnimation();
    
    const { user, token, isLoading } = useSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);
    const [color, setColor] = useState("bg-neutral text-neutral-content");
    
    const switchTab = (el) => {
      const activeTab = el?.getBoundingClientRect ? el : document.querySelector(`[data-path="${location.pathname}"]`);
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
      }
    };

    const navLinkClass = ({ isActive }) => {
      if (isActive) { switchTab()}
      return `px-3 py-2 font-semibold transition-colors duration-200 whitespace-nowrap ${isActive ? "text-primary-content hover:text-base-100": " hover:text-primary"}`;
    }

    return (
      <>
        <div className="navbar bg-base-100 shadow-sm z-[-2]">
          <NavLink className="navbar-start w-fit ml-2 mr-6 gap-2" to="/">
            <img className='h-12' src={logo} alt="" />
            <div className="text-lg font-semibold w-40">
                <span className="text-primary">Pharma</span>
                <span className="text-[#1e6f61]">WISE</span>
            </div>
          </NavLink>
          
          <div className="gap-5 hidden md:inline-flex relative z-[1]">
            <div data-path="/" onClick={e => switchTab(e.target)}><NavLink className={navLinkClass} to="/">Home</NavLink></div>
            {user?.role === "admin" && (
              <>
                <div data-path="/dashboard" onClick={e => switchTab(e.target)}><NavLink className={navLinkClass} to="/dashboard">Dashboard</NavLink></div>
                <div data-path="/medicines" onClick={e => switchTab(e.target)}><NavLink className={navLinkClass} to="/medicines">Medicines</NavLink></div>
                <div data-path="/users" onClick={e => switchTab(e.target)}><NavLink className={navLinkClass} to="/users">Users</NavLink></div>
              </>
            )}
            {user?.role === "employe" && (
              <div data-path="/medicines" onClick={e => switchTab(e.target)}><NavLink className={navLinkClass} to="/medicines">Medicines</NavLink></div>
            )}
            <motion.div className="absolute z-[-1] -top-1 rounded-full left-0 h-8 bg-primary" animate={controls} initial={{ x: 0, width: 0 }} />
          </div>
            
          <div className="navbar-end w-full">
          {!isLoading && <button className="btn btn-ghost btn-neutral btn-circle md:hidden hover:scale-105 transition-transform duration-100" onClick={() => setIsOpen(!isOpen)}><Menu/></button>}
          { isLoading ? (
              <span className="loading loading-spinner loading-md text-neutral" />
            ) : token ? (
              <div className="dropdown dropdown-end hidden md:inline-block">
                <div className='flex items-center gap-1'>
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform duration-100">
                    <div className={`hover:ring ring-offset-2 ring-neutral ring-offset-base-100 w-10 rounded-full ${color} flex! items-center justify-center text-lg font-bold`}>
                      {user.first_name[0]}{user.last_name[0]}
                    </div>
                  </div>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                  <li className='text-center font-semibold mb-2'>Welcome {user.first_name} ({user.role})</li>
                  <li><button onClick={logoutUser}>Logout</button></li>
                </ul>
              </div>
            ) : (
              <NavLink
                className={({ isActive }) => `btn btn-sm btn-neutral mx-2 hover:bg-base-100 hover:text-neutral not-md:hidden ${isActive ? "btn-active" : ""}`}
                to="/sign"
              >
                Login
              </NavLink>
            )
          }
          </div>
        </div>
        {/* sidebar */}
        <div className={`fixed inset-0 z-10 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setIsOpen(false)} />
        <aside className={`fixed top-0 z-20 left-0 w-full h-fit bg-white shadow-lg p-4 transform transition-transform duration-300 ${isOpen ? "translate-y-0" : "-translate-y-full"}`} onClick={() => setIsOpen(false)}>
          <div className='flex justify-between items-center mb-2'>
          { token &&
            <div className="btn btn-ghost btn-circle avatar hover:scale-105 transition-transform duration-100">
              <div className={`hover:ring ring-offset-2 ring-neutral ring-offset-base-100 w-10 rounded-full ${color} flex! items-center justify-center text-lg font-bold`}>
                <NavLink to="/profile">{user.first_name[0]}{user.last_name[0]}</NavLink>
              </div>
            </div>
          }
            <button className="btn btn-ghost btn-neutral btn-circle hover:scale-105 transition-transform duration-100" onClick={() => setIsOpen(false)}><X/></button>
          </div>
          <div className='flex flex-col items-center gap-2 px-2'>
            { token && <div className='text-center font-semibold mb-2'>Welcome {user.first_name} ({user.role})</div>}
              <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/">Home</NavLink>
            {user?.role === "admin" &&
              <>
                <NavLink className={({ isActive }) => `btn btn-ghost btn-primary mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/dashboard">Dashboard</NavLink>
                <NavLink className={({ isActive }) => `btn btn-ghost btn-primary mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/users">Users</NavLink>
                <NavLink className={({ isActive }) => `btn btn-ghost btn-primary mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/medicines">Medicines</NavLink>
              </>
            }
            {user?.role === "employe" &&
              <>
              <NavLink className={({ isActive }) => `btn btn-ghost btn-neutral mx-2 w-full ${isActive ? "btn-active" : ""}`} to="/medicines">Medicines</NavLink>
              </>
            }
            { token ? <button className="btn btn-outline btn-neutral mx-2 w-full mt-2" onClick={logoutUser} >Logout</button>
            : <NavLink className={({ isActive }) => `btn btn-outline btn-neutral mx-2 w-full mt-2 ${isActive ? "btn-active" : ""}`} to="/sign">Login</NavLink>}
          </div>
        </aside>
      
      <Outlet />
        

    </>
    )
    }