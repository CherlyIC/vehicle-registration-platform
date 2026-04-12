import axios from "axios"

const api = axios.create({
  baseURL: "https://vehicle-registry-api.onrender.com",
  headers: {
    "Content-Type": "application/json"
  }
})

const getAllVehicles = () => {
  return api.get("/vehicle")
}

const getVehicleById = (id) => {
  return api.get(`/vehicle/${id}`)
}

const getVehicleInfo = (id) => {
  return api.get(`/vehicle/${id}/info`)
}

const getVehicleOwner = (id) => {
  return api.get(`/vehicle/${id}/owner`)
}

const getVehicleRegistration = (id) => {
  return api.get(`/vehicle/${id}/registration`)
}

const getVehicleInsurance = (id) => {
  return api.get(`/vehicle/${id}/insurance`)
}

const createVehicle = (vehicleData) => {
  return api.post("/vehicle", vehicleData)
}

const updateVehicle = (id, vehicleData) => {
  return api.put(`/vehicle/${id}`, vehicleData)
}

const deleteVehicle = (id) => {
  return api.delete(`/vehicle/${id}`)
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