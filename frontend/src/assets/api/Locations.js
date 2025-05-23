import { isAxiosError } from "axios";
import { axios } from "./axios";

export default class Locations {
  static async request(method, url, data = null, context = "Request") {
    try {
      const res = await axios({ method, url, data });
      return {
        success: true,
        data: res.data,
        message: res.message,
      };
    } catch (error) {
      console.log(error);
      return Locations.formatError(error, context);
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
    return await this.request('get', 'locations', null, "Getting all locations");
  }

  static async GetOne(id) {
    return await this.request('get', `locations/${id}`, null, "Fetching location details");
  }

  static async Create(info) {
    return await this.request('post', 'locations', info, "Creating location");
  }

  static async Update(id, info) {
    return await this.request('put', `locations/${id}`, info, "Updating location");
  }

  static async Delete(id) {
    return await this.request('delete', `locations/${id}`, null, "Deleting location");
  }
}
