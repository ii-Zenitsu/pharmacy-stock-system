import { isAxiosError } from "axios";
import { axios } from "./axios";

export default class Medicines {
  static async request(method, url, data = null, context = "Request") {
    try {
      const res = await axios({ method, url, data });
      return {
        success: true,
        data: res.data.data,
      };
    } catch (error) {
      return Medicines.formatError(error, context);
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
    return await this.request('get', 'medicines', null, "Getting all medicines");
  }

  static async GetOne(id) {
    return await this.request('get', `medicines/${id}`, null, "Fetching medicine details");
  }

  static async Create(info) {
    return await this.request('post', 'medicines', info, "Creating medicine");
  }

  static async Update(id, info) {
    return await this.request('post', `medicines/${id}`, info, "Updating medicine");
  }

  static async Delete(id) {
    return await this.request('delete', `medicines/${id}`, null, "Deleting medicine");
  }
  
  static async GetAllPublic() {
    return await this.request('get', 'public/medicines', null, "Getting all public medicines");
  }
  
  static async GetOnePublic(id) {
    return await this.request('get', `public/medicines/${id}`, null, "Fetching public medicine details");
  }
}