import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ConfigProvider, App as AntdApp } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs';
import '@ant-design/v5-patch-for-react-19';

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setStatus } from './components/Redux/slices/AuthSlice'
import { LoggedOut, ProtectedRoute, RedirectByRole } from './lib/ProtectedRoute'

import Auth from './assets/api/Auth'
import Header from './components/Header'
import SignTabs from './components/login/Signup'
import UsersList from './components/users/UsersList';
import MedicinesList from './components/medicines/MedicinesList';
import Menu from './components/Menu';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    Auth.CheckAuth(dispatch)
      .then(result => {
        setStatus(result);
        console.log(result)
      });
    
  }, [dispatch]);

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
                }
              }
            }}
          >
            <Routes>
              <Route path='/' element={<Header />}>
                <Route index element={<h1>Home</h1>} />
                <Route path='/profile' element={<h1>Profile</h1>} />
                <Route element={<LoggedOut />}>
                  <Route path="sign" element={<SignTabs />} />
                </Route>

                <Route path='menu' element={<Menu />}>
                  {/* Admin routes */}
                  <Route element={<ProtectedRoute requiredRoles={["admin"]} />}>
                    <Route path="dashboard" element={<h1>Dashboard</h1>} />
                    <Route path="medicines" element={<MedicinesList />} />
                    <Route path="stock" element={<h1>Stock</h1>} />
                    <Route path="orders" element={<h1>Orders</h1>} />
                    <Route path="providers" element={<h1>Providers</h1>} />
                    <Route path="locations" element={<h1>Locations</h1>} />
                    <Route path="users" element={<UsersList />} />
                    <Route path="logs" element={<h1>Logs</h1>} />
                  </Route>
                  {/* Employee routes */}
                  <Route element={<ProtectedRoute requiredRoles={["employe"]} />}>
                    <Route path="dashboard" element={<h1>Dashboard</h1>} />
                    <Route path="medicines" element={<MedicinesList />} />
                    <Route path="stock" element={<h1>Stock</h1>} />
                    <Route path="locations" element={<h1>Locations</h1>} />
                  </Route>
                </Route>
                
                {/* Routes that DO NOT use the Menu layout can be outside */}
                {/* For example, if medicines list was accessible without this specific sidebar for some roles:
                <Route element={<ProtectedRoute requiredRoles={["admin", "employe"]}/>}>
                    <Route path="medicines-standalone" element={<MedicinesList />} />
                </Route>
                */}
              </Route>
            </Routes>
          </ConfigProvider>
        </StyleProvider>
      </BrowserRouter>
    </>
  )
}

export default App;