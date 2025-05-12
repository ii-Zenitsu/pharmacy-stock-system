import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import defaultPic from "../../assets/images/defaultPic.png";

export default function Home() {
  const { medicines } = useSelector((state) => state.medicines);
  const [isOpen, setIsOpen] = useState(true);
  const [currentDay, setCurrentDay] = useState("");

  // Fonction pour vérifier si la pharmacie est ouverte
  const checkOpenStatus = () => {
    const now = new Date();
    const hour = now.getHours();
    setIsOpen(hour >= 8 && hour < 20);

    // Obtenir le jour actuel en anglais
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    setCurrentDay(days[now.getDay()]);
  };

  useEffect(() => {
    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60 * 1000); // mise à jour chaque minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-b pb-4 mb-4">
        <div className="text-lg sm:text-xl font-semibold text-gray-800">
          Open: 8h → 20h
        </div>
        <div className={`text-md sm:text-lg font-bold ${isOpen ? "text-green-600" : "text-red-600"}`}>
          {isOpen ? "Open now" : "Closed"}
        </div>
      </div>

      {/* Day */}
      <div className="text-center mb-6 text-gray-600 text-md sm:text-lg">
        Today is: <span className="font-medium">{currentDay}</span>
      </div>

      {/* Medicines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {medicines.map((med) => (
          <div key={med.id} className="border rounded-xl shadow-md p-4 bg-white">
            <img
              src={med.image || defaultPic}
              alt={med.name}
              className="w-full h-40 object-contain mb-4 rounded-md"
            />
            <h2 className="text-lg font-semibold mb-2">{med.name}</h2>
            <p className="text-primary font-bold">$ {med.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
