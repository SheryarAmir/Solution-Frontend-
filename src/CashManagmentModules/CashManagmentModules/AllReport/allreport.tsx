"use client"

import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Component() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 1)) // August 2025

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDayOfMonth = getFirstDayOfMonth(currentDate)
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  // Generate calendar weeks
  const weeks = []
  let currentWeek = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    currentWeek.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day)

    if (currentWeek.length === 7) {
      weeks.push([...currentWeek])
      currentWeek = []
    }
  }

  // Add remaining empty cells to complete the last week
  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push(null)
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  // Special dates that should be highlighted in red
  const specialDates = [10, 17, 24]

  return (
    <div className="bg-white min-h-screen">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-normal text-black">Reconciliation</h1>
          <div className="flex items-center border border-gray-300 rounded px-2 py-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("prev")}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm px-4 min-w-[100px] text-center">{formatMonth(currentDate)}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("next")}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary Cards Row */}
        <div className="grid grid-cols-3 gap-8 mb-8">
          {/* CASH */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">CASH</span>
              <div className="bg-gray-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                0
              </div>
            </div>
            <div className="text-2xl font-semibold text-black mb-1">€ 0.00</div>
            <div className="text-xs text-gray-500">value</div>
          </div>

          {/* CARD */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">CARD</span>
              <div className="bg-gray-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                0
              </div>
            </div>
            <div className="text-2xl font-semibold text-black mb-1">€ 0.00</div>
            <div className="text-xs text-gray-500">value</div>
          </div>

          {/* THIRD PARTY */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">THIRD PARTY</span>
              <div className="bg-gray-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                0
              </div>
            </div>
            <div className="text-2xl font-semibold text-black mb-1">€ 0.00</div>
            <div className="text-xs text-gray-500">value</div>
          </div>
        </div>

        {/* Total Amount Reconciled */}
        <div className="bg-gray-100 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-700 mb-1">TOTAL AMOUNT RECONCILED</div>
              <div className="text-2xl font-semibold text-black mb-1">€ 0.00</div>
              <div className="text-xs text-gray-500">Total Amount</div>
            </div>
            <div className="flex gap-12">
              <div>
                <div className="text-lg font-semibold text-black">€ 0.00</div>
                <div className="text-xs text-gray-500">cash</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-black">€ 0.00</div>
                <div className="text-xs text-gray-500">card</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-black">€ 0.00</div>
                <div className="text-xs text-gray-500">thirdparty</div>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Table with Horizontal Scroll */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {daysOfWeek.map((day) => (
                  <th
                    key={day}
                    className="text-sm font-medium text-black py-3 px-2 text-center border-b border-gray-200 min-w-[180px]"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week, weekIndex) => (
                <tr key={weekIndex}>
                  {week.map((day, dayIndex) => (
                    <td key={dayIndex} className="h-24 border border-gray-200 bg-white p-2 align-top min-w-[180px]">
                      {day && (
                        <span
                          className={`text-sm font-medium ${
                            specialDates.includes(day) ? "text-red-500" : "text-black"
                          }`}
                        >
                          {day}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
