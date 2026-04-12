import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { createVehicle } from "../services/api"
import { step1Schema, step2Schema, step3Schema } from "../schemas/vehicleSchema"
import toast from "react-hot-toast"

function FormField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {children}
      {error && (
        <p className="text-red-500 text-xs mt-0.5">⚠️ {error}</p>
      )}
    </div>
  )
}


const inputClass = (error) =>
  `border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${
    error
      ? "border-red-400 focus:ring-red-300"
      : "border-gray-300 focus:ring-blue-500 focus:border-transparent"
  }`


function StepIndicator({ currentStep }) {
  const steps = [
    { number: 1, label: "Vehicle Info" },
    { number: 2, label: "Owner Info" },
    { number: 3, label: "Registration" },
  ]

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">

          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition ${
              currentStep === step.number
                ? "bg-blue-700 text-white"
                : currentStep > step.number
                ? "bg-emerald-500 text-white"
                : "bg-gray-200 text-gray-500"
            }`}>
              {currentStep > step.number ? "✓" : step.number}
            </div>
            <span className={`text-xs mt-1 font-medium ${
              currentStep === step.number ? "text-blue-700" : "text-gray-400"
            }`}>
              {step.label}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div className={`w-24 h-1 mx-2 mb-4 rounded transition ${
              currentStep > step.number ? "bg-emerald-500" : "bg-gray-200"
            }`} />
          )}

        </div>
      ))}
    </div>
  )
}

function RegisterVehicle() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({})
  const schemas = { 1: step1Schema, 2: step2Schema, 3: step3Schema }

  const {
    register,     
    handleSubmit,   
    formState: { errors }, 
    watch,
  } = useForm({
    resolver: zodResolver(schemas[currentStep]),
    mode: "onChange"  
  })

 
  const ownerType = watch("ownerType")

  const createMutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] })
      toast.success("Vehicle registered successfully! 🎉")
      navigate("/dashboard")
    },
    onError: (error) => {
      const serverErrors = error?.response?.data?.errors
      if (serverErrors && Array.isArray(serverErrors)) {
        serverErrors.forEach(err => toast.error(err.message || err))
      } else {
        toast.error(error?.response?.data?.message || "Failed to register vehicle")
      }
    }
  })

  const handleNext = handleSubmit((data) => {
    setFormData(prev => ({ ...prev, ...data }))
    setCurrentStep(prev => prev + 1)
  })

const handleFinalSubmit = handleSubmit((data) => {
  const allData = { ...formData, ...data }

  const formattedData = {
    ...allData,
    companyRegNumber: allData.companyRegNumber || "",
    registrationDate: new Date(allData.registrationDate).toISOString(),
    expiryDate: new Date(allData.expiryDate).toISOString(),
    insuranceExpiryDate: new Date(allData.insuranceExpiryDate).toISOString(),
  }

  console.log("Submitting formatted data:", JSON.stringify(formattedData, null, 2))
  createMutation.mutate(formattedData)
})

  return (
    <div className="max-w-2xl mx-auto">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">🚗 Register New Vehicle</h1>
        <p className="text-gray-500 text-sm mt-1">
          Fill in all details carefully across the 3 steps
        </p>
      </div>
      <StepIndicator currentStep={currentStep} />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

        {currentStep === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-5">
              🚗 Step 1 — Vehicle Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <FormField label="Manufacture" error={errors.manufacture?.message}>
                <input
                  {...register("manufacture")}
                  placeholder="e.g. Toyota"
                  className={inputClass(errors.manufacture)}
                />
              </FormField>

              <FormField label="Model" error={errors.model?.message}>
                <input
                  {...register("model")}
                  placeholder="e.g. Corolla"
                  className={inputClass(errors.model)}
                />
              </FormField>

              <FormField label="Year" error={errors.year?.message}>
                <input
                  {...register("year", { valueAsNumber: true })}
                  type="number"
                  placeholder="e.g. 2022"
                  className={inputClass(errors.year)}
                />
              </FormField>

              <FormField label="Vehicle Type" error={errors.vehicleType?.message}>
                <select {...register("vehicleType")} className={inputClass(errors.vehicleType)}>
                  <option value="">Select type...</option>
                  {["ELECTRIC","SUV","TRUCK","MOTORCYCLE","BUS","VAN","PICKUP","OTHER"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Body Type" error={errors.bodyType?.message}>
                <input
                  {...register("bodyType")}
                  placeholder="e.g. Sedan"
                  className={inputClass(errors.bodyType)}
                />
              </FormField>

              <FormField label="Color" error={errors.color?.message}>
                <input
                  {...register("color")}
                  placeholder="e.g. White"
                  className={inputClass(errors.color)}
                />
              </FormField>

              <FormField label="Fuel Type" error={errors.fuelType?.message}>
                <select {...register("fuelType")} className={inputClass(errors.fuelType)}>
                  <option value="">Select fuel type...</option>
                  {["PETROL","DIESEL","ELECTRIC","HYBRID","GAS","OTHER"].map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Engine Capacity (cc)" error={errors.engineCapacity?.message}>
                <input
                  {...register("engineCapacity", { valueAsNumber: true })}
                  type="number"
                  placeholder="e.g. 1800"
                  className={inputClass(errors.engineCapacity)}
                />
              </FormField>

              <FormField label="Odometer Reading (km)" error={errors.odometerReading?.message}>
                <input
                  {...register("odometerReading", { valueAsNumber: true })}
                  type="number"
                  placeholder="e.g. 45000"
                  className={inputClass(errors.odometerReading)}
                />
              </FormField>

              <FormField label="Seating Capacity" error={errors.seatingCapacity?.message}>
                <input
                  {...register("seatingCapacity", { valueAsNumber: true })}
                  type="number"
                  placeholder="e.g. 5"
                  className={inputClass(errors.seatingCapacity)}
                />
              </FormField>

              <FormField label="Vehicle Purpose" error={errors.vehiclePurpose?.message}>
                <select {...register("vehiclePurpose")} className={inputClass(errors.vehiclePurpose)}>
                  <option value="">Select purpose...</option>
                  {["PERSONAL","COMMERCIAL","TAXI","GOVERNMENT"].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Vehicle Status" error={errors.vehicleStatus?.message}>
                <select {...register("vehicleStatus")} className={inputClass(errors.vehicleStatus)}>
                  <option value="">Select status...</option>
                  {["NEW","USED","REBUILT"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </FormField>

            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-5">
              👤 Step 2 — Owner Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <FormField label="Owner Name" error={errors.ownerName?.message}>
                <input
                  {...register("ownerName")}
                  placeholder="e.g. Jean Pierre Habimana"
                  className={inputClass(errors.ownerName)}
                />
              </FormField>

              <FormField label="Owner Type" error={errors.ownerType?.message}>
                <select {...register("ownerType")} className={inputClass(errors.ownerType)}>
                  <option value="">Select owner type...</option>
                  {["INDIVIDUAL","COMPANY","NGO","GOVERNMENT"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="National ID (16 digits)" error={errors.nationalId?.message}>
                <input
                  {...register("nationalId")}
                  placeholder="e.g. 1199880012345678"
                  maxLength={16}
                  className={inputClass(errors.nationalId)}
                />
              </FormField>

              <FormField label="Passport Number (optional)" error={errors.passportNumber?.message}>
                <input
                  {...register("passportNumber")}
                  placeholder="e.g. PC1234567"
                  className={inputClass(errors.passportNumber)}
                />
              </FormField>

              {ownerType === "COMPANY" && (
                <FormField label="Company Reg Number" error={errors.companyRegNumber?.message}>
                  <input
                    {...register("companyRegNumber")}
                    placeholder="e.g. RWA/2023/00123"
                    className={inputClass(errors.companyRegNumber)}
                  />
                </FormField>
              )}

              <FormField label="Address" error={errors.address?.message}>
                <input
                  {...register("address")}
                  placeholder="e.g. KG 123 St, Kigali"
                  className={inputClass(errors.address)}
                />
              </FormField>

              <FormField label="Mobile (10 digits)" error={errors.mobile?.message}>
                <input
                  {...register("mobile")}
                  placeholder="e.g. 0788123456"
                  maxLength={10}
                  className={inputClass(errors.mobile)}
                />
              </FormField>

              <FormField label="Email" error={errors.email?.message}>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="e.g. jean@example.rw"
                  className={inputClass(errors.email)}
                />
              </FormField>

            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-5">
              📋 Step 3 — Registration & Insurance
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <FormField label="Plate Number" error={errors.plateNumber?.message}>
                <input
                  {...register("plateNumber")}
                  placeholder="e.g. RAB 123 A"
                  className={inputClass(errors.plateNumber)}
                />
              </FormField>

              <FormField label="Plate Type" error={errors.plateType?.message}>
                <select {...register("plateType")} className={inputClass(errors.plateType)}>
                  <option value="">Select plate type...</option>
                  {["PRIVATE","COMMERCIAL","GOVERNMENT","DIPLOMATIC","PERSONALIZED"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Registration Date" error={errors.registrationDate?.message}>
                <input
                  {...register("registrationDate")}
                  type="date"
                  className={inputClass(errors.registrationDate)}
                />
              </FormField>

              <FormField label="Expiry Date" error={errors.expiryDate?.message}>
                <input
                  {...register("expiryDate")}
                  type="date"
                  className={inputClass(errors.expiryDate)}
                />
              </FormField>

              <FormField label="Registration Status" error={errors.registrationStatus?.message}>
                <select {...register("registrationStatus")} className={inputClass(errors.registrationStatus)}>
                  <option value="">Select status...</option>
                  {["ACTIVE","SUSPENDED","EXPIRED","PENDING"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="State/Province" error={errors.state?.message}>
                <input
                  {...register("state")}
                  placeholder="e.g. Kigali"
                  className={inputClass(errors.state)}
                />
              </FormField>

              <FormField label="Policy Number" error={errors.policyNumber?.message}>
                <input
                  {...register("policyNumber")}
                  placeholder="e.g. POL-2024-00456"
                  className={inputClass(errors.policyNumber)}
                />
              </FormField>

              <FormField label="Insurance Company" error={errors.companyName?.message}>
                <input
                  {...register("companyName")}
                  placeholder="e.g. SANLAM Insurance Rwanda"
                  className={inputClass(errors.companyName)}
                />
              </FormField>

              <FormField label="Insurance Type" error={errors.insuranceType?.message}>
                <input
                  {...register("insuranceType")}
                  placeholder="e.g. Comprehensive"
                  className={inputClass(errors.insuranceType)}
                />
              </FormField>

              <FormField label="Insurance Expiry Date" error={errors.insuranceExpiryDate?.message}>
                <input
                  {...register("insuranceExpiryDate")}
                  type="date"
                  className={inputClass(errors.insuranceExpiryDate)}
                />
              </FormField>

              <FormField label="Insurance Status" error={errors.insuranceStatus?.message}>
                <select {...register("insuranceStatus")} className={inputClass(errors.insuranceStatus)}>
                  <option value="">Select status...</option>
                  {["ACTIVE","SUSPENDED","EXPIRED"].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Roadworthy Certificate" error={errors.roadworthyCert?.message}>
                <input
                  {...register("roadworthyCert")}
                  placeholder="e.g. RWC-2024-78901"
                  className={inputClass(errors.roadworthyCert)}
                />
              </FormField>

              <FormField label="Customs Reference" error={errors.customsRef?.message}>
                <input
                  {...register("customsRef")}
                  placeholder="e.g. CUS-RW-2023-11223"
                  className={inputClass(errors.customsRef)}
                />
              </FormField>

              <FormField label="Proof of Ownership" error={errors.proofOfOwnership?.message}>
                <input
                  {...register("proofOfOwnership")}
                  placeholder="e.g. LOG-BOOK-2024-XYZ"
                  className={inputClass(errors.proofOfOwnership)}
                />
              </FormField>

            </div>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">

          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="px-5 py-2 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
            >
              ← Back
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-5 py-2 text-sm rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 text-sm rounded-md bg-blue-700 text-white hover:bg-blue-800 transition font-semibold"
            >
              Next Step →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={createMutation.isPending}
              className="px-5 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition font-semibold disabled:opacity-50"
            >
              {createMutation.isPending ? "Registering..." : "✅ Register Vehicle"}
            </button>
          )}

        </div>
      </div>
    </div>
  )
}

export default RegisterVehicle