import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setPublicMedicines } from "./Redux/slices/MedicineSlice";
import Medicines from "../assets/api/Medicines";

export default function Home() {
  const { publicMedicines } = useSelector((state) => state.medicines);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const [currentDay, setCurrentDay] = useState("");
  const [openingHours, setOpeningHours] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const medicinesPerPage = 6;

  const indexOfLastMed = currentPage * medicinesPerPage;
  const indexOfFirstMed = indexOfLastMed - medicinesPerPage;
  const currentMedicines = publicMedicines.slice(indexOfFirstMed, indexOfLastMed);
  const totalPages = Math.ceil(publicMedicines.length / medicinesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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

  const checkOpenStatus = () => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    setCurrentDay(days[day]);

    let open = false;
    let hours = "";

    if (day >= 1 && day <= 6) {
      // Monday to Saturday
      if (hour >= 8 && hour < 13) {
        open = true;
      }
      hours = "08:00 - 13:00";
    } else {
      // Sunday closed
      open = false;
      hours = "Closed";
    }

    setIsOpen(open);
    setOpeningHours(hours);
  };

  useEffect(() => {
    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000); // every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6">
        {/* Opening hours */}
        <div className="flex items-center gap-4 bg-green-50 border border-green-300 px-6 py-4 rounded-lg shadow-sm">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-green-800 text-base font-medium">
            Opening Hours: <span className="font-bold">{openingHours}</span>
          </div>
        </div>

        {/* Open/Closed */}
        <div
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-sm border text-base ${
            isOpen
              ? "bg-green-100 text-green-700 border-green-300"
              : "bg-red-100 text-red-700 border-red-300"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            )}
          </svg>
          {isOpen ? "Open Now" : "Closed Now"}
        </div>
      </div>

      {/* Working days info */}
      <div className="text-center text-green-700 text-lg mb-2">
        🗓️ <span className="font-medium">Open Monday to Saturday (08:00 - 13:00)</span>
      </div>

      {/* Current day */}
      <div className="text-center text-gray-600 text-base mb-6">
        Today is <span className="font-semibold">{currentDay}</span>
      </div>

      {/* Medicines grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {publicMedicines.length === 0 ? (
          <div className="col-span-full text-center text-lg text-gray-600">
            No medicines available.
          </div>
        ) : (
          currentMedicines.map((med, i) => (
            <div key={i} className="border rounded-xl shadow-md p-4 bg-white border-green-300">
              <img
                src={med.image || "/images/defaultPic.png"}
                alt={med.name}
                className="w-full h-40 object-contain mb-4 rounded"
              />
              <h2 className="text-lg font-bold text-gray-800 mb-1">{med.name}</h2>
              <p className="text-green-600 font-semibold">$ {med.price}</p>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded-lg border font-medium ${
                currentPage === i + 1
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-green-600 border-green-300 hover:bg-green-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
