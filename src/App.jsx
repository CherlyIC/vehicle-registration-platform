import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"

// Placeholder pages
const Home = () => <div className="p-8 text-2xl">🏠 Home - Public Vehicle List</div>
const Login = () => <div className="p-8 text-2xl">🔐 Login Page</div>
const Dashboard = () => <div className="p-8 text-2xl">📊 Dashboard - Protected</div>
const RegisterVehicle = () => <div className="p-8 text-2xl">🚗 Register Vehicle - Protected</div>
const VehicleDetails = () => <div className="p-8 text-2xl">🔍 Vehicle Details - Protected</div>

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>

            {/* PUBLIC */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* PROTECTED */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vehicle/new"
              element={
                <ProtectedRoute>
                  <RegisterVehicle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vehicle/:id"
              element={
                <ProtectedRoute>
                  <VehicleDetails />
                </ProtectedRoute>
              }
            />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App