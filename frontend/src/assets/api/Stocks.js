import { isAxiosError } from "axios";
import { axios } from "./axios"; // Assuming axios is configured in a central file

// Note: The "Stock" entity might represent inventory levels, medicine_location data, or similar.
// The API endpoints (e.g., 'stock', 'inventory') are speculative and depend on backend implementation.

export default class Stocks {
  static async request(method, url, data = null, context = "Request") {
    try {
      const res = await axios({ method, url, data });
      return {
        success: true,
        data: res.data.data, // Assuming backend wraps data in a 'data' object
        message: res.data.message, // Assuming backend sends a message
      };
    } catch (error) {
      console.log(error);
      return Stocks.formatError(error, context);
    }
  }

  static formatError(error, context) {
    if (!isAxiosError(error)) {
      return {
        success: false,
        message: `${context} failed: Server Error`,
      };
    }

    if (error.response?.status === 422) {
      return {
        success: false,
        message: `${context} failed: ${error.response.data.message || "Validation Error"}`,
        errors: error.response.data.errors || {},
      };
    }

    return {
      success: false,
      message: `${context} failed: ${error.response?.data?.message || "Server Error"}`,
    };
  }

  // Example: Get all stock information (e.g., from medicine_location table or a dedicated stock/inventory endpoint)
  static async GetAll() {
    return await this.request('get', 'stock', null, "Getting all stock information");
    // Or, if it's medicine specific stock:
    // return await this.request('get', 'medicines/stock', null, "Getting all stock information");
  }

  // Example: Get stock details for a specific medicine or location
  // This might need a more specific endpoint or parameters
  static async GetStockDetails(params) { // params could be { medicine_id, location_id }
    // This is highly dependent on backend API design
    // Example: return await this.request('get', `stock/details`, params, "Fetching stock details");
    // Or if stock is tied to medicine:
    // static async GetStockForMedicine(medicineId) {
    // return await this.request('get', `medicines/${medicineId}/stock`, null, "Fetching stock for medicine");
    // }
    console.warn("GetStockDetails is a placeholder and needs a defined backend endpoint.");
    return { success: false, message: "Endpoint not defined" };
  }
  
  // Creating/Updating stock might be handled via medicine transactions or specific inventory adjustments
  // These are highly speculative and depend on business logic and backend implementation.

  static async AdjustStock(adjustmentInfo) {
    // Example: { medicine_id, location_id, quantity_change, reason }
    return await this.request('post', 'stock/adjust', adjustmentInfo, "Adjusting stock");
  }

  // Deleting stock records might not be a direct operation,
  // but rather a consequence of other actions (e.g., medicine deletion, zeroing out quantity).
}
