
import { useState } from "react"
import { Link } from "react-router-dom"

const Dashboard = () => {
  const [currentDate] = useState(
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  )

  // Sample data for dashboard
  const stats = [
    { title: "Total Medicines", value: "1,245", change: "+12%", icon: "pill" },
    { title: "Active Patients", value: "328", change: "+5%", icon: "users" },
    { title: "Prescriptions", value: "87", change: "+3%", icon: "clipboard" },
    { title: "Revenue", value: "$12,450", change: "+8%", icon: "dollar" },
  ]

  const recentActivities = [
    { id: 1, action: "New medicine added", item: "Amoxicillin 500mg", time: "10 minutes ago" },
    { id: 2, action: "Stock updated", item: "Paracetamol 650mg", time: "25 minutes ago" },
    { id: 3, action: "New patient registered", item: "John Smith", time: "1 hour ago" },
    { id: 4, action: "Prescription filled", item: "Sarah Johnson", time: "2 hours ago" },
    { id: 5, action: "Payment received", item: "Invoice #1234", time: "3 hours ago" },
  ]

  const lowStockItems = [
    { id: 1, name: "Lisinopril 10mg", current: 15, min: 20 },
    { id: 2, name: "Metformin 500mg", current: 8, min: 25 },
    { id: 3, name: "Atorvastatin 20mg", current: 12, min: 15 },
  ]

  return (
    <div className="min-h-screen bg-[#f8faf5]">
      {/* Header */}
      <header className="bg-white border-b border-[#6ab04c]/20 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 3C8.82 3 3 8.82 3 16C3 23.18 8.82 29 16 29C23.18 29 29 23.18 29 16C29 8.82 23.18 3 16 3Z"
              fill="#6ab04c"
            />
            <path d="M9 16C9 16 12 9 16 16C20 23 23 16 23 16" stroke="#0d5c3f" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h1 className="text-xl font-semibold text-[#0d5c3f]">
            Pharma<span className="font-bold">WISE</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button className="p-2 text-gray-500 hover:text-[#0d5c3f]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#e1f3d8] rounded-full flex items-center justify-center">
              <span className="text-[#0d5c3f] font-medium">AD</span>
            </div>
            <span className="text-sm font-medium">Admin</span>
          </div>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white h-[calc(100vh-60px)] border-r border-[#6ab04c]/20 p-4">
          <nav>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 px-3 py-2 rounded-md bg-[#e1f3d8] text-[#0d5c3f] font-medium"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/medicines"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-[#e1f3d8] hover:text-[#0d5c3f]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                  Medicines
                </Link>
              </li>
              <li>
                <Link
                  to="/patients"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-[#e1f3d8] hover:text-[#0d5c3f]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Patients
                </Link>
              </li>
              <li>
                <Link
                  to="/prescriptions"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-[#e1f3d8] hover:text-[#0d5c3f]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <path d="M14 2v6h6"></path>
                    <path d="M16 13H8"></path>
                    <path d="M16 17H8"></path>
                    <path d="M10 9H8"></path>
                  </svg>
                  Prescriptions
                </Link>
              </li>
              <li>
                <Link
                  to="/inventory"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-[#e1f3d8] hover:text-[#0d5c3f]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
                    <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
                    <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
                  </svg>
                  Inventory
                </Link>
              </li>
              <li>
                <Link
                  to="/users"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-[#e1f3d8] hover:text-[#0d5c3f]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <line x1="19" y1="8" x2="19" y2="14"></line>
                    <line x1="22" y1="11" x2="16" y2="11"></line>
                  </svg>
                  Users
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-[#e1f3d8] hover:text-[#0d5c3f]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#0d5c3f]">Dashboard</h1>
              <p className="text-gray-500">{currentDate}</p>
            </div>
            <button className="bg-[#6ab04c] text-white px-4 py-2 rounded-md flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Export Report
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-[#6ab04c]/20 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 text-sm">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-[#0d5c3f] mt-1">{stat.value}</h3>
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full mt-2 inline-block">
                      {stat.change}
                    </span>
                  </div>
                  <div className="w-10 h-10 bg-[#e1f3d8] rounded-full flex items-center justify-center">
                    {stat.icon === "pill" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0d5c3f"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path>
                        <path d="m8.5 8.5 7 7"></path>
                      </svg>
                    )}
                    {stat.icon === "users" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0d5c3f"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    )}
                    {stat.icon === "clipboard" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0d5c3f"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <path d="M12 11h4"></path>
                        <path d="M12 16h4"></path>
                        <path d="M8 11h.01"></path>
                        <path d="M8 16h.01"></path>
                      </svg>
                    )}
                    {stat.icon === "dollar" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0d5c3f"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#6ab04c]/20 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#0d5c3f]">Recent Activity</h3>
                <button className="text-sm text-[#6ab04c]">View All</button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 bg-[#e1f3d8] rounded-full flex items-center justify-center mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#0d5c3f"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
                        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium text-gray-800">{activity.action}</p>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                      <p className="text-sm text-gray-600">{activity.item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white p-6 rounded-xl border border-[#6ab04c]/20 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#0d5c3f]">Low Stock Alert</h3>
                <button className="text-sm text-[#6ab04c]">View All</button>
              </div>
              <div className="space-y-4">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="p-3 bg-red-50 border border-red-100 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-800">{item.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                            Current: {item.current}
                          </span>
                          <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                            Min: {item.min}
                          </span>
                        </div>
                      </div>
                      <button className="text-[#0d5c3f] hover:text-[#6ab04c]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14"></path>
                          <path d="M12 5v14"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                <button className="w-full py-2 text-sm text-[#0d5c3f] border border-[#6ab04c]/30 rounded-md hover:bg-[#e1f3d8]">
                  Order Inventory
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
