import { BrowserRouter,Route,Routes } from 'react-router-dom'
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
             
              <Route path='/' element={<Header/>}>
                <Route index element={<h1 >Home</h1>} />
              
                <Route element={<LoggedOut />}>
                  <Route index path="sign" element={<SignTabs />} />
                </Route>

                {/* redirect user to default page */}
                {/* <Route index element={<RedirectByRole />} /> */}

                  {/* admin routes */}
                    <Route element={<ProtectedRoute requiredRoles={["admin"]} />}>
                      <Route path="dashboard" element={<h1>Dashboard</h1>} />
                      <Route path="users" element={<UsersList />} />
                    </Route>
                    
                  {/* employe routes */}
                    <Route element={<ProtectedRoute requiredRoles={["admin", "employe"]}/>}>
                      <Route index path="medicines" element={<MedicinesList />} />
                    </Route>
              </Route>
            </Routes>
          </ConfigProvider>
        </StyleProvider>
      </BrowserRouter>
    </>
  )
}

export default App