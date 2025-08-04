import { Button } from "../../components/ui/button" 
import { Card, CardContent } from "../../components/ui/card"
import { ChevronLeft, ChevronRight, Plus, Eye, Edit, Trash2 } from "lucide-react"
import Calendar from "../../components/Calendar"
import { useState, useEffect } from "react"

// Define types for the cashup data
interface CashupData {
  id: string
  date: string
  witness: string
  safeFloat: number
  tillFloat: number
  salesCash: number
}

interface SummaryData {
  safeFloat: number
  tillFloat: number
  salesCash: number
}

export default function Component() {
  // State management
  const [cashupData, setCashupData] = useState<CashupData[]>([])
  const [summaryData, setSummaryData] = useState<SummaryData>({
    safeFloat: 0,
    tillFloat: 0,
    salesCash: 0
  })
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [selectedPeriod, setSelectedPeriod] = useState<'W' | 'M' | 'Y'>('M')

  // Mock data - replace with actual API calls
  const mockCashupData: CashupData[] = [
    {
      id: '1',
      date: '2024-01-15',
      witness: 'John Doe',
      safeFloat: 500,
      tillFloat: 200,
      salesCash: 1500
    },
    {
      id: '2',
      date: '2024-01-14',
      witness: 'Jane Smith',
      safeFloat: 450,
      tillFloat: 180,
      salesCash: 1200
    },
    {
      id: '3',
      date: '2024-01-13',
      witness: 'Mike Johnson',
      safeFloat: 600,
      tillFloat: 250,
      salesCash: 1800
    }
  ]

  // Fetch data function
  const fetchData = async () => {
    setLoading(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Replace this with actual API call
      // const response = await fetch('/api/cashup-summary')
      // const data = await response.json()
      
      setCashupData(mockCashupData)
      
      // Calculate summary data
      const totalSafeFloat = mockCashupData.reduce((sum, item) => sum + item.safeFloat, 0)
      const totalTillFloat = mockCashupData.reduce((sum, item) => sum + item.tillFloat, 0)
      const totalSalesCash = mockCashupData.reduce((sum, item) => sum + item.salesCash, 0)
      
      setSummaryData({
        safeFloat: totalSafeFloat,
        tillFloat: totalTillFloat,
        salesCash: totalSalesCash
      })
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchData()
  }, [selectedPeriod])

  // Pagination calculations
  const totalPages = Math.ceil(cashupData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = cashupData.slice(startIndex, endIndex)

  // Handle period change
  const handlePeriodChange = (period: 'W' | 'M' | 'Y') => {
    setSelectedPeriod(period)
    setCurrentPage(1)
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle actions
  const handleView = (id: string) => {
    console.log('View cashup:', id)
    // Add view logic here
  }

  const handleEdit = (id: string) => {
    console.log('Edit cashup:', id)
    // Add edit logic here
  }

  const handleDelete = (id: string) => {
    console.log('Delete cashup:', id)
    // Add delete logic here
  }

  const handleAddNew = () => {
    console.log('Add new cashup')
    // Add new cashup logic here
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Safe Summary</h1>
          <div className="flex items-center gap-2">
            <div className="flex bg-white border border-gray-200 rounded-md">
              <button 
                className={`px-3 py-1.5 text-sm font-medium border-r border-gray-200 ${
                  selectedPeriod === 'W' 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handlePeriodChange('W')}
              >
                W
              </button>
              <button 
                className={`px-3 py-1.5 text-sm font-medium border-r border-gray-200 ${
                  selectedPeriod === 'M' 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handlePeriodChange('M')}
              >
                M
              </button>
              <button 
                className={`px-3 py-1.5 text-sm font-medium ${
                  selectedPeriod === 'Y' 
                    ? 'bg-gray-800 text-white' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handlePeriodChange('Y')}
              >
                Y
              </button>
            </div>
            <Calendar/>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="text-sm text-gray-500 mb-1">Last Declaration:</div>
              <div className="text-lg font-medium text-gray-900 mb-4">Safe Float</div>
              <div className="text-3xl font-bold text-gray-900">
                {loading ? (
                  <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  `€ ${summaryData.safeFloat.toLocaleString()}`
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="text-sm text-gray-500 mb-1">Last Declaration:</div>
              <div className="text-lg font-medium text-gray-900 mb-4">Till Float</div>
              <div className="text-3xl font-bold text-gray-900">
                {loading ? (
                  <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  `€ ${summaryData.tillFloat.toLocaleString()}`
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="text-sm text-gray-500 mb-1">Last Declaration:</div>
              <div className="text-lg font-medium text-gray-900 mb-4">Sales Cash</div>
              <div className="text-3xl font-bold text-gray-900">
                {loading ? (
                  <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  `€ ${summaryData.salesCash.toLocaleString()}`
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card className="bg-white shadow-sm">
          <CardContent className="p-0">
            {/* Table Header with Add New Button */}
            <div className="flex justify-end p-4">
              <Button 
                className="bg-gray-800 hover:bg-gray-900 text-white text-sm"
                onClick={handleAddNew}
              >
                <Plus className="h-4 w-4 mr-2" />
                ADD NEW
              </Button>
            </div>

            {/* Table Headers */}
            <div className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">DATE</div>
              <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">WITNESS</div>
              <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">SAFE FLOAT</div>
              <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">TILL FLOAT</div>
              <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">SALES CASH</div>
              <div className="text-sm font-medium text-gray-700 uppercase tracking-wide">ACTIONS</div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="py-16 text-center">
                <div className="text-gray-500 text-sm">Loading...</div>
              </div>
            )}

            {/* Data Rows */}
            {!loading && currentData.length > 0 && (
              <div>
                {currentData.map((item) => (
                  <div key={item.id} className="grid grid-cols-6 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50">
                    <div className="text-sm text-gray-900">{new Date(item.date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-900">{item.witness}</div>
                    <div className="text-sm text-gray-900">€ {item.safeFloat.toLocaleString()}</div>
                    <div className="text-sm text-gray-900">€ {item.tillFloat.toLocaleString()}</div>
                    <div className="text-sm text-gray-900">€ {item.salesCash.toLocaleString()}</div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && currentData.length === 0 && (
              <div className="py-16 text-center">
                <div className="text-gray-500 text-sm">No Rows To Show</div>
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                {cashupData.length > 0 
                  ? `${startIndex + 1} to ${Math.min(endIndex, cashupData.length)} of ${cashupData.length}`
                  : '0 to 0 of 0'
                }
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
