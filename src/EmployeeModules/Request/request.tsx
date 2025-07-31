"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Trash2, Eye, Check, DoorClosedIcon as CloseIcon } from "lucide-react" // Renamed X to CloseIcon to avoid conflict with 'X' in JSX

// --- Types Definitions (Inferred from usage) ---
type TabType = "EMPLOYEES" | "MY REQUEST"
type CardType = "SHIFTS" | "LEAVES" | "PROFILE" | "SHIFTS1" | "LEAVES1" | "PROFILE1"
type ModalType = "shift" | "leave" | "profile" | "delete"

interface RequestData {
  id: number
  employeeName: string
  employeeId: string
  department: string
  requestType: "Shift" | "Leave" | "Profile"
  status: "Pending" | "Approved" | "Rejected"
  startDate: Date
  endDate: Date
  startTime?: Date
  endTime?: Date
  details?: string
}

// --- Mock Data ---
const mockAllRequests: RequestData[] = [
  {
    id: 1,
    employeeName: "Alice Johnson",
    employeeId: "EMP001",
    department: "FOH",
    requestType: "Shift",
    status: "Pending",
    startDate: new Date(2024, 7, 10), // August 10, 2024
    endDate: new Date(2024, 7, 10),
    startTime: new Date(2024, 7, 10, 9, 0),
    endTime: new Date(2024, 7, 10, 17, 0),
    details: "Request to swap morning shift",
  },
  {
    id: 2,
    employeeName: "Bob Williams",
    employeeId: "EMP002",
    department: "BOH",
    requestType: "Leave",
    status: "Approved",
    startDate: new Date(2024, 8, 1), // September 1, 2024
    endDate: new Date(2024, 8, 5),
    details: "Vacation request for 5 days",
  },
  {
    id: 3,
    employeeName: "Charlie Brown",
    employeeId: "EMP003",
    department: "Management",
    requestType: "Profile",
    status: "Pending",
    startDate: new Date(2024, 7, 15),
    endDate: new Date(2024, 7, 15),
    details: "Update contact information",
  },
  {
    id: 4,
    employeeName: "Diana Prince",
    employeeId: "EMP004",
    department: "FOH",
    requestType: "Shift",
    status: "Rejected",
    startDate: new Date(2024, 7, 12),
    endDate: new Date(2024, 7, 12),
    startTime: new Date(2024, 7, 12, 10, 0),
    endTime: new Date(2024, 7, 12, 18, 0),
    details: "Request for an extra shift",
  },
]

const mockMyRequests: RequestData[] = [
  {
    id: 101,
    employeeName: "My Self",
    employeeId: "EMP005",
    department: "FOH",
    requestType: "Shift",
    status: "Pending",
    startDate: new Date(2024, 7, 20),
    endDate: new Date(2024, 7, 20),
    startTime: new Date(2024, 7, 20, 11, 0),
    endTime: new Date(2024, 7, 20, 19, 0),
    details: "My shift swap request",
  },
  {
    id: 102,
    employeeName: "My Self",
    employeeId: "EMP005",
    department: "FOH",
    requestType: "Leave",
    status: "Approved",
    startDate: new Date(2024, 9, 10),
    endDate: new Date(2024, 9, 15),
    details: "My vacation request",
  },
]

// --- Utility Functions ---
const dateFormatter = (date: Date) => {
  return format(date, "dd MMM yyyy")
}

const timeFormatter = (date: Date) => {
  return format(date, "hh:mm a")
}

// --- RequestModal Component ---
interface RequestModalProps {
  isOpen: boolean
  onClose: () => void
  type: ModalType
  data?: any // Can be RequestData or { type: string } for delete
}

const RequestModal: React.FC<RequestModalProps> = ({ isOpen, onClose, type, data }) => {
  let title = ""
  let content = null

  switch (type) {
    case "shift":
      title = "Shift Request Details"
      content = (
        <div>
          <p>
            <strong>Employee:</strong> {data?.employeeName} ({data?.employeeId})
          </p>
          <p>
            <strong>Department:</strong> {data?.department}
          </p>
          <p>
            <strong>Date:</strong> {data?.startDate ? dateFormatter(data.startDate) : "N/A"}
          </p>
          <p>
            <strong>Time:</strong> {data?.startTime ? timeFormatter(data.startTime) : "N/A"} -{" "}
            {data?.endTime ? timeFormatter(data.endTime) : "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {data?.status}
          </p>
          <p>
            <strong>Details:</strong> {data?.details}
          </p>
        </div>
      )
      break
    case "leave":
      title = "Leave Request Details"
      content = (
        <div>
          <p>
            <strong>Employee:</strong> {data?.employeeName} ({data?.employeeId})
          </p>
          <p>
            <strong>Department:</strong> {data?.department}
          </p>
          <p>
            <strong>Start Date:</strong> {data?.startDate ? dateFormatter(data.startDate) : "N/A"}
          </p>
          <p>
            <strong>End Date:</strong> {data?.endDate ? dateFormatter(data.endDate) : "N/A"}
          </p>
          <p>
            <strong>Status:</strong> {data?.status}
          </p>
          <p>
            <strong>Details:</strong> {data?.details}
          </p>
        </div>
      )
      break
    case "profile":
      title = "Profile Update Request Details"
      content = (
        <div>
          <p>
            <strong>Employee:</strong> {data?.employeeName} ({data?.employeeId})
          </p>
          <p>
            <strong>Department:</strong> {data?.department}
          </p>
          <p>
            <strong>Status:</strong> {data?.status}
          </p>
          <p>
            <strong>Details:</strong> {data?.details || "No specific details provided."}
          </p>
        </div>
      )
      break
    case "delete":
      title = "Confirm Deletion"
      content = (
        <div className="text-center">
          <Trash2 className="h-10 w-10 mx-auto text-gray-500 mb-4" />
          <p className="text-lg font-medium">Are you sure you want to delete this {data?.type} request?</p>
          <div className="mt-4 flex justify-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button className="bg-red-600 text-white hover:bg-red-700">Delete</Button>
          </div>
        </div>
      )
      break
    default:
      title = "Request Details"
      content = <p>No details available.</p>
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="absolute right-4 top-4 p-0">
            <CloseIcon className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="py-4">{content}</div>
      </DialogContent>
    </Dialog>
  )
}

// --- DataTable Component (Minimal Implementation) ---
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b">
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} data-state={row.getIsSelected() && "selected"} className="border-b transition-colors">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="h-24 text-center text-gray-500">
                No results.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// --- Main Request Component ---
export const RequestComponent: React.FC = () => {
  const [tab, setTab] = useState<TabType>("EMPLOYEES")
  const [selectedCard, setSelectedCard] = useState<CardType>("SHIFTS")
  const [allRequest, setAllRequest] = useState<RequestData[]>([])
  const [myRequests, setMyRequests] = useState<RequestData[]>([]) // Renamed 'event' to 'myRequests' for clarity
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<ModalType>("shift")
  const [modalData, setModalData] = useState<any>(null) // Data to pass to the modal

  // Mock data fetch
  useEffect(() => {
    setAllRequest(mockAllRequests)
    setMyRequests(mockMyRequests)
  }, [])

  const handleView = (request: RequestData) => {
    let type: ModalType
    switch (request.requestType) {
      case "Shift":
        type = "shift"
        break
      case "Leave":
        type = "leave"
        break
      case "Profile":
        type = "profile"
        break
      default:
        type = "shift" // Default case
    }
    setModalType(type)
    setModalData(request)
    setModalOpen(true)
  }

  const handleDelete = (request: RequestData) => {
    setModalType("delete")
    setModalData({ type: request.requestType.toLowerCase(), id: request.id }) // Pass type and ID for deletion
    setModalOpen(true)
  }

  const getStatusColor = (status: RequestData["status"]) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const ShiftColumns: ColumnDef<RequestData>[] = [
    {
      accessorKey: "employeeName",
      header: "EMPLOYEE NAME",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.employeeName} ({row.original.employeeId})
        </div>
      ),
    },
    {
      accessorKey: "department",
      header: "DEPARTMENT",
    },
    {
      accessorKey: "requestType",
      header: "REQUEST TYPE",
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => <Badge className={getStatusColor(row.original.status)}>{row.original.status}</Badge>,
    },
    {
      accessorKey: "startDate",
      header: "DATE",
      cell: ({ row }) => {
        const start = row.original.startDate
        const end = row.original.endDate
        if (start && end && format(start, "yyyy-MM-dd") !== format(end, "yyyy-MM-dd")) {
          return `${dateFormatter(start)} - ${dateFormatter(end)}`
        }
        return start ? dateFormatter(start) : "N/A"
      },
    },
    {
      accessorKey: "time",
      header: "TIME",
      cell: ({ row }) => {
        const start = row.original.startTime
        const end = row.original.endTime
        if (start && end) {
          return `${timeFormatter(start)} - ${timeFormatter(end)}`
        }
        return "N/A"
      },
    },
    {
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleView(row.original)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ]

  const LeavesColumns: ColumnDef<RequestData>[] = [
    {
      accessorKey: "employeeName",
      header: "EMPLOYEE NAME",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.employeeName} ({row.original.employeeId})
        </div>
      ),
    },
    {
      accessorKey: "department",
      header: "DEPARTMENT",
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => <Badge className={getStatusColor(row.original.status)}>{row.original.status}</Badge>,
    },
    {
      accessorKey: "startDate",
      header: "START DATE",
      cell: ({ row }) => (row.original.startDate ? dateFormatter(row.original.startDate) : "N/A"),
    },
    {
      accessorKey: "endDate",
      header: "END DATE",
      cell: ({ row }) => (row.original.endDate ? dateFormatter(row.original.endDate) : "N/A"),
    },
    {
      accessorKey: "details",
      header: "DETAILS",
    },
    {
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleView(row.original)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ]

  const ProfileColumns: ColumnDef<RequestData>[] = [
    {
      accessorKey: "employeeName",
      header: "EMPLOYEE NAME",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.employeeName} ({row.original.employeeId})
        </div>
      ),
    },
    {
      accessorKey: "department",
      header: "DEPARTMENT",
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => <Badge className={getStatusColor(row.original.status)}>{row.original.status}</Badge>,
    },
    {
      accessorKey: "details",
      header: "DETAILS",
    },
    {
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleView(row.original)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ]

  const getTableData = () => {
    const data = tab === "EMPLOYEES" ? allRequest : myRequests
    const type = tab === "EMPLOYEES" ? selectedCard : selectedCard.replace("1", "") // Remove '1' for 'My Request' cards

    switch (type) {
      case "SHIFTS":
        return data.filter((req) => req.requestType === "Shift")
      case "LEAVES":
        return data.filter((req) => req.requestType === "Leave")
      case "PROFILE":
        return data.filter((req) => req.requestType === "Profile")
      default:
        return []
    }
  }

  const getTableColumns = () => {
    const type = tab === "EMPLOYEES" ? selectedCard : selectedCard.replace("1", "")
    switch (type) {
      case "SHIFTS":
        return ShiftColumns
      case "LEAVES":
        return LeavesColumns
      case "PROFILE":
        return ProfileColumns
      default:
        return []
    }
  }

  const currentTableData = getTableData()
  const currentTableColumns = getTableColumns()

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div className="mb-4 md:mb-0">
          <h4 className="text-xl font-bold">Requests</h4>
          <Tabs
            value={tab}
            onValueChange={(value) => {
              setTab(value as TabType)
              // Reset selected card based on the new tab
              setSelectedCard(value === "MY REQUEST" ? "SHIFTS1" : "SHIFTS")
            }}
            className="mt-2"
          >
            <TabsList>
              <TabsTrigger value="EMPLOYEES">EMPLOYEES</TabsTrigger>
              <TabsTrigger value="MY REQUEST">MY REQUEST</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {tab === "EMPLOYEES" ? (
            <>
              <Card
                className={`w-36 h-20 flex flex-col items-center justify-center relative cursor-pointer transition-colors ${
                  selectedCard === "SHIFTS" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedCard("SHIFTS")}
              >
                <CardContent className="p-0 flex flex-col items-center justify-center h-full">
                  <span className="font-medium">SHIFTS</span>
                  <Badge className="absolute -top-2 -right-2 bg-black text-white">
                    {allRequest.filter((r) => r.requestType === "Shift").length}
                  </Badge>
                </CardContent>
              </Card>
              <Card
                className={`w-36 h-20 flex flex-col items-center justify-center relative cursor-pointer transition-colors ${
                  selectedCard === "LEAVES" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedCard("LEAVES")}
              >
                <CardContent className="p-0 flex flex-col items-center justify-center h-full">
                  <span className="font-medium">LEAVES</span>
                  <Badge className="absolute -top-2 -right-2 bg-black text-white">
                    {allRequest.filter((r) => r.requestType === "Leave").length}
                  </Badge>
                </CardContent>
              </Card>
              <Card
                className={`w-36 h-20 flex flex-col items-center justify-center relative cursor-pointer transition-colors ${
                  selectedCard === "PROFILE" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedCard("PROFILE")}
              >
                <CardContent className="p-0 flex flex-col items-center justify-center h-full">
                  <span className="font-medium">PROFILE</span>
                  <Badge className="absolute -top-2 -right-2 bg-black text-white">
                    {allRequest.filter((r) => r.requestType === "Profile").length}
                  </Badge>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card
                className={`w-36 h-20 flex flex-col items-center justify-center relative cursor-pointer transition-colors ${
                  selectedCard === "SHIFTS1" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedCard("SHIFTS1")}
              >
                <CardContent className="p-0 flex flex-col items-center justify-center h-full">
                  <span className="font-medium">SHIFTS</span>
                  <Badge className="absolute -top-2 -right-2 bg-black text-white">
                    {myRequests.filter((r) => r.requestType === "Shift").length}
                  </Badge>
                </CardContent>
              </Card>
              <Card
                className={`w-36 h-20 flex flex-col items-center justify-center relative cursor-pointer transition-colors ${
                  selectedCard === "LEAVES1" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedCard("LEAVES1")}
              >
                <CardContent className="p-0 flex flex-col items-center justify-center h-full">
                  <span className="font-medium">LEAVES</span>
                  <Badge className="absolute -top-2 -right-2 bg-black text-white">
                    {myRequests.filter((r) => r.requestType === "Leave").length}
                  </Badge>
                </CardContent>
              </Card>
              <Card
                className={`w-36 h-20 flex flex-col items-center justify-center relative cursor-pointer transition-colors ${
                  selectedCard === "PROFILE1" ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedCard("PROFILE1")}
              >
                <CardContent className="p-0 flex flex-col items-center justify-center h-full">
                  <span className="font-medium">PROFILE</span>
                  <Badge className="absolute -top-2 -right-2 bg-black text-white">
                    {myRequests.filter((r) => r.requestType === "Profile").length}
                  </Badge>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
      {tab === "EMPLOYEES" && (
        <div className="flex justify-end mb-4 space-x-2">
          <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent">
            <CloseIcon className="h-4 w-4 mr-2" /> REJECT
          </Button>
          <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50 bg-transparent">
            <Check className="h-4 w-4 mr-2" /> APPROVE
          </Button>
        </div>
      )}
      <div className="bg-white rounded-lg shadow">
        <DataTable columns={currentTableColumns} data={currentTableData} />
      </div>
      <RequestModal isOpen={modalOpen} onClose={() => setModalOpen(false)} type={modalType} data={modalData} />
    </div>
  )
}

export default RequestComponent
