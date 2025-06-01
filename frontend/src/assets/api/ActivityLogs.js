import { isAxiosError } from "axios";
import { axios } from "./axios";

export default class ActivityLogs {
  static async request(method, url, data = null, context = "Request") {
    try {
      const res = await axios({ method, url, data });
      return res.data;
    } catch (error) {
      console.log(error)
      return ActivityLogs.formatError(error, context);
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
    return await this.request('get', 'activity-logs', null, "Getting all activity logs");
  }

  static async GetRecent() {
    return await this.request('get', 'activity-logs/recent', null, "Getting recent activity logs");
  }
}
