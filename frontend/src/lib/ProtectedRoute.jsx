import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ requiredRoles }) => {
  const {user, isLoading } = useSelector(state => state.auth);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/sign" replace />;
  }

  if (!user.email_verified_at) {
    return <Navigate to="/verify-email" replace />;
  }

  if (!requiredRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

const EmailVerifiedRoute = () => {
  const { user, isLoading } = useSelector(state => state.auth);

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/sign" replace />;
  }

  if (!user.email_verified_at) {
    return <Navigate to="/verify-email" replace />;
  }

  return <Outlet />;
};

const LoggedOut = () => {
  const { token } = useSelector(state => state.auth);

  if (token) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

const RedirectByRole = () => {
  const { user } = useSelector(state => state.auth);

  if (user?.role === 'admin') {
    return <Navigate to="/" replace />;
  }

  if (user?.role === 'employe') {
    return <Navigate to="/" replace />;
  }
  return <Navigate to="/" replace />;
};

export { ProtectedRoute, EmailVerifiedRoute, LoggedOut, RedirectByRole };