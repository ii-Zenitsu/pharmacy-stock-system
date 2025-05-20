import { isAxiosError } from "axios";
import { axios } from "./axios";

export default class Providers {
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
      return Providers.formatError(error, context);
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
    return await this.request('get', 'providers', null, "Getting all providers");
  }

  static async GetOne(id) {
    return await this.request('get', `providers/${id}`, null, "Fetching provider details");
  }

  static async Create(info) {
    return await this.request('post', 'providers', info, "Creating provider");
  }

  static async Update(id, info) {
    return await this.request('put', `providers/${id}`, info, "Updating provider");
  }

  static async Delete(id) {
    return await this.request('delete', `providers/${id}`, null, "Deleting provider");
  }
}
