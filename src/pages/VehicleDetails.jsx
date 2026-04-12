import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  getVehicleInfo,
  getVehicleOwner,
  getVehicleRegistration,
  getVehicleInsurance
} from "../services/api"

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-500 sm:w-48 shrink-0">
        {label}
      </span>
      <span className="text-sm text-gray-800 font-medium mt-0.5 sm:mt-0">
        {value ?? "—"}
      </span>
    </div>
  )
}

function StatusBadge({ status }) {
  const colors = {
    ACTIVE: "bg-emerald-100 text-emerald-700",
    EXPIRED: "bg-red-100 text-red-600",
    SUSPENDED: "bg-orange-100 text-orange-600",
    PENDING: "bg-yellow-100 text-yellow-600",
    NEW: "bg-emerald-100 text-emerald-700",
    USED: "bg-yellow-100 text-yellow-700",
    REBUILT: "bg-purple-100 text-purple-700",
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  )
}

function TabLoader() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700 mx-auto mb-3"></div>
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  )
}

function TabError({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
      ⚠️ {message || "Failed to load data"}
    </div>
  )
}

function InfoTab({ id }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["vehicle-info", id],
    queryFn: () => getVehicleInfo(id)
  })

  if (isLoading) return <TabLoader />
  if (isError) return <TabError message="Failed to load vehicle info" />

  const info = data?.data

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-700 mb-4">
        🚗 Vehicle Technical Information
      </h3>
      <DetailRow label="Manufacture" value={info?.manufacture} />
      <DetailRow label="Model" value={info?.model} />
      <DetailRow label="Year" value={info?.year} />
      <DetailRow label="Body Type" value={info?.bodyType} />
      <DetailRow label="Color" value={info?.color} />
      <DetailRow label="Vehicle Type" value={info?.vehicleType} />
      <DetailRow label="Fuel Type" value={info?.fuelType} />
      <DetailRow label="Engine Capacity" value={info?.engineCapacity ? `${info.engineCapacity} cc` : "—"} />
      <DetailRow label="Odometer Reading" value={info?.odometerReading ? `${info.odometerReading} km` : "—"} />
      <DetailRow label="Seating Capacity" value={info?.seatingCapacity ? `${info.seatingCapacity} seats` : "—"} />
      <DetailRow label="Vehicle Purpose" value={info?.vehiclePurpose} />
      <DetailRow
        label="Vehicle Status"
        value={info?.vehicleStatus ? <StatusBadge status={info.vehicleStatus} /> : "—"}
      />
    </div>
  )
}

function OwnerTab({ id }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["vehicle-owner", id],
    queryFn: () => getVehicleOwner(id)
  })

  if (isLoading) return <TabLoader />
  if (isError) return <TabError message="Failed to load owner info" />

  const owner = data?.data

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-700 mb-4">
        👤 Owner Information
      </h3>
      <DetailRow label="Owner Name" value={owner?.ownerName} />
      <DetailRow label="Owner Type" value={owner?.ownerType} />
      <DetailRow label="National ID" value={owner?.nationalId} />
      <DetailRow label="Passport Number" value={owner?.passportNumber} />
      <DetailRow label="Company Reg Number" value={owner?.companyRegNumber} />
      <DetailRow label="Address" value={owner?.address} />
      <DetailRow label="Mobile" value={owner?.mobile} />
      <DetailRow label="Email" value={owner?.email} />
    </div>
  )
}

function RegistrationTab({ id }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["vehicle-registration", id],
    queryFn: () => getVehicleRegistration(id)
  })

  if (isLoading) return <TabLoader />
  if (isError) return <TabError message="Failed to load registration info" />

  const reg = data?.data
  const formatDate = (dateStr) => {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleDateString("en-RW", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-700 mb-4">
        📋 Registration Details
      </h3>
      <DetailRow label="Plate Number" value={
        <span className="font-mono font-bold text-blue-700">
          {reg?.plateNumber}
        </span>
      } />
      <DetailRow label="Plate Type" value={reg?.plateType} />
      <DetailRow label="Registration Date" value={formatDate(reg?.registrationDate)} />
      <DetailRow label="Expiry Date" value={formatDate(reg?.expiryDate)} />
      <DetailRow
        label="Registration Status"
        value={reg?.registrationStatus ? <StatusBadge status={reg.registrationStatus} /> : "—"}
      />
      <DetailRow label="State / Province" value={reg?.state} />
      <DetailRow label="Customs Reference" value={reg?.customsRef} />
      <DetailRow label="Proof of Ownership" value={reg?.proofOfOwnership} />
      <DetailRow label="Roadworthy Certificate" value={reg?.roadworthyCert} />
    </div>
  )
}

function InsuranceTab({ id }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["vehicle-insurance", id],
    queryFn: () => getVehicleInsurance(id)
  })

  if (isLoading) return <TabLoader />
  if (isError) return <TabError message="Failed to load insurance info" />

  const ins = data?.data

  const formatDate = (dateStr) => {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleDateString("en-RW", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-700 mb-4">
        🛡️ Insurance Details
      </h3>
      <DetailRow label="Policy Number" value={ins?.policyNumber} />
      <DetailRow label="Insurance Company" value={ins?.companyName} />
      <DetailRow label="Insurance Type" value={ins?.insuranceType} />
      <DetailRow label="Expiry Date" value={formatDate(ins?.insuranceExpiryDate)} />
      <DetailRow
        label="Insurance Status"
        value={ins?.insuranceStatus ? <StatusBadge status={ins.insuranceStatus} /> : "—"}
      />
    </div>
  )
}

function VehicleDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("info")

  const tabs = [
    { key: "info", label: "🚗 Info" },
    { key: "owner", label: "👤 Owner" },
    { key: "registration", label: "📋 Registration" },
    { key: "insurance", label: "🛡️ Insurance" },
  ]

  return (
    <div className="max-w-3xl mx-auto">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            🔍 Vehicle Details
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            ID: <span className="font-mono text-xs">{id}</span>
          </p>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
        >
          ← Back to Dashboard
        </button>
      </div>


      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap transition border-b-2 ${
                activeTab === tab.key
                  ? "border-blue-700 text-blue-700 bg-blue-50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="p-6">
          {activeTab === "info" && <InfoTab id={id} />}
          {activeTab === "owner" && <OwnerTab id={id} />}
          {activeTab === "registration" && <RegistrationTab id={id} />}
          {activeTab === "insurance" && <InsuranceTab id={id} />}
        </div>

      </div>
    </div>
  )
}

export default VehicleDetails