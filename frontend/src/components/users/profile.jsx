import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
import { Loader2, Check, X, Lock, Eye, EyeOff } from "lucide-react";
import Users from "../../assets/api/Users";
import Auth from "../../assets/api/Auth";
import { axios } from "../../assets/api/axios";

export default function UserProfile() {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector(state => state.auth);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [securityErrors, setSecurityErrors] = useState({});
  const [securityForm, setSecurityForm] = useState({
    current_password: "",
    new_password: "",
    password_confirmation: ""
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (currentUser) {
      setUser({ ...currentUser });
    }
  }, [currentUser]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const response = await axios.put('user/profile', {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        birth_date: user.birth_date
      });

      if (response.data.success) {
        messageApi.success("Profile updated successfully");
        dispatch({ type: 'auth/updateUser', payload: response.data.user });
      } else {
        setErrors(response.data.errors || {});
        messageApi.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
        messageApi.error(error.response.data.message || "Validation failed");
      } else {
        messageApi.error("An error occurred while updating profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setSecurityLoading(true);
    setSecurityErrors({});
    try {
      const response = await axios.put('user/password', {
        current_password: securityForm.current_password,
        password: securityForm.new_password,
        password_confirmation: securityForm.password_confirmation
      });

      if (response.data.success) {
        messageApi.success("Password updated successfully");
        setSecurityForm({
          current_password: "",
          new_password: "",
          password_confirmation: ""
        });
      } else {
        setSecurityErrors(response.data.errors || {});
        messageApi.error(response.data.message || "Failed to update password");
      }
    } catch (error) {
      if (error.response?.status === 422) {
        setSecurityErrors(error.response.data.errors || {});
        messageApi.error(error.response.data.message || "Validation failed");
      } else {
        messageApi.error("An error occurred while updating password");
      }
    } finally {
      setSecurityLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full px-4 md:px-8 py-6 space-y-6">
      {contextHolder}
      
      {/* Profile Section */}
      <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden max-w-5xl mx-auto">
        <div className="bg-primary text-primary-content p-6">
          <div>
            <h1 className="text-2xl font-bold">Profile Settings</h1>
            <p className="opacity-80 mt-1">Manage your personal information</p>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">First Name</span>
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full ${errors?.first_name ? "input-error" : ""}`}
                  value={user.first_name}
                  onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                />
                {errors?.first_name && (
                  <div className="label">
                    <span className="label-text-alt text-error">{errors.first_name[0]}</span>
                  </div>
                )}
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">Last Name</span>
                </div>
                <input
                  type="text"
                  className={`input input-bordered w-full ${errors?.last_name ? "input-error" : ""}`}
                  value={user.last_name}
                  onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                />
                {errors?.last_name && (
                  <div className="label">
                    <span className="label-text-alt text-error">{errors.last_name[0]}</span>
                  </div>
                )}
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">Email</span>
                </div>
                <input
                  type="email"
                  className={`input input-bordered w-full ${errors?.email ? "input-error" : ""}`}
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
                {errors?.email && (
                  <div className="label">
                    <span className="label-text-alt text-error">{errors.email[0]}</span>
                  </div>
                )}
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">Birth Date</span>
                </div>
                <input
                  type="date"
                  className={`input input-bordered w-full ${errors?.birth_date ? "input-error" : ""}`}
                  value={user.birth_date?.split("T")[0]}
                  onChange={(e) => setUser({ ...user, birth_date: e.target.value })}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                />
                {errors?.birth_date && (
                  <div className="label">
                    <span className="label-text-alt text-error">{errors.birth_date[0]}</span>
                  </div>
                )}
              </label>

              <div className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">Role</span>
                  <span className="label-text-alt text-info">(Requires admin approval to change)</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                    value={user.role}
                    disabled
                    aria-label="User role (read-only)"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div className="label">
                  <span className="label-text-alt text-base-content/70">Your role can only be changed by an administrator</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-8">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setUser({ ...currentUser })}
              >
                <X size={16} className="mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <Check size={16} className="mr-2" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-base-100 rounded-xl shadow-lg overflow-hidden max-w-5xl mx-auto">
        <div className="bg-primary text-primary-content p-6">
          <div className="flex items-center gap-2">
            <Lock size={20} />
            <div>
              <h1 className="text-2xl font-bold">Security Settings</h1>
              <p className="opacity-80 mt-1">Update your password</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">Current Password</span>
                </div>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    className={`input input-bordered w-full ${securityErrors?.current_password ? "input-error" : ""}`}
                    value={securityForm.current_password}
                    onChange={(e) => setSecurityForm({ ...securityForm, current_password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? (
                      <EyeOff size={18} className="text-base-content/50 hover:text-base-content" />
                    ) : (
                      <Eye size={18} className="text-base-content/50 hover:text-base-content" />
                    )}
                  </button>
                </div>
                {securityErrors?.current_password && (
                  <div className="label">
                    <span className="label-text-alt text-error">{securityErrors.current_password[0]}</span>
                  </div>
                )}
              </label>

              <div className="form-control w-full">
                {/* Empty div for grid alignment */}
              </div>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">New Password</span>
                </div>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    className={`input input-bordered w-full ${securityErrors?.new_password ? "input-error" : ""}`}
                    value={securityForm.new_password}
                    onChange={(e) => setSecurityForm({ ...securityForm, new_password: e.target.value })}
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? (
                      <EyeOff size={18} className="text-base-content/50 hover:text-base-content" />
                    ) : (
                      <Eye size={18} className="text-base-content/50 hover:text-base-content" />
                    )}
                  </button>
                </div>
                {securityErrors?.new_password && (
                  <div className="label">
                    <span className="label-text-alt text-error">{securityErrors.new_password[0]}</span>
                  </div>
                )}
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text font-semibold">Confirm New Password</span>
                </div>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    className={`input input-bordered w-full ${securityErrors?.password_confirmation ? "input-error" : ""}`}
                    value={securityForm.password_confirmation}
                    onChange={(e) => setSecurityForm({ ...securityForm, password_confirmation: e.target.value })}
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff size={18} className="text-base-content/50 hover:text-base-content" />
                    ) : (
                      <Eye size={18} className="text-base-content/50 hover:text-base-content" />
                    )}
                  </button>
                </div>
                {securityErrors?.password_confirmation && (
                  <div className="label">
                    <span className="label-text-alt text-error">{securityErrors.password_confirmation[0]}</span>
                  </div>
                )}
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-8">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setSecurityForm({
                  current_password: "",
                  new_password: "",
                  password_confirmation: ""
                })}
              >
                <X size={16} className="mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={securityLoading}
              >
                {securityLoading ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <Check size={16} className="mr-2" />
                )}
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
