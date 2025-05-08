import { BrowserRouter,Route,Routes } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs';
import '@ant-design/v5-patch-for-react-19';

import { useEffect } from 'react'
import { LoggedOut, ProtectedRoute, RedirectByRole } from './lib/ProtectedRoute'
import SignTabs from './components/login/Signup'
import Auth from './assets/api/auth/Auth'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setStatus } from './components/Redux/slices/AuthSlice'
import Header from './components/Header'
import dashboard from './components/admin/dashboard'
import home from './components/admin/Header'
import medicines from './components/admin/medicines'
import internaute from './components/internaute';

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
                      <Route path="./components/admin/dashboard" element={<h1>Dashboard</h1>} />
                      <Route path="users" element={<h1>Users</h1>} />
                      <Route path="./components/admin/medicines" element={<h1>Medicines</h1>} />
                    </Route>
                    
                  {/* employe routes */}
                    <Route element={<ProtectedRoute requiredRoles={["admin", "employe"]}/>}>
                      <Route index path="medicines" element={<h1>Medicines</h1>} />
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