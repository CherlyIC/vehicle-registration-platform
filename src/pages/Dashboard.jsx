import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getAllVehicles, deleteVehicle } from "../services/api"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"

function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    vehicleId: null,
    vehicleName: ""
  })

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getAllVehicles
  })

  const vehicles = data?.data || []

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteVehicle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] })
      toast.success("Vehicle deleted successfully!")
      setDeleteModal({ isOpen: false, vehicleId: null, vehicleName: "" })
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error?.message}`)
      setDeleteModal({ isOpen: false, vehicleId: null, vehicleName: "" })
    }
  })

  const handleDeleteClick = (vehicle) => {
    setDeleteModal({
      isOpen: true,
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.manufacture} ${vehicle.model}`
    })
  }

  const handleConfirmDelete = () => {
    deleteMutation.mutate(deleteModal.vehicleId)
  }

  const totalVehicles = vehicles.length
  const electricVehicles = vehicles.filter(v => v.fuelType === "ELECTRIC").length
  const suvVehicles = vehicles.filter(v => v.vehicleType === "SUV").length
  const activeRegistrations = vehicles.filter(v => v.registrationStatus === "ACTIVE").length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-300 text-red-600 px-6 py-4 rounded-md">
        ⚠️ Failed to load dashboard: {error?.message}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          👋 Welcome back,{" "}
          <span className="text-blue-700">{user?.email}</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here's an overview of all registered vehicles
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-500 font-medium">Total Vehicles</p>
          <p className="text-3xl font-bold text-blue-700 mt-1">{totalVehicles}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-500 font-medium">Electric</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{electricVehicles}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-500 font-medium">SUVs</p>
          <p className="text-3xl font-bold text-purple-600 mt-1">{suvVehicles}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-500 font-medium">Active Registrations</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{activeRegistrations}</p>
        </div>

      </div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Vehicle Management</h2>
        <button
          onClick={() => navigate("/vehicle/new")}
          className="bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-800 transition"
        >
          ➕ Register New Vehicle
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">#</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Manufacture</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Model</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Year</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Plate</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Vehicle Status</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Reg Status</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Insurance</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {vehicles.map((vehicle, index) => (
                <tr key={vehicle.id} className="hover:bg-gray-50 transition">

                  <td className="px-4 py-3 text-gray-400">{index + 1}</td>

                  <td className="px-4 py-3 font-medium text-gray-800">
                    {vehicle.manufacture}
                  </td>

                  <td className="px-4 py-3 text-gray-600">{vehicle.model}</td>

                  <td className="px-4 py-3 text-gray-600">{vehicle.year}</td>

                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                    {vehicle.plateNumber}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      vehicle.vehicleStatus === "NEW"
                        ? "bg-emerald-100 text-emerald-700"
                        : vehicle.vehicleStatus === "USED"
                        ? "bg-yellow-100 text-yellow-700"
                        : vehicle.vehicleStatus === "REBUILT"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {vehicle.vehicleStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      vehicle.registrationStatus === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-700"
                        : vehicle.registrationStatus === "EXPIRED"
                        ? "bg-red-100 text-red-600"
                        : vehicle.registrationStatus === "SUSPENDED"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {vehicle.registrationStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      vehicle.insuranceStatus === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-700"
                        : vehicle.insuranceStatus === "EXPIRED"
                        ? "bg-red-100 text-red-600"
                        : vehicle.insuranceStatus === "SUSPENDED"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {vehicle.insuranceStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/vehicle/${vehicle.id}`)}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/vehicle/${vehicle.id}?edit=true`)}
                        className="text-yellow-600 hover:text-yellow-800 text-xs font-medium hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(vehicle)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">

            <h3 className="text-lg font-bold text-gray-800 mb-2">
              🗑️ Delete Vehicle
            </h3>

            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-red-600">
                {deleteModal.vehicleName}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal({ isOpen: false, vehicleId: null, vehicleName: "" })}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default Dashboard