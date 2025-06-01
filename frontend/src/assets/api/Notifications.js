import { isAxiosError } from "axios";
import { axios } from "./axios";

export default class Notifications {
  static async request(method, url, data = null, context = "Request") {
    try {
      const res = await axios({ method, url, data });
      return res.data;
    } catch (error) {
      console.log(error)
      return Notifications.formatError(error, context);
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
    return await this.request('get', 'notifications', null, "Getting all notifications");
  }

  static async GetOne(id) {
    return await this.request('get', `notifications/${id}`, null, "Fetching notification details");
  }

  static async Create(info) {
    return await this.request('post', 'notifications', info, "Creating notification");
  }

  static async Update(id, info) {
    return await this.request('put', `notifications/${id}`, info, "Updating notification");
  }

  static async Delete(id) {
    return await this.request('delete', `notifications/${id}`, null, "Deleting notification");
  }
  static async DeleteAll() {
    return await this.request('delete', 'notifications/all', null, "Deleting all notifications");
  }
}