import { isAxiosError } from "axios";
import { axios, setBearerToken } from "./axios";
import Cookies from "js-cookie";
import { login, logout, setLoading } from '../../components/Redux/slices/AuthSlice'

export default class Auth {
  static async CheckAuth(dispatch) {
    const tokenFromCookie = Cookies.get('token');
    
    if (!tokenFromCookie) {
      dispatch(logout());
      return { initialized: true, authenticated: false };
    }

    try {
      setBearerToken(tokenFromCookie);
      const res = await this.GetUser();
      
      if (res.success && res.user) {
        dispatch(login({
          user: res.user,
          token: tokenFromCookie
        }));
        return { initialized: true, authenticated: true };
      } else {
        if (res.status === 401 || res.status === 403) {
          dispatch(logout());
          Cookies.remove('token');
          return { initialized: true, authenticated: false, error: res.message || 'Authentication token is invalid.' };
        } else {
          dispatch(setLoading(false));
          return { initialized: true, authenticated: false, error: res.message || 'Server is unreachable or encountered an error.' };
        }
      }
      
    } catch (error) {
      console.error('Failed to load user:', error);
      dispatch(logout());
      Cookies.remove('token');
      return { 
        initialized: true, 
        authenticated: false, 
        error: error.message || 'An unexpected error occurred during authentication check.'
      };
    }
  };

  static async Register(info, save = true) {
    const defaultError = {
      success: false,
      message: "Server Error",
      errors: { password: ["Something went wrong"] }
    };

    try {
      const res = await axios.post("register", info);
      if (save) {
        const { token, expires } = res.data;
        setBearerToken(token);
        Cookies.set("token", token, { expires, secure: true });
      }
      return res.data;

    } catch (error) {
      if (!isAxiosError(error)) {
        return defaultError
      }
      
      if (error.response?.status === 422) {
        return {
          ...defaultError,
          errors: error.response.data.errors,
          message: error.response.data.message
        };
      }

      return defaultError;
    }
  }

  static async Login(info) {
    const defaultError = {
      success: false,
      message: "Server Error",
      errors: { password: ["Something went wrong"] }
    };

    try {
      const res = await axios.post("login", info);
      const { token, expires } = res.data;
      
      setBearerToken(token);
      Cookies.set("token", token, { expires, secure: true });
      return res.data;
      
    } catch (error) {
      if (!isAxiosError(error)) {
        return defaultError
      }
      
      if ([400, 401, 422].includes(error.response?.status)) {
        return {
          ...defaultError,
          errors: error.response.data.errors,
          message: error.response.data.message
        };
      }

      return defaultError;
    }
  }

  static async Logout() {
    try {
      await axios.post("logout");
      Cookies.remove("token");
      setBearerToken(null);
      return { success: true, message: "Logged out successfully" };
    } catch (error) {
      return { 
        success: false, 
        message: "Something went wrong", 
        errors: { general: ["Logout failed"] } 
      };
    }
  }

  static async GetUser() {
    try {
      const res = await axios.get("user");
      return res.data;
    } catch (error) {
      return {
        success: false,
        message: isAxiosError(error) 
          ? error.response?.data?.message || "Server Error"
          : "Server Error"
      };
    }
  }
}