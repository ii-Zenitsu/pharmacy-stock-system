import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div className="min-h-screen bg-[#f2f9e8]">
      {}
      <header className="flex justify-between items-center p-4 border-b border-[#6ab04c]/20">
        <div className="flex items-center gap-2">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 3C9.716 3 3 9.716 3 18C3 26.284 9.716 33 18 33C26.284 33 33 26.284 33 18C33 9.716 26.284 3 18 3Z"
              fill="#6ab04c"
            />
            <path
              d="M10 18C10 18 14 10 18 18C22 26 26 18 26 18"
              stroke="#0d5c3f"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <h1 className="text-xl font-semibold text-[#0d5c3f]">
            Pharma<span className="font-bold">WISE</span>
          </h1>
        </div>
        <nav className="flex gap-4">
          <Link to="/" className="bg-[#6ab04c] text-white px-4 py-2 rounded-full text-sm font-medium">
            Home
          </Link>
          <Link to="/about" className="text-[#0d5c3f] px-4 py-2 text-sm font-medium">
            About
          </Link>
          <Link to="/contact" className="text-[#0d5c3f] px-4 py-2 text-sm font-medium">
            Contact
          </Link>
          <Link to="/login" className="bg-[#0d5c3f] text-white px-4 py-2 rounded-full text-sm font-medium">
            Login
          </Link>
        </nav>
      </header>

      {}
      <section className="max-w-6xl mx-auto mt-16 px-4 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <h2 className="text-4xl font-bold text-[#0d5c3f] mb-4">
            Organize, Track And Simplify Your Pharmacy Management
          </h2>
          <p className="text-gray-700 mb-8">
            PharmaWISE provides a comprehensive solution for pharmacy operations, inventory management, and customer
            tracking.
          </p>
          <div className="flex gap-4">
            <Link to="/signup" className="bg-[#6ab04c] text-white px-6 py-3 rounded-md font-medium">
              Get Started
            </Link>
            <Link to="/demo" className="border border-[#6ab04c] text-[#0d5c3f] px-6 py-3 rounded-md font-medium">
              Request Demo
            </Link>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="bg-[#e1f3d8] p-8 rounded-xl border border-[#6ab04c]/30">
            <div className="w-full max-w-md mx-auto">
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto"
              >
                <path
                  d="M100 20C55.8 20 20 55.8 20 100C20 144.2 55.8 180 100 180C144.2 180 180 144.2 180 100C180 55.8 144.2 20 100 20Z"
                  fill="#6ab04c"
                />
                <path
                  d="M50 100C50 100 75 50 100 100C125 150 150 100 150 100"
                  stroke="#0d5c3f"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </svg>
              <h3 className="text-3xl font-bold text-[#0d5c3f] text-center mt-4">PharmaWISE</h3>
              <p className="text-center text-gray-700 mt-2">Your complete pharmacy management solution</p>
            </div>
          </div>
        </div>
      </section>

      {}
      <section className="max-w-6xl mx-auto mt-24 px-4 pb-16">
        <h2 className="text-3xl font-bold text-[#0d5c3f] text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#6ab04c]/20">
            <div className="w-12 h-12 bg-[#e1f3d8] rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5"
                  stroke="#0d5c3f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12H15M9 16H15"
                  stroke="#0d5c3f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#0d5c3f] mb-2">Inventory Management</h3>
            <p className="text-gray-600">
              Track your pharmacy inventory in real-time with automated alerts for low stock items.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#6ab04c]/20">
            <div className="w-12 h-12 bg-[#e1f3d8] rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                  stroke="#0d5c3f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                  stroke="#0d5c3f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#0d5c3f] mb-2">Patient Records</h3>
            <p className="text-gray-600">
              Maintain comprehensive patient profiles with medication history and allergies.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#6ab04c]/20">
            <div className="w-12 h-12 bg-[#e1f3d8] rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 19V13C9 11.8954 8.10457 11 7 11H5C3.89543 11 3 11.8954 3 13V19C3 20.1046 3.89543 21 5 21H7C8.10457 21 9 20.1046 9 19Z"
                  stroke="#0d5c3f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 19V5C15 3.89543 14.1046 3 13 3H11C9.89543 3 9 3.89543 9 5V19C9 20.1046 9.89543 21 11 21H13C14.1046 21 15 20.1046 15 19Z"
                  stroke="#0d5c3f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 19V9C21 7.89543 20.1046 7 19 7H17C15.8954 7 15 7.89543 15 9V19C15 20.1046 15.8954 21 17 21H19C20.1046 21 21 20.1046 21 19Z"
                  stroke="#0d5c3f"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#0d5c3f] mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600">
              Get insights into your pharmacy performance with detailed analytics and reports.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0d5c3f] text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16 3C8.82 3 3 8.82 3 16C3 23.18 8.82 29 16 29C23.18 29 29 23.18 29 16C29 8.82 23.18 3 16 3Z"
                  fill="#6ab04c"
                />
                <path
                  d="M9 16C9 16 12 9 16 16C20 23 23 16 23 16"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <h2 className="text-lg font-semibold">
                Pharma<span className="font-bold">WISE</span>
              </h2>
            </div>
            <div className="flex gap-6">
              <Link to="/terms" className="text-sm">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-sm">
                Privacy Policy
              </Link>
              <Link to="/contact" className="text-sm">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-white/70">
            &copy; {new Date().getFullYear()} PharmaWISE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
