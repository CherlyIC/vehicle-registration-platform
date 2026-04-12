import axios from "axios"

const api = axios.create({
  baseURL: "https://student-management-system-backend.up.railway.app",
  headers: {
    "Content-Type": "application/json"
  }
})

const getAllVehicles = () => {
  return api.get("/api/vehicle-service/vehicle")
}
const getVehicleById = (id) => {
  return api.get(`/api/vehicle-service/vehicle/${id}`)
}
const getVehicleInfo = (id) => {
  return api.get(`/api/vehicle-service/vehicle/${id}/info`)
}
const getVehicleOwner = (id) => {
  return api.get(`/api/vehicle-service/vehicle/${id}/owner`)
}
const getVehicleRegistration = (id) => {
  return api.get(`/api/vehicle-service/vehicle/${id}/registration`)
}
const getVehicleInsurance = (id) => {
  return api.get(`/api/vehicle-service/vehicle/${id}/insurance`)
}
const createVehicle = (vehicleData) => {
  return api.post("/api/vehicle-service/vehicle", vehicleData)
}
const updateVehicle = (id, vehicleData) => {
  return api.put(`/api/vehicle-service/vehicle/${id}`, vehicleData)
}

const deleteVehicle = (id) => {
  return api.delete(`/api/vehicle-service/vehicle/${id}`)
}

export {
  getAllVehicles,
  getVehicleById,
  getVehicleInfo,
  getVehicleOwner,
  getVehicleRegistration,
  getVehicleInsurance,
  createVehicle,
  updateVehicle,
  deleteVehicle
}