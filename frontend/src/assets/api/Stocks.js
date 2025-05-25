import { isAxiosError } from "axios";
import { axios } from "./axios";

export default class Stocks {
  static async request(method, url, data = null, context = "Request") {
    try {
      const res = await axios({ method, url, data });
      return {
        success: true,
        data: res.data.data || res.data,
        message: res.data.message,
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

  // Get all stock entries
  static async GetAll() {
    return await this.request('get', 'stock', null, "Getting all stock entries");
  }

  // Get specific stock entry
  static async GetOne(id) {
    return await this.request('get', `stock/${id}`, null, "Fetching stock details");
  }
  
  static async Create(info) {
    return await this.request('post', 'stock', info, "Creating stock entry");
  }
  
  static async Update(id, info) {
    return await this.request('put', `stock/${id}`, info, "Updating stock entry");
  }
  
  static async Delete(id) {
    return await this.request('delete', `stock/${id}`, null, "Deleting stock entry");
  }

  static async AdjustBatchesQuantity(batches) {
    return await this.request('post', 'stock/batches-adjust', batches, "Adjusting batches quantity");
  }
}