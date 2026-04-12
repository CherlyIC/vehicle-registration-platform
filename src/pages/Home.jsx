import { useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getAllVehicles } from "../services/api"
import { useAuth } from "../context/AuthContext"

function Home() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["vehicles"],
    queryFn: getAllVehicles
  })

  const vehicles = data?.data || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading vehicles...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-300 text-red-600 px-6 py-4 rounded-md">
        ⚠️ Failed to load vehicles: {error?.message || "Unknown error"}
      </div>
    )
  }

  return (
    <div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            🚗 Registered Vehicles
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Public list of all registered vehicles in the system
          </p>
        </div>
        {isAuthenticated && (
          <button
            onClick={() => navigate("/vehicle/new")}
            className="bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-800 transition"
          >
            ➕ Register Vehicle
          </button>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 inline-block">
        <p className="text-blue-700 font-semibold text-lg">
          {vehicles.length}{" "}
          <span className="font-normal text-sm">vehicles registered</span>
        </p>
      </div>
      {vehicles.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🚘</p>
          <p className="text-lg font-medium">No vehicles registered yet</p>
          <p className="text-sm mt-1">Be the first to register a vehicle</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">

              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">#</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Manufacture</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Model</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Year</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Type</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Fuel</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Color</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Vehicle Status</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Reg Status</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Plate</th>
                  {isAuthenticated && (
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">Actions</th>
                  )}
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

                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        {vehicle.vehicleType}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        {vehicle.fuelType}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-600 capitalize">
                      {vehicle.color}
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

                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                      {vehicle.plateNumber}
                    </td>

                    {isAuthenticated && (
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate(`/vehicle/${vehicle.id}`)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline"
                        >
                          View Details →
                        </button>
                      </td>
                    )}

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home