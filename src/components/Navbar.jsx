import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link to="/" className="text-xl font-bold tracking-wide">
        🚗 VehicleReg Rwanda
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-blue-200">
              👤 {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-700 px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-100 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-white text-blue-700 px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-100 transition"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar