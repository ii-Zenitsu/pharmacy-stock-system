import { isAxiosError } from "axios";
import { axios } from "./axios";

export default class Users {
  static async request(method, url, data = null, context = "Request") {
    try {
      const res = await axios({ method, url, data });
      return res.data;
    } catch (error) {
      console.log(error)
      return Users.formatError(error, context);
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
    return await this.request('get', 'users', null, "Getting all users");
  }

  static async GetOne(id) {
    return await this.request('get', `users/${id}`, null, "Fetching user details");
  }

  static async Create(info) {
    return await this.request('post', 'users', info, "Creating user");
  }

  static async Update(id, info) {
    return await this.request('put', `users/${id}`, info, "Updating user");
  }

  static async Delete(id) {
    return await this.request('delete', `users/${id}`, null, "Deleting user");
  }
}
