import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Login } from "./pages/Login"
import { Navbar } from "./components/Header/Navbar"
import { Dashboard } from "./pages/Dashboard"
import { useCookies } from "react-cookie"
import { PrivateRoutes } from "./hooks/privateRoute"
import { UserDetails } from "./pages/UserDetails"

function App() {
  const [cookie, setCookie, removeCookie] = useCookies(['access_token'])
  return (
    <>
      <Router>
        {!cookie.access_token ? '' : <Navbar />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users/:_id" element={<UserDetails />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
