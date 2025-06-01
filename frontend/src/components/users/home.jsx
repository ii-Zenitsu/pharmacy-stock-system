import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setPublicMedicines } from "../Redux/slices/MedicineSlice";
import Medicines from "../../assets/api/Medicines";
import PharmacySettings from "../../assets/api/PharmacySettings";

export default function Home() {
  const { publicMedicines } = useSelector((state) => state.medicines);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [currentDay, setCurrentDay] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [specialNotes, setSpecialNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      const [medicinesResponse, statusResponse] = await Promise.all([
        Medicines.GetAllPublic(),
        PharmacySettings.GetCurrentStatus()
      ]);

      if (medicinesResponse.success) {
        dispatch(setPublicMedicines(medicinesResponse.data));
      } else {
        console.log("Failed to fetch medicines:", medicinesResponse.message);
      }

      if (statusResponse.success) {
        const { is_open, opening_hours, special_notes, current_day } = statusResponse.data;
        setIsOpen(is_open);
        setOpeningHours(opening_hours);
        setSpecialNotes(special_notes);
        setCurrentDay(current_day);
      } else {
        console.log("Failed to fetch pharmacy status:", statusResponse.message);
      }

      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await PharmacySettings.GetCurrentStatus();
      if (response.success) {
        const { is_open, opening_hours, special_notes, current_day } = response.data;
        setIsOpen(is_open);
        setOpeningHours(opening_hours);
        setSpecialNotes(special_notes);
        setCurrentDay(current_day);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

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
            {specialNotes && (
              <div className="text-sm text-green-700 mt-1">
                Note: {specialNotes}
              </div>
            )}
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
