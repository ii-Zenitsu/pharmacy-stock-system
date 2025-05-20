import Medicines from "../../assets/api/Medicines";
import Providers from "../../assets/api/Providers";
import { setMedicines } from "./slices/MedicineSlice";
import { setProviders } from "./slices/ProviderSlice";


export const fetchInitialData = async (dispatch) => {

  try {
    const res = await Medicines.GetAll();
    if (res.success) {
      dispatch(setMedicines(res.data));
    } else {
      console.error("Failed to fetch medicines:", res.message);
    }
  } catch (error) {
    console.error("Error fetching medicines:", error);
  }
  
  try {
    const res = await Providers.GetAll();
    if (res.success) {
      dispatch(setProviders(res.data));
    } else {
      console.error("Failed to fetch providers:", res.message);
    }
  } catch (error) {
    console.error("Error fetching providers:", error);
  }
};