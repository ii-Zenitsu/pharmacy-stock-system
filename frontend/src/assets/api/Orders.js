import { isAxiosError } from "axios";
import { axios } from "./axios";

export default class Orders {
  static async request(method, url, data = null, context = "Request") {
    try {
      const res = await axios({ method, url, data });
      return {
        success: true,
        data: res.data.data,
        message: res.data.message,
      };
    } catch (error) {
      console.log(error);
      return Orders.formatError(error, context);
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

  static async GetAll() {
    return await this.request('get', 'orders', null, "Getting all orders");
  }

  static async GetOne(id) {
    return await this.request('get', `orders/${id}`, null, "Fetching order details");
  }

  static async Create(info) {
    return await this.request('post', 'orders', info, "Creating order");
  }


}



















































































