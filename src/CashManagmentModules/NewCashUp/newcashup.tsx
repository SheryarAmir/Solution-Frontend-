"use client"

import { useState } from "react"
  import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Checkbox } from "../../components/ui/checkbox"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Calendar from "../../components/Calendar"

export default function Component() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [showDualMonth, setShowDualMonth] = useState(false)

  const handleCalendarClick = () => {
    if (isCalendarOpen) {
      // If calendar is already open, toggle between single and dual month view
      setShowDualMonth(!showDualMonth)
    } else {
      // If calendar is closed, open it with single month view
      setIsCalendarOpen(true)
      setShowDualMonth(false)
    }
  }

  const handleCalendarClose = () => {
    setIsCalendarOpen(false)
    setShowDualMonth(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Deposits</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded">W</button>
              <button className="px-3 py-1 text-sm font-medium bg-gray-900 text-white rounded">M</button>
              <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded">Y</button>
            </div>
               {/* Calendar Component */}
        <Calendar isOpen={isCalendarOpen} onClose={handleCalendarClose} showDualMonth={showDualMonth} />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-800 rounded-full h-6 w-6 flex items-center justify-center p-0 text-xs"
                >
                  0
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 uppercase tracking-wide">ALL CASHUP</p>
                <p className="text-lg font-semibold text-gray-900">€ 0.00</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-800 rounded-full h-6 w-6 flex items-center justify-center p-0 text-xs"
                >
                  0
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 uppercase tracking-wide">DRAFTS</p>
                <p className="text-lg font-semibold text-gray-900">€ 0.00</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-800 rounded-full h-6 w-6 flex items-center justify-center p-0 text-xs"
                >
                  0
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 uppercase tracking-wide">PENDING</p>
                <p className="text-sm font-medium text-gray-900 uppercase tracking-wide">DEPOSITS</p>
                <p className="text-lg font-semibold text-gray-900">€ 0.00</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-800 rounded-full h-6 w-6 flex items-center justify-center p-0 text-xs"
                >
                  0
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 uppercase tracking-wide">BANKED</p>
                <p className="text-lg font-semibold text-gray-900">€ 0.00</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Banking Button */}
        <div className="flex justify-end mb-6">
          <Button className="bg-gray-600 hover:bg-gray-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            CREATE BANKING
          </Button>
        </div>

        {/* Data Table */}
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50">
              <div className="col-span-1 flex items-center">
                <Checkbox />
              </div>
              <div className="col-span-3">
                <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">DATE</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">TIME</p>
              </div>
              <div className="col-span-3">
                <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">EPOS CASH</p>
              </div>
              <div className="col-span-3">
                <p className="text-sm font-medium text-gray-700 uppercase tracking-wide">DIFFERENCE</p>
              </div>
            </div>

            {/* Empty State */}
            <div className="py-24 text-center">
              <p className="text-gray-500 text-sm">No Rows To Show</p>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <div className="text-sm text-gray-700">0 to 0 of 0</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Page 0 of 0</span>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" disabled>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent" disabled>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
