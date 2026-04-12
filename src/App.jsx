import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "./context/AuthContext"
import ProtectedRoute from "./components/ProtectedRoute"
import Layout from "./components/Layout"

import Login from "./pages/Login"
import Home from "./pages/Home"


const Dashboard = () => <div className="text-2xl font-bold text-gray-700">📊 Dashboard - Protected</div>
const RegisterVehicle = () => <div className="text-2xl font-bold text-gray-700">🚗 Register Vehicle - Protected</div>
const VehicleDetails = () => <div className="text-2xl font-bold text-gray-700">🔍 Vehicle Details - Protected</div>

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
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
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App