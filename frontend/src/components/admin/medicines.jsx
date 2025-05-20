
import { useState } from "react"
import { Link } from "react-router-dom"

const Medicines = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("All")

 
  const medicines = [
    { id: 1, name: "Amoxicillin", category: "Antibiotics", stock: 120, price: 12.99, expiry: "2025-12-31" },
    { id: 2, name: "Lisinopril", category: "Cardiovascular", stock: 85, price: 15.5, expiry: "2025-10-15" },
    { id: 3, name: "Metformin", category: "Diabetes", stock: 200, price: 8.75, expiry: "2026-03-22" },
    { id: 4, name: "Atorvastatin", category: "Cardiovascular", stock: 65, price: 22.99, expiry: "2025-08-10" },
    { id: 5, name: "Albuterol", category: "Respiratory", stock: 45, price: 18.25, expiry: "2025-11-05" },
    { id: 6, name: "Omeprazole", category: "Gastrointestinal", stock: 110, price: 9.99, expiry: "2026-01-15" },
    { id: 7, name: "Levothyroxine", category: "Hormones", stock: 75, price: 14.5, expiry: "2025-09-30" },
    { id: 8, name: "Ibuprofen", category: "Pain Relief", stock: 250, price: 6.99, expiry: "2026-02-28" },
    { id: 9, name: "Cetirizine", category: "Allergy", stock: 90, price: 7.25, expiry: "2025-07-20" },
    { id: 10, name: "Sertraline", category: "Mental Health", stock: 60, price: 19.99, expiry: "2025-12-10" },
  ]

  const categories = [
    "All",
    "Antibiotics",
    "Cardiovascular",
    "Diabetes",
    "Respiratory",
    "Gastrointestinal",
    "Hormones",
    "Pain Relief",
    "Allergy",
    "Mental Health",
  ]


  const filteredMedicines = medicines.filter((medicine) => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "All" || medicine.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-[#f8faf5]">
      {}
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

      {}
      <div className="flex">
        {}
        <aside className="w-64 bg-white h-[calc(100vh-60px)] border-r border-[#6ab04c]/20 p-4">
          <nav>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/dashboard"
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

        {}
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#0d5c3f]">Medicines</h1>
              <p className="text-gray-500">Manage your pharmacy inventory</p>
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
                <path d="M12 5v14"></path>
                <path d="M5 12h14"></path>
              </svg>
              Add Medicine
            </button>
          </div>

          {}
          <div className="bg-white p-4 rounded-xl border border-[#6ab04c]/20 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search medicines..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6ab04c]/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="md:w-64">
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6ab04c]/50"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {}
          <div className="bg-white rounded-xl border border-[#6ab04c]/20 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#e1f3d8] text-[#0d5c3f]">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Expiry Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMedicines.map((medicine) => (
                    <tr key={medicine.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{medicine.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{medicine.category}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            medicine.stock < 50
                              ? "bg-red-100 text-red-700"
                              : medicine.stock < 100
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          {medicine.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">${medicine.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{medicine.expiry}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button className="p-1 text-blue-600 hover:text-blue-800">
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
                              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                              <path d="m15 5 4 4"></path>
                            </svg>
                          </button>
                          <button className="p-1 text-red-600 hover:text-red-800">
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
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            { }
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{filteredMedicines.length}</span> of{" "}
                <span className="font-medium">{medicines.length}</span> medicines
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-[#e1f3d8]">
                  Previous
                </button>
                <button className="px-3 py-1 bg-[#6ab04c] text-white rounded-md text-sm">1</button>
                <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-[#e1f3d8]">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-[#e1f3d8]">
                  3
                </button>
                <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-[#e1f3d8]">
                  Next
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Medicines
