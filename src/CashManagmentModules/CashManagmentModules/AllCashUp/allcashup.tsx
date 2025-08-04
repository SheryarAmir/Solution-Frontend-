"use client"

import { useState } from "react"
import { Calendar, Download, Plus, Trash2, FileText, AlertCircle } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent } from "../../../components/ui/card"
import { Checkbox } from "../../../components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover"
import { Calendar as CalendarComponent } from "../../../components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination"

// Enhanced mock data with more realistic values
const generateMockData = () => {
  const statuses = ["Complete", "Pending", "Draft", "Banked"]
  const statusWeights = [0.4, 0.3, 0.2, 0.1] // 40% Complete, 30% Pending, 20% Draft, 10% Banked
  
  return Array.from({ length: 25 }, (_, i) => {
    const randomStatus = Math.random()
    let statusIndex = 0
    let cumulativeWeight = 0
    for (let j = 0; j < statusWeights.length; j++) {
      cumulativeWeight += statusWeights[j]
      if (randomStatus <= cumulativeWeight) {
        statusIndex = j
        break
      }
    }
    
    const epos = Math.floor(Math.random() * 2000) + 500 // €500-2500
    const cash = Math.floor(Math.random() * 800) + 200 // €200-1000
    const pdq = Math.floor(Math.random() * 1200) + 300 // €300-1500
    const delivery = Math.floor(Math.random() * 400) + 50 // €50-450
    const kpiTotal = epos + cash + pdq + delivery
    const difference = Math.floor(Math.random() * 200) - 100 // €-100 to €100
    
    return {
      id: i + 1,
      date: `2025-01-${String(i + 1).padStart(2, "0")}`,
      time: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
      epos,
      cash,
      pdq,
      delivery,
      difference,
      kpiTotal,
      status: statuses[statusIndex],
    }
  })
}

const sampleData = generateMockData()

export default function CashUpSheets() {
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [data, setData] = useState(sampleData)
  const itemsPerPage = 10

  // Calculate summary statistics from actual data
  const calculateSummaryStats = () => {
    const allCashUp = data.length
    const drafts = data.filter(item => item.status === "Draft").length
    const pendingDeposits = data.filter(item => item.status === "Pending").length
    const banked = data.filter(item => item.status === "Banked").length
    
    const allCashUpAmount = data.reduce((sum, item) => sum + item.kpiTotal, 0)
    const draftsAmount = data.filter(item => item.status === "Draft").reduce((sum, item) => sum + item.kpiTotal, 0)
    const pendingAmount = data.filter(item => item.status === "Pending").reduce((sum, item) => sum + item.kpiTotal, 0)
    const bankedAmount = data.filter(item => item.status === "Banked").reduce((sum, item) => sum + item.kpiTotal, 0)
    
    return [
      { title: "ALL CASHUP", amount: `€ ${allCashUpAmount.toFixed(2)}`, count: allCashUp },
      { title: "DRAFTS", amount: `€ ${draftsAmount.toFixed(2)}`, count: drafts },
      { title: "PENDING DEPOSITS", amount: `€ ${pendingAmount.toFixed(2)}`, count: pendingDeposits },
      { title: "BANKED", amount: `€ ${bankedAmount.toFixed(2)}`, count: banked },
    ]
  }

  const summaryCards = calculateSummaryStats()

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = data.slice(startIndex, endIndex)

  // Get current and next month dates
  const currentDate = new Date()
  const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(currentItems.map((item) => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id])
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id))
    }
  }

  const handleDeleteSelected = () => {
    if (selectedItems.length > 0) {
      setData(data.filter(item => !selectedItems.includes(item.id)))
      setSelectedItems([])
      // Reset to first page if current page becomes empty
      if (currentPage > Math.ceil((data.length - selectedItems.length) / itemsPerPage)) {
        setCurrentPage(1)
      }
    }
  }

  const handleClearAllData = () => {
    setData([])
    setSelectedItems([])
    setCurrentPage(1)
  }

  const handleAddMockData = () => {
    const newData = generateMockData()
    setData([...data, ...newData])
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Cash Up Sheets</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">W M Y</span>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="p-2 bg-transparent">
                <Calendar className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[9999] bg-white shadow-lg border" align="end">
              <div className="flex">
                <div className="p-3 border-r">
                  <div className="text-sm font-medium mb-2 text-center">Current Month</div>
                  <CalendarComponent mode="single" selected={currentDate} month={currentDate} className="rounded-md" />
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium mb-2 text-center">Next Month</div>
                  <CalendarComponent mode="single" month={nextMonth} className="rounded-md" />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card, index) => (
          <Card key={index} className="relative">
            <CardContent className="p-4">
              <div className="absolute -top-2 -right-2 bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {card.count}
              </div>
              <div className="text-sm font-medium text-gray-600 mb-1">{card.title}</div>
              <div className="text-lg font-semibold">{card.amount}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleAddMockData}>
            <Plus className="h-4 w-4 mr-1" />
            Add Mock Data
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearAllData}>
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm">
            GENERATE JOURNALS
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDeleteSelected}
            disabled={selectedItems.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            DELETE ({selectedItems.length})
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            ADD New
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          <div className="flex flex-col items-end text-xs text-blue-600">
            <button className="hover:underline">Download Template</button>
            <button className="hover:underline">more</button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedItems.length === currentItems.length && currentItems.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>TIME</TableHead>
                <TableHead>EPOS</TableHead>
                <TableHead>CASH</TableHead>
                <TableHead>PDQ</TableHead>
                <TableHead>DELIVERY</TableHead>
                <TableHead>DIFFERENCE</TableHead>
                <TableHead>KPI TOTAL</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Cash Up Data</h3>
                        <p className="text-gray-500 mb-4">There are no cash up sheets available. Create your first cash up sheet to get started.</p>
                        <div className="flex items-center justify-center gap-2">
                          <Button size="sm" onClick={handleAddMockData}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Sample Data
                          </Button>
                          <Button variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Create New
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.time}</TableCell>
                    <TableCell>€{item.epos.toFixed(2)}</TableCell>
                    <TableCell>€{item.cash.toFixed(2)}</TableCell>
                    <TableCell>€{item.pdq.toFixed(2)}</TableCell>
                    <TableCell>€{item.delivery.toFixed(2)}</TableCell>
                    <TableCell className={item.difference >= 0 ? "text-green-600" : "text-red-600"}>
                      €{item.difference.toFixed(2)}
                    </TableCell>
                    <TableCell>€{item.kpiTotal.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          item.status === "Complete" 
                            ? "bg-green-100 text-green-800" 
                            : item.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : item.status === "Draft"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {data.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage > 1) setCurrentPage(currentPage - 1)
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  size="default"
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(pageNum)
                      }}
                      isActive={currentPage === pageNum}
                      size="default"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  size="default"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
