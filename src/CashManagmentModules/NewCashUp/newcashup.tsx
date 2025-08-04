"use client"

import { useState, useMemo } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Checkbox } from "../../components/ui/checkbox"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus, Filter, Search } from "lucide-react"
import Calendar from "../../components/Calendar"

// Test data interface
interface Deposit {
  id: string
  date: string
  time: string
  eposCash: number
  difference: number
  status: 'draft' | 'pending' | 'banked'
  selected?: boolean
}

// Test data
const testDeposits: Deposit[] = [
  {
    id: "1",
    date: "2024-01-15",
    time: "09:30",
    eposCash: 1250.50,
    difference: 25.00,
    status: 'banked'
  },
  {
    id: "2",
    date: "2024-01-16",
    time: "10:15",
    eposCash: 980.75,
    difference: -15.25,
    status: 'pending'
  },
  {
    id: "3",
    date: "2024-01-17",
    time: "11:45",
    eposCash: 2100.00,
    difference: 0.00,
    status: 'draft'
  },
  {
    id: "4",
    date: "2024-01-18",
    time: "14:20",
    eposCash: 875.25,
    difference: 12.50,
    status: 'banked'
  },
  {
    id: "5",
    date: "2024-01-19",
    time: "16:30",
    eposCash: 1650.80,
    difference: -8.75,
    status: 'pending'
  },
  {
    id: "6",
    date: "2024-01-20",
    time: "08:45",
    eposCash: 1425.60,
    difference: 0.00,
    status: 'draft'
  },
  {
    id: "7",
    date: "2024-01-21",
    time: "12:10",
    eposCash: 1950.40,
    difference: 30.00,
    status: 'banked'
  },
  {
    id: "8",
    date: "2024-01-22",
    time: "15:25",
    eposCash: 1100.90,
    difference: -5.50,
    status: 'pending'
  }
]

export default function Component() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [showDualMonth, setShowDualMonth] = useState(false)
  const [deposits, setDeposits] = useState<Deposit[]>(testDeposits)
  const [selectedDeposits, setSelectedDeposits] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [viewMode, setViewMode] = useState<'W' | 'M' | 'Y'>('M')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'pending' | 'banked'>('all')

  const handleCalendarClick = () => {
    if (isCalendarOpen) {
      setShowDualMonth(!showDualMonth)
    } else {
      setIsCalendarOpen(true)
      setShowDualMonth(false)
    }
  }

  const handleCalendarClose = () => {
    setIsCalendarOpen(false)
    setShowDualMonth(false)
  }

  // Filter deposits based on search and status
  const filteredDeposits = useMemo(() => {
    return deposits.filter(deposit => {
      const matchesSearch = deposit.date.includes(searchTerm) || 
                           deposit.time.includes(searchTerm) ||
                           deposit.eposCash.toString().includes(searchTerm)
      const matchesStatus = statusFilter === 'all' || deposit.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [deposits, searchTerm, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredDeposits.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDeposits = filteredDeposits.slice(startIndex, endIndex)

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const allCashup = deposits.reduce((sum, deposit) => sum + deposit.eposCash, 0)
    const drafts = deposits.filter(d => d.status === 'draft').reduce((sum, deposit) => sum + deposit.eposCash, 0)
    const pending = deposits.filter(d => d.status === 'pending').reduce((sum, deposit) => sum + deposit.eposCash, 0)
    const banked = deposits.filter(d => d.status === 'banked').reduce((sum, deposit) => sum + deposit.eposCash, 0)

    return {
      allCashup: { count: deposits.length, amount: allCashup },
      drafts: { count: deposits.filter(d => d.status === 'draft').length, amount: drafts },
      pending: { count: deposits.filter(d => d.status === 'pending').length, amount: pending },
      banked: { count: deposits.filter(d => d.status === 'banked').length, amount: banked }
    }
  }, [deposits])

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDeposits(currentDeposits.map(d => d.id))
    } else {
      setSelectedDeposits([])
    }
  }

  // Handle individual selection
  const handleSelectDeposit = (depositId: string, checked: boolean) => {
    if (checked) {
      setSelectedDeposits(prev => [...prev, depositId])
    } else {
      setSelectedDeposits(prev => prev.filter(id => id !== depositId))
    }
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setSelectedDeposits([]) // Clear selection when changing pages
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Deposits</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <button 
                className={`px-3 py-1 text-sm font-medium rounded ${viewMode === 'W' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setViewMode('W')}
              >
                W
              </button>
              <button 
                className={`px-3 py-1 text-sm font-medium rounded ${viewMode === 'M' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setViewMode('M')}
              >
                M
              </button>
              <button 
                className={`px-3 py-1 text-sm font-medium rounded ${viewMode === 'Y' ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setViewMode('Y')}
              >
                Y
              </button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCalendarClick}
              className="flex items-center gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              Date Range
            </Button>
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
                  {summaryStats.allCashup.count}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 uppercase tracking-wide">ALL CASHUP</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(summaryStats.allCashup.amount)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Badge
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800 rounded-full h-6 w-6 flex items-center justify-center p-0 text-xs"
                >
                  {summaryStats.drafts.count}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 uppercase tracking-wide">DRAFTS</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(summaryStats.drafts.amount)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800 rounded-full h-6 w-6 flex items-center justify-center p-0 text-xs"
                >
                  {summaryStats.pending.count}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 uppercase tracking-wide">PENDING</p>
                <p className="text-sm font-medium text-gray-900 uppercase tracking-wide">DEPOSITS</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(summaryStats.pending.amount)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center p-0 text-xs"
                >
                  {summaryStats.banked.count}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 uppercase tracking-wide">BANKED</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(summaryStats.banked.amount)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search deposits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Drafts</option>
              <option value="pending">Pending</option>
              <option value="banked">Banked</option>
            </select>
          </div>

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
                <Checkbox 
                  checked={selectedDeposits.length === currentDeposits.length && currentDeposits.length > 0}
                  onCheckedChange={handleSelectAll}
                />
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

            {/* Table Body */}
            {currentDeposits.length > 0 ? (
              currentDeposits.map((deposit) => (
                <div key={deposit.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50">
                  <div className="col-span-1 flex items-center">
                    <Checkbox 
                      checked={selectedDeposits.includes(deposit.id)}
                      onCheckedChange={(checked) => handleSelectDeposit(deposit.id, checked as boolean)}
                    />
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span className="text-sm text-gray-900">{formatDate(deposit.date)}</span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className="text-sm text-gray-900">{deposit.time}</span>
                  </div>
                  <div className="col-span-3 flex items-center">
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(deposit.eposCash)}</span>
                  </div>
                  <div className="col-span-3 flex items-center gap-2">
                    <span className={`text-sm font-medium ${deposit.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {deposit.difference >= 0 ? '+' : ''}{formatCurrency(deposit.difference)}
                    </span>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        deposit.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        deposit.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {deposit.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-24 text-center">
                <p className="text-gray-500 text-sm">No deposits found</p>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                {filteredDeposits.length > 0 ? `${startIndex + 1} to ${Math.min(endIndex, filteredDeposits.length)} of ${filteredDeposits.length}` : '0 to 0 of 0'}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 bg-transparent" 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 bg-transparent" 
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
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
