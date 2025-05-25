import { useSelector } from "react-redux";
import Medicines from "../../assets/api/Medicines";
import Providers from "../../assets/api/Providers";
import { setMedicines } from "./slices/MedicineSlice";
import { setProviders } from "./slices/ProviderSlice";
import { setLocations } from "./slices/LocationSlice";
import { setOrders } from "./slices/OrderSlice"; 
import Locations from "../../assets/api/Locations";
import Users from "../../assets/api/Users";
import { setUsers } from "./slices/UserSlice";
import Orders from "../../assets/api/Orders";


export const fetchInitialData = async (dispatch, user) => {
  const promises = [];
  const handleResponse = (res, action, endpoint) => {
    if (res.success) {
      dispatch(action(res.data));
    } else {
      console.log(`Failed to fetch data from ${endpoint}: ${res.message}`);
    }
  };
  
  if (user?.role === "admin") {
    
    promises.push(
      Providers.GetAll()
        .then(res => handleResponse(res, setProviders, "Providers"))
        .catch(error => { console.error("Error fetching providers:", error)})
    );
    promises.push(
      Users.GetAll()
      .then(res => handleResponse(res, setUsers, "Users"))
      .catch(error => { console.error("Error fetching users:", error)})
    );
      promises.push(
      Orders.GetAll()
        .then(res => handleResponse(res, setOrders, "Orders"))
        .catch(error => { console.error("Error fetching orders:", error) }) // ⬅️ ajout ici
    );
  }
  if (user?.role === "admin" || user?.role === "employe") {
    promises.push(
      Medicines.GetAll()
        .then(res => handleResponse(res, setMedicines, "Medicines"))
        .catch(error => { console.error("Error fetching medicines:", error)})
    );
    promises.push(
      Locations.GetAll()
        .then(res => handleResponse(res, setLocations, "Locations"))
        .catch(error => { console.error("Error fetching locations:", error)})
    );
  }

  try {
    await Promise.all(promises);
  } catch (error) {
    console.error("An error occurred while fetching initial data concurrently:", error);
  }
};