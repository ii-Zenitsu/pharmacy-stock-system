import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { setPublicMedicines } from "./Redux/slices/MedicineSlice";
import Medicines from "../assets/api/Medicines";

export default function Home() {
  const { publicMedicines } = useSelector((state) => state.medicines);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const [currentDay, setCurrentDay] = useState("");

  useEffect(() => {
    const fetchData = async () => {
        const response = await Medicines.GetAllPublic();
        if (response.success) {
          dispatch(setPublicMedicines(response.data));
        }
        else {
          console.log("Failed to fetch medicines:", response.message);
        }
    };
    fetchData();
  }, []);

  const checkOpenStatus = () => {
    const now = new Date();
    const hour = now.getHours();
    setIsOpen(hour >= 8 && hour < 20);

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    setCurrentDay(days[now.getDay()]);
  };

  useEffect(() => {
    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-4 mb-4">
        <div className="text-lg sm:text-xl font-semibold text-gray-800">
          Open: 8h → 20h
        </div>
        <div
          className={`text-md sm:text-lg font-bold ${isOpen ? "text-green-600" : "text-red-600"} p-4 border-4 rounded-lg ${isOpen ? "border-green-600" : "border-red-600"} text-xl`}
          style={{ fontSize: "18px" }}
        >
          {isOpen ? "Open now" : "Closed"}
        </div>
      </div>

      {/* Working Days */}
      <div className="text-center mb-6 text-gray-600 text-md sm:text-lg">
        <div>Working days: Monday → Friday</div>
      </div>

      {/* Day */}
      <div className="text-center mb-6 text-gray-600 text-md sm:text-lg">
        Today is: <span className="font-medium">{currentDay}</span>
      </div>

      {/* Medicines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {publicMedicines.length === 0 ? (
          <div className="col-span-full text-center text-lg text-gray-600">
            No medicines available.
          </div>
        ) : (
          publicMedicines.map((med, i) => (
            <div key={i} className="border rounded-xl shadow-md p-4 bg-white">
              <img
                src={med.image || "/images/defaultPic.png"}
                alt={med.name}
                className="w-full h-40 object-contain mb-4 rounded-md"
              />
              <h2 className="text-lg font-semibold mb-2">{med.name}</h2>
              <p className="text-primary font-bold">$ {med.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
