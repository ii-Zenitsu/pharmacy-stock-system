import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Pill, Boxes, ClipboardList, Building2, MapPin, Users, FileText,
  ChevronLeft, ChevronRight
} from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, children, isExpanded, isMobileContextLink = false, className}) => {
  if (isMobileContextLink) {
    return (
      <li className={`flex-shrink-0 ${className}`}>
        <NavLink
          to={to}
          className={({ isActive }) =>
            `btn btn-ghost p-2 text-sm
            ${isActive ? "btn-active font-semibold" : "font-normal"}`
          }
          title={children}
        >
          <Icon size={18} strokeWidth={2} />
          <span className="whitespace-nowrap">{children}</span>
        </NavLink>
      </li>
    );
  }

  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `btn btn-ghost w-full ${
            isActive ? "btn-active" : "font-normal"
          } ${isExpanded ? "justify-start" : "justify-center p-0"}`
        }
        title={!isExpanded && typeof children === 'string' ? children : undefined}
      >
        <Icon size={18} strokeWidth={2} />
        {isExpanded && <span className="truncate transition-opacity duration-150">{children}</span>}
      </NavLink>
    </li>
  );
};

function InternalSideBar({ role, isExpanded, onToggleExpand, isMobileContext = false }) {
    const adminItems = [
      { to: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "medicines", icon: Pill, label: "Medicines" },
      { to: "locations", icon: MapPin, label: "Locations" },
      { to: "users", icon: Users, label: "Users" },
      { to: "stock", icon: Boxes, label: "Stock" },
      { to: "orders", icon: ClipboardList, label: "Orders" },
      { to: "providers", icon: Building2, label: "Providers" },
      { to: "logs", icon: FileText, label: "Logs" },
    ];
    const employeeItems = [
      { to: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "medicines", icon: Pill, label: "Medicines" },
      { to: "locations", icon: MapPin, label: "Locations" },
      { to: "stock", icon: Boxes, label: "Stock" },
    ];

    const menuItems = role === "admin" ? adminItems : employeeItems;

    if (isMobileContext) {

      return (
        <div className="flex items-center justify-between px-1 pt-1 relative">
            <nav className="flex-grow overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                <ul className="flex items-center gap-1.5">
                    {menuItems.map((item, i) => (
                        <SidebarLink
                            key={item.to}
                            to={item.to}
                            icon={item.icon}
                            className={`${i === menuItems.length - 1 ? "pr-6" : ""}`}
                            isMobileContextLink={true}
                        >
                            {item.label}
                        </SidebarLink>
                    ))}
                </ul>
            </nav>
            <div className="w-16 h-full bg-gradient-to-l from-white to-transparent absolute right-0 pointer-events-none" />
        </div>
      );
    }

    return (
      <>
          <button
            onClick={onToggleExpand}
            className="p-1.5 rounded-full text-gray-600 border bg-white hover:bg-base-300 hover:cursor-pointer hover:text-[#0d5c3f] absolute right-2 top-2 sm:top-1/2 sm:-translate-y-1/2 sm:-right-4"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        <nav className="flex-grow p-3 pr-6 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <SidebarLink
                key={item.to}
                to={item.to}
                icon={item.icon}
                isExpanded={isExpanded}
                isMobileContextLink={false}
              >
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

    const toggleDesktopSidebar = () => setIsDesktopSidebarExpanded(!isDesktopSidebarExpanded);

    const headerHeight = "4rem";

    return (
      <div className="flex flex-col" style={{ height: `calc(100vh - ${headerHeight})` }}>
        <div className="md:hidden bg-white border-b border-[#6ab04c]/20 shadow-sm">
          <InternalSideBar
            role={user?.role}
            isMobileContext={true}
          />
        </div>

        <div className="flex flex-1 overflow-hidden">
          <aside
            className={`hidden md:flex flex-col relative bg-white border-r border-[#6ab04c]/20 transition-all duration-300 ease-in-out
              ${isDesktopSidebarExpanded ? "w-48" : "w-20"}
            `}
          >
            <InternalSideBar
              role={user?.role}
              isExpanded={isDesktopSidebarExpanded}
              onToggleExpand={toggleDesktopSidebar}
              isMobileContext={false}
            />
          </aside>

          <main className="flex-1 overflow-y-auto p-1 bg-gray-50">
            <Outlet />
          </main>
        </div>
      </div>
    );
}
