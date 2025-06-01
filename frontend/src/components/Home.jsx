import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Pagination, ConfigProvider, Modal } from "antd";
import { setPublicMedicines } from "./Redux/slices/MedicineSlice";
import Medicines from "../assets/api/Medicines";
import { FileInput } from "./UI/MyInputs";
import { ScanBarcode } from "lucide-react";
import QRCodeScanner from "./UI/QrCodeScanner";
import defaultPic from "../assets/images/defaultPic.png";
import Fuse from "fuse.js";

export default function Home() {
  const { publicMedicines } = useSelector((state) => state.medicines);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const [currentDay, setCurrentDay] = useState("");
  const [openScanner, setOpenScanner] = useState(false);
  const days = [
    { name: "Monday", short: "Mo", open: true},
    { name: "Tuesday", short: "Tu", open: true},
    { name: "Wednesday", short: "We", open: true},
    { name: "Thursday", short: "Th", open: true},
    { name: "Friday", short: "Fr", open: true},
    { name: "Saturday", short: "Sa", open: true},
    { name: "Sunday", short: "Su", open: false}
  ];

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const medicinesPerPage = 8;

  // Search functionality
  const [query, setQuery] = useState("");
  const medicinesFuse = new Fuse(publicMedicines || [], { 
    keys: ["name", "bar_code", "formulation"], 
    threshold: 0.3 
  });
  const filteredMedicines = query && publicMedicines?.length 
    ? medicinesFuse.search(query).map((r) => r.item) 
    : publicMedicines || [];

  const indexOfLastMed = currentPage * medicinesPerPage;
  const indexOfFirstMed = indexOfLastMed - medicinesPerPage;
  const currentMedicines = filteredMedicines.slice(indexOfFirstMed, indexOfLastMed);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const setScanResult = (bar_code) => {
    setOpenScanner(false);
    
    if (!bar_code) return;
    
    const med = publicMedicines.find(m => m.bar_code === bar_code);
    if (med) {
      setQuery(bar_code);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await Medicines.GetAllPublic();
      if (response.success) {
        dispatch(setPublicMedicines(response.data));
      } else {
        console.log("Failed to fetch medicines:", response.message);
      }
    };
    fetchData();
  }, []);

  // Reset pagination when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  const checkOpenStatus = () => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    setCurrentDay(dayNames[day]);

    // Find the current day in your days array
    const currentDayObj = days.find(d => d.name === dayNames[day]);
    
    let open = false;

    if (currentDayObj && currentDayObj.open) {
      // Check if current time is within operating hours (8:00 - 16:00)
      if (hour >= 8 && hour < 16) {
        open = true;
      }
    }

    setIsOpen(open);
  };

  useEffect(() => {
    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000); // every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-2 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6 px-2 bg-base-300 p-8 rounded-2xl">
        <div className="flex flex-col justify-between items-start gap-6">
          <div className="flex items-center gap-3">
            <span className="border-2 border-neutral px-3 py-2 rounded text-neutral font-semibold text-4xl text-center">
              08:00
            </span>
            <span className="font-bold text-gray-800 text-2xl">TO</span>
            <span className="border-2 border-neutral px-3 py-2 rounded text-neutral font-semibold text-4xl text-center">
              16:00
            </span>
          </div>

          <div className="flex items-center gap-1">
            {days.map((day, idx) => (
              <div key={idx} className={`badge badge-lg rounded-sm min-h-10 min-w-10 font-semibold ${currentDay !== day.name ? 'badge-outline bg-base-100' : ''} badge-${day.open ? "secondary" : "error"} p-0! sm:px-2!`}>
                <span className="hidden sm:inline">{day.name}</span><span className="inline sm:hidden">{day.short}</span>
              </div>	
            ))}
          </div>
        </div>

        <div className={`relative text-6xl font-bold p-1 text-center ${isOpen ? "text-secondary" : "text-error"}`}>
        <div className={`absolute inset-0 rounded-full bg-${isOpen ? "secondary" : "error"} opacity-15 blur-sm`}></div>
          <span className="drop-shadow-lg bg-gradient-to-r from-current to-current bg-clip-text">
            {isOpen ? "Open Now" : "Closed Now"}
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center gap-2 items-center mb-6">
        <label className="input input-primary w-full max-w-md">
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicines by name, bar code..."
          />
        </label>
        
        <button 
          className="btn btn-accent btn-circle" 
          onClick={() => setOpenScanner(true)}
        >
          <ScanBarcode size={20} />
        </button>
      </div>

      {/* Search Results Info */}
      {query && (
        <div className="text-center mb-4 text-gray-600">
          Found {filteredMedicines.length} medicine(s) matching "{query}"
        </div>
      )}

      {/* Medicines grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {filteredMedicines.length === 0 ? (
          <div className="col-span-full text-center text-lg text-gray-600">
            {query ? "No medicines found matching your search." : "No medicines available."}
          </div>
        ) : (
          currentMedicines.map((med, i) => (
            <div key={i} className="border rounded-xl shadow-md mx-auto py-2 px-4 w-fit bg-white border-base-300">
              <div className="flex justify-center items-center h-fit">
                <FileInput
                  name="image"
                  editing={false}
                  disabled={true}
                  existingImageUrl={med.image || null}
                  defaultImage={med.image ? null : defaultPic}
                  altText={med.name}
                  className="w-full h-full"
                />
              </div>
              <h2 className="text-lg font-bold text-gray-800 mb-1">{med.name}</h2>
              <p className="text-primary font-semibold">$ {med.price}</p>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredMedicines.length > medicinesPerPage && (
        <div className="flex justify-center my-4">
          <ConfigProvider
            theme={{
              components: {
                Pagination: {
                  itemActiveBg: "#16a34a",
                  itemLinkBg: "#ffffff",
                  colorPrimary: "#ffffff",
                  colorPrimaryHover: "#15803d",
                  colorText: "#16a34a",
                  colorTextDisabled: "#9ca3af",
                  borderRadius: 8,
                }
              }
            }}
          >
            <Pagination
              current={currentPage}
              total={filteredMedicines.length}
              pageSize={medicinesPerPage}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper={false}
            />
          </ConfigProvider>
        </div>
      )}

      {/* QR Scanner Modal */}
      {openScanner && (
        <Modal
          title={<h1 className="text-xl font-bold text-center">QR Code Scanner</h1>}
          open={openScanner}
          onCancel={() => setOpenScanner(false)}
          footer={null}
        >
          <QRCodeScanner setScanResult={setScanResult} />
        </Modal>
      )}
    </div>
  );
}