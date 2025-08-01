"use client"

import type React from "react"
import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import RosLogo from '../../../assets/images/ROS_FINAL-07.png';

interface ForgotPasswordProps {
  onSendOtp: () => void
  onLogin: () => void
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onSendOtp, onLogin }) => {
  const [step, setStep] = useState<"email" | "verification">("email")
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)


  const handleSendVerificationCode = async () => {
    if (!email) return

    setIsLoading(true)
    try {
      // TODO: Replace with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      setStep("verification")
    } catch (error) {
      console.error("Error sending verification code:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode) return

    setIsLoading(true)
    try {
      // TODO: Replace with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      onSendOtp() // Call the onSendOtp prop when verification is complete
    } catch (error) {
      console.error("Error verifying code:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendNewCode = async () => {
    setIsLoading(true)
    try {
      // TODO: Replace with your actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      setVerificationCode("") // Clear the current code
    } catch (error) {
      console.error("Error sending new code:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setStep("email")
    setEmail("")
    setVerificationCode("")
    onLogin() // Call the onLogin prop when canceling
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
      <div className="flex flex-col">
      {/* Cancel Button */}
      <button
        onClick={handleCancel}
        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Cancel
      </button>

      {/* ROS Logo */}
      <div className="text-center mb-4 mx-auto">
        <img src={RosLogo} alt="Logo" className="w-40" />
      </div>
      </div>

      {step === "email" && (
        <div className="space-y-6">
          {/* Email Input */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {/* Send Verification Code Button */}
          <button
            onClick={handleSendVerificationCode}
            disabled={!email || isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors"
          >
            {isLoading ? "Sending..." : "Send verification code"}
          </button>

          {/* Continue Button */}
          <button
            onClick={onSendOtp}
            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-3 px-4 rounded-md transition-colors"
          >
            Continue
          </button>
        </div>
      )}

      {step === "verification" && (
        <div className="space-y-6">
          {/* Instruction Text */}
          <div className="text-center text-sm text-gray-600 mb-6">
            Verification code has been sent to your inbox. Please copy it to the input box below.
          </div>

          {/* Email Display (Disabled) */}
          <div>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            />
          </div>

          {/* Verification Code Input */}
          <div>
            <input
              type="text"
              placeholder="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleVerifyCode}
              disabled={!verificationCode || isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              {isLoading ? "Verifying..." : "Verify code"}
            </button>
            <button
              onClick={handleSendNewCode}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-md transition-colors"
            >
              {isLoading ? "Sending..." : "Send new code"}
            </button>
          </div>

          {/* Continue Button */}
          <button
            onClick={onSendOtp}
            className="w-full bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-3 px-4 rounded-md transition-colors"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )
}

export default ForgotPassword
