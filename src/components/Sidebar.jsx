import { NavLink } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Sidebar() {
  const { isAuthenticated } = useAuth()

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition ${
      isActive
        ? "bg-blue-700 text-white"
        : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
    }`

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-200 py-6 px-3 flex flex-col gap-1">
      <NavLink to="/" end className={linkClass}>
         <span>Home</span>
      </NavLink>

      {isAuthenticated && (
        <>
          <NavLink to="/dashboard" className={linkClass}>
            📊 <span>Dashboard</span>
          </NavLink>

          <NavLink to="/vehicle/new" className={linkClass}>
            ➕ <span>Register Vehicle</span>
          </NavLink>
        </>
      )}
    </aside>
  )
}

export default Sidebar