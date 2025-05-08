import { Link } from "react-router-dom"

const internaute = () => {
  // Sample data for medications with unique names and prices
  const medications = [
    { id: 1, name: "Amoxicillin 500mg", price: 85, category: "Antibiotics", image: "/placeholder.svg" },
    { id: 2, name: "Lisinopril 10mg", price: 120, category: "Cardiovascular", image: "/placeholder.svg" },
    { id: 3, name: "Metformin 850mg", price: 75, category: "Diabetes", image: "/placeholder.svg" },
    { id: 4, name: "Atorvastatin 20mg", price: 145, category: "Cardiovascular", image: "/placeholder.svg" },
    { id: 5, name: "Paracetamol 500mg", price: 30, category: "Pain Relief", image: "/placeholder.svg" },
    { id: 6, name: "Omeprazole 20mg", price: 95, category: "Gastrointestinal", image: "/placeholder.svg" },
    { id: 7, name: "Ibuprofen 400mg", price: 45, category: "Pain Relief", image: "/placeholder.svg" },
    { id: 8, name: "Cetirizine 10mg", price: 65, category: "Allergy", image: "/placeholder.svg" },
    { id: 9, name: "Sertraline 50mg", price: 110, category: "Mental Health", image: "/placeholder.svg" },
    { id: 10, name: "Salbutamol Inhaler", price: 130, category: "Respiratory", image: "/placeholder.svg" },
  ]

  // Pharmacy hours
  const hours = {
    open: "08:00",
    close: "16:00",
    days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    status: "Open Now",
  }

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
                  to="/medicament"
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
                    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path>
                    <path d="m8.5 8.5 7 7"></path>
                  </svg>
                  Médicament
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
              <h1 className="text-2xl font-bold text-[#0d5c3f]">Médicament</h1>
              <p className="text-gray-500">Browse available medications</p>
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
              Add Medication
            </button>
          </div>

          {/* Pharmacy Hours Banner */}
          <div className="bg-[#e9eef2] p-6 rounded-xl mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-medium">{hours.open}</div>
                  <div className="text-lg font-medium">TO</div>
                  <div className="text-lg font-medium">{hours.close}</div>
                </div>
                <div className="flex gap-1">
                  {hours.days.map((day, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-md text-sm"
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-4xl font-bold text-[#333]">{hours.status}</div>
            </div>
          </div>

          {/* Medications Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {medications.map((medication) => (
              <div
                key={medication.id}
                className="bg-white border border-[#6ab04c]/20 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <img
                    src={medication.image || "/placeholder.svg"}
                    alt={medication.name}
                    className="w-full h-full object-cover"
                    width={200}
                    height={200}
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-[#0d5c3f]">{medication.name}</h3>
                  </div>
                  <div className="mt-1 flex justify-between items-center">
                    <span className="text-xs px-2 py-1 bg-[#e1f3d8] text-[#0d5c3f] rounded-full">
                      {medication.category}
                    </span>
                    <span className="font-bold text-[#0d5c3f]">{medication.price} MAD</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export default internaute
