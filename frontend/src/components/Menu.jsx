import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Pill, Boxes, ClipboardList, Building2, MapPin, Users, FileText,
  Menu as MenuIcon,
  ChevronLeft, ChevronRight, X as XIcon
} from 'lucide-react';
import MedicinesList from './medicines/MedicinesList';
import UsersList from './users/UsersList';


const SidebarLink = ({ to, icon: Icon, children, isExpanded }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `btn btn-ghost w-full ${
          isActive ? "btn-active" : "font-normal"
        } ${isExpanded ? "justify-start" : "justify-center"}`
      }
      title={!isExpanded && typeof children === 'string' ? children : undefined}
    >
      <Icon size={18} strokeWidth={2} />
      {isExpanded && <span className="truncate transition-opacity duration-150">{children}</span>}
    </NavLink>
  </li>
);

// Renamed the original SideBar to avoid conflict with the Menu export
function InternalSideBar({ role, isExpanded, onToggleExpand, isMobileContext = false }) {
    const adminItems = [
      { to: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "medicines", icon: Pill, label: "Medicines" },
      { to: "stock", icon: Boxes, label: "Stock" },
      { to: "orders", icon: ClipboardList, label: "Orders" },
      { to: "providers", icon: Building2, label: "Providers" },
      { to: "locations", icon: MapPin, label: "Locations" },
      { to: "users", icon: Users, label: "Users" },
      { to: "logs", icon: FileText, label: "Logs" },
    ];
    const employeeItems = [
      { to: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "medicines", icon: Pill, label: "Medicines" },
      { to: "stock", icon: Boxes, label: "Stock" },
      { to: "locations", icon: MapPin, label: "Locations" },
    ];

    const menuItems = role === "admin" ? adminItems : employeeItems;

    return (
      <>
        <div className="flex items-center justify-between p-4 border-b border-[#6ab04c]/10 h-16">
          {isExpanded && <span className="text-xl font-semibold text-[#0d5c3f] whitespace-nowrap">PharmaWise</span>}
          <button
            onClick={onToggleExpand}
            className="p-1.5 rounded-md text-gray-600 hover:bg-[#e1f3d8] hover:text-[#0d5c3f]"
            aria-label={isMobileContext ? "Close sidebar" : (isExpanded ? "Collapse sidebar" : "Expand sidebar")}
          >
            {isMobileContext ? <XIcon size={20} /> : (isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />)}
          </button>
        </div>
        <nav className="flex-grow p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <SidebarLink key={item.to} to={item.to} icon={item.icon} isExpanded={isExpanded}>
                {item.label}
              </SidebarLink>
            ))}
          </ul>
        </nav>
      </>
    );
}

export default function Menu() {
    const { user } = useSelector((state) => state.auth);
    const [isDesktopSidebarExpanded, setIsDesktopSidebarExpanded] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const toggleDesktopSidebar = () => setIsDesktopSidebarExpanded(!isDesktopSidebarExpanded);
    const openMobileSidebar = () => setIsMobileSidebarOpen(true);
    const closeMobileSidebar = () => setIsMobileSidebarOpen(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) { // Tailwind's 'md' breakpoint
                setIsMobileSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const headerHeight = "4rem"; 

    return (
      <div className="flex" style={{ height: `calc(100vh - ${headerHeight})` }}>
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col bg-white border-r border-[#6ab04c]/20 transition-all duration-300 ease-in-out
            ${isDesktopSidebarExpanded ? "min-w-48" : "w-20"}
          `}
        >
          <InternalSideBar
            role={user?.role}
            isExpanded={isDesktopSidebarExpanded}
            onToggleExpand={toggleDesktopSidebar}
          />
        </aside>

        {/* Mobile Toggle Button - Appears below the main site header */}
        <button
          onClick={openMobileSidebar}
          className="md:hidden fixed left-4 p-2 bg-white rounded-md shadow-lg text-[#0d5c3f] z-40"
          style={{ top: `calc(${headerHeight} + 1rem)` }}
          aria-label="Open sidebar"
        >
          <MenuIcon size={24} />
        </button>

        {/* Mobile Sidebar (Overlay) */}
        {isMobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="md:hidden fixed inset-0 bg-black/30 z-30"
              onClick={closeMobileSidebar}
              aria-hidden="true"
            />
            {/* Sidebar Panel */}
            <aside
              className={`md:hidden fixed inset-y-0 left-0 flex flex-col bg-white border-r border-[#6ab04c]/20 w-64 z-40
                         transform transition-transform duration-300 ease-in-out
                         ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
              <InternalSideBar
                role={user?.role}
                isExpanded={true} // Mobile sidebar is always fully expanded when open
                onToggleExpand={closeMobileSidebar} // The toggle button now acts as a close button
                isMobileContext={true}
              />
            </aside>
          </>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet /> {/* Content for specific pages like MedicinesList will be rendered here */}
        </main>
      </div>
    );
}
