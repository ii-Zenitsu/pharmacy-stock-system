import Users from "../../assets/api/Users";
import Orders from "../../assets/api/Orders";
import Stocks from "../../assets/api/Stocks";
import Medicines from "../../assets/api/Medicines";
import Providers from "../../assets/api/Providers";
import Locations from "../../assets/api/Locations";
import Notifications from "../../assets/api/Notifications";

import { setUsers } from "./slices/UserSlice";
import { setOrders } from "./slices/OrderSlice"; 
import { setLoading } from "./slices/LoadingSlice";
import { setMedicines } from "./slices/MedicineSlice";
import { setProviders } from "./slices/ProviderSlice";
import { setLocations } from "./slices/LocationSlice";
import { setStockItems } from "./slices/StockSlice";
import { setNotifications } from "./slices/NotificationSlice";


export const fetchInitialData = async (dispatch, user) => {
  const promises = [];
  const handleResponse = (res, action, endpoint) => {
    if (res.success) {
      dispatch(action(res.data));
    } else {
      console.log(`Failed to fetch data from ${endpoint}: ${res.message}`);
    }
  };
    if (user?.email_verified_at && user?.role === "admin") {
    
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
        .catch(error => { console.error("Error fetching orders:", error)})
    );
    promises.push(
      Notifications.GetAll()
        .then(res => handleResponse(res, setNotifications, "Notifications"))
        .catch(error => { console.error("Error fetching notifications:", error)})
    );
  }
  if (user?.email_verified_at && (user?.role === "admin" || user?.role === "employe")) {
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
    promises.push(
      Stocks.GetAll()
      .then(res => handleResponse(res, setStockItems, "Stocks"))
      .catch(error => { console.error("Error fetching stocks:", error)})
    );
  }

  try {
    dispatch(setLoading(true));
    await Promise.all(promises);
  } catch (error) {
    console.error("An error occurred while fetching initial data concurrently:", error);
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchVitalData = async (dispatch, user) => {
  const promises = [];
  const handleResponse = (res, action, endpoint) => {
    if (res.success) {
      dispatch(action(res.data));
    } else {
      console.log(`Failed to fetch data from ${endpoint}: ${res.message}`);
    }
  };
    if (user?.email_verified_at && user?.role === "admin") {
      promises.push(
      Orders.GetAll()
        .then(res => handleResponse(res, setOrders, "Orders"))
        .catch(error => { console.error("Error fetching orders:", error)})
    );
    promises.push(
      Notifications.GetAll()
        .then(res => handleResponse(res, setNotifications, "Notifications"))
        .catch(error => { console.error("Error fetching notifications:", error)})
    );
  }
  if (user?.email_verified_at && (user?.role === "admin" || user?.role === "employe")) {
    promises.push(
      Medicines.GetAll()
        .then(res => handleResponse(res, setMedicines, "Medicines"))
        .catch(error => { console.error("Error fetching medicines:", error)})
    );
    promises.push(
      Stocks.GetAll()
      .then(res => handleResponse(res, setStockItems, "Stocks"))
      .catch(error => { console.error("Error fetching stocks:", error)})
    );
  }

  try {
    await Promise.all(promises);
  } catch (error) {
    console.error("An error occurred while fetching vital data concurrently:", error);
  }
}