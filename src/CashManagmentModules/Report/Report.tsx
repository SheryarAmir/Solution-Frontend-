"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"  
import { Checkbox } from "../../components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Download, Trash2, Plus, Calendar, ChevronLeft, ChevronRight } from "lucide-react"

export default function Component() {
  const [selectedPeriod, setSelectedPeriod] = useState("M")

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>

          <div className="flex items-center gap-4">
            {/* Period Toggle */}
            <div className="flex items-center gap-1 bg-white border rounded-md p-1">
              {["W", "M", "Y"].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    selectedPeriod === period ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>

            {/* Calendar Icon */}
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" className="bg-gray-600 text-white hover:bg-gray-700">
            <Download className="h-4 w-4 mr-2" />
            DOWNLOAD
          </Button>

          <Button variant="outline" className="bg-gray-800 text-white hover:bg-gray-900">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>

          <Button className="bg-gray-800 text-white hover:bg-gray-900">
            <Plus className="h-4 w-4 mr-2" />
            CREATE NEW
          </Button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="border-b">
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead className="font-semibold text-gray-900">REPORT NAME</TableHead>
                <TableHead className="font-semibold text-gray-900">DATE</TableHead>
                <TableHead className="font-semibold text-gray-900">USER NAME</TableHead>
                <TableHead className="font-semibold text-gray-900">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Empty State */}
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="text-gray-500 text-sm">No Rows To Show</div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">0 to 0 of 0</div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm text-gray-600 px-2">Page 0 of 0</span>

            <Button variant="outline" size="icon" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
