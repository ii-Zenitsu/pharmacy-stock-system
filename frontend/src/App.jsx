import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ConfigProvider, App as AntdApp } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs';
import '@ant-design/v5-patch-for-react-19';

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setStatus } from './components/Redux/slices/AuthSlice'
import { LoggedOut, ProtectedRoute, EmailVerifiedRoute, RedirectByRole } from './lib/ProtectedRoute'

import Auth from './assets/api/Auth'
import Home from './components/Home';
import Menu from './components/Menu';
import Header from './components/Header'
import SignTabs from './components/login/Signup'
import EmailVerification from './components/EmailVerification'
import UsersList from './components/users/UsersList';
import StockList from './components/stock/StockList';
import MedicinesList from './components/medicines/MedicinesList';
import LocationsList from './components/locations/LocationList';
import ProvidersList from './components/providers/ProviderList';
import OrderList from './components/orders/OrderList';
import LogList from './components/admin/LogList';
import Dashboard from './components/admin/dashboard';
import Profile from './components/Profile';
import { fetchInitialData, fetchVitalData } from './components/Redux/fetchData';

const RoleBasedRedirect = () => {
  const { user } = useSelector((state) => state.auth);
  
  if (user?.role === "admin") {
    return <Navigate to="dashboard" replace />;
  } else if (user?.role === "employe") {
    return <Navigate to="medicines" replace />;
  }
  
  return <Navigate to="medicines" replace />;
};

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(setLoading(true));
    Auth.CheckAuth(dispatch)
      .then(result => {
        setStatus(result);
      });
  }, [dispatch]);

  useEffect(() => {
    if (user) {
    fetchInitialData(dispatch, user);

      const interval = setInterval(() => {
        fetchVitalData(dispatch, user);
      }, 30000);
  
      return () => clearInterval(interval);
    }
  }, [user]);


  return (
    <>
      <BrowserRouter>
        <StyleProvider layer>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#67ae6e",
                colorInfo: "#67ae6e",
                colorSuccess: "#00aa6e",
                colorWarning: "#ffbe00",
                colorError: "#ff5860",
                borderRadius: 16,
                wireframe: false,
                colorBgContainer: "#f4fce5",
                colorBgElevated: "#d5f796"
              },
              components: {
                Table: {
                  rowHoverBg: "#d5f796",
                  headerBg: "#e1eebc",
                  headerSortActiveBg: "#d6f796c2",
                  headerSortHoverBg: "#d6f796c2",
                },
                Button: {
                  colorTextLightSolid: "rgb(0,0,0)"
                },
                Badge: {
                  colorTextLightSolid: "rgb(0,0,0)"
                },
                Checkbox: {
                  colorWhite: "rgb(0,0,0)"
                },
                Radio: {
                  buttonSolidCheckedColor: "rgb(0,0,0)"
                },
                Select: {
                  colorBorder: "rgba(0,0,0,0)",
                  activeBorderColor: "rgba(0,0,0,0)",
                  activeOutlineColor: "rgba(0,0,0,0)",
                  hoverBorderColor: "rgba(0,0,0,0)",
                  colorTextDisabled: "rgb(0,0,0)",
                  colorBgContainerDisabled: "rgba(0,0,0,0)"
                }
              }
            }}
            >
            <Routes>
              <Route path='/' element={<Header />}>
                <Route path='/' element={<Home/>} />
                {/* <Route path='/profile' element={<h1>Profile</h1>} /> */}
                <Route element={<LoggedOut />}>
                  <Route path="sign" element={<SignTabs />} />
                </Route>
                <Route path="verify-email" element={<EmailVerification />} />                <Route element={<EmailVerifiedRoute />}>
                  <Route path='menu' element={<Menu />}>
                    <Route index element={<RoleBasedRedirect />} />
                    {/* Admin and Employee routes */}
                    <Route element={<ProtectedRoute requiredRoles={["admin", "employe"]} />}>
                      <Route path="medicines" element={<MedicinesList />} />
                      <Route path="stock" element={<StockList />} />
                      <Route path="locations" element={<LocationsList />} />
                    </Route>
                    {/* Admin routes */}
                    <Route element={<ProtectedRoute requiredRoles={["admin"]} />}>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="orders" element={<OrderList />} />
                      <Route path="providers" element={<ProvidersList />} />
                      <Route path="users" element={<UsersList />} />
                      <Route path="logs" element={<LogList />} />
                    </Route>
                  </Route>
                  <Route element={<ProtectedRoute requiredRoles={["admin", "employe"]} />} >
                    <Route path="profile" element={<Profile />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </ConfigProvider>
        </StyleProvider>
      </BrowserRouter>
    </>
  )
}

export default App;