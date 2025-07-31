"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"
import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Save,
  Calendar,
  User,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Upload,
  Download,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Checkbox } from "../../components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Switch } from "../../components/ui/switch"
import { Textarea } from "../../components/ui/textarea"

// --- Types and Interfaces ---
interface Employee {
  id: string
  empName: string
  empImgUrl: string
  department: string
  basicInfo: {
    joiningInfo: {
      joiningDate: string
    }
    empDetails: {
      empImgUrl: string
      firstName: string
      middleName: string
      lastName: string
      addr: string
      zip: string
      city: string
      state: string
      country: string
      email: string
      mobile: string
      telephone: string
    }
    deptDetails: {
      department: string
      position: string
    }
    locationDetails: {
      location: string
    }
    kinInfo: {
      firstName: string
      middleName: string
      lastName: string
      addr: string
      zip: string
      email: string
      mobile: string
      telephone: string
      relation: string
    }
  }
  bankDetails: {
    BankInfo: {
      BankName: string
      BranchAcc: string
      AccHolderName: string
      BranchSortCode: string
      AccNumber: string
    }
    salaryInfo: {
      EmployeeType: string
      Salary: string
    }
  }
  StatutoryInfo: {
    BankInfo: {
      Nationality: string
      PlaceofBirth: string
      DateofBirth: string
      Gender: string
      Age: string
      MaritalStatus: string
      PassportNumber: string
    }
    NInumber: {
      NInumber: string
    }
    Tax: {
      HavingtaxP45: boolean
    }
  }
  StatmentsInfo: {
    EmployeeStatement: {
      Statement: "Statement1" | "Statement2" | "Statement3"
    }
    studentLoan: {
      studentLoan: "Yes" | "No"
    }
    medicalCondition: {
      MedicalCondition: string
    }
  }
  shifts: ShiftEvent[]
}

interface ShiftEvent {
  id: string
  location: string
  empId: string
  title: string
  shiftType: string
  shiftDate: Date
  shiftStartTime: Date
  shiftEndTime: Date
  isApproved: boolean
}

interface DocumentDetail {
  docName: string
  desp: string
  docType: string
  attachment: string
}

type ViewType = "all-employees" | "view-employee" | "edit-employee" | "add-employee" | "view-calendar"

// --- Mock Data ---
const mockEmployees: Employee[] = [
  {
    id: "1",
    empName: "John Doe",
    empImgUrl: "/placeholder.svg?height=150&width=150",
    department: "Management",
    basicInfo: {
      joiningInfo: {
        joiningDate: "2020-01-15T00:00:00.000Z",
      },
      empDetails: {
        empImgUrl: "/placeholder.svg?height=150&width=150",
        firstName: "John",
        middleName: "A.",
        lastName: "Doe",
        addr: "123 Main St",
        zip: "10001",
        city: "New York",
        state: "NY",
        country: "USA",
        email: "john.doe@example.com",
        mobile: "123-456-7890",
        telephone: "987-654-3210",
      },
      deptDetails: {
        department: "Management",
        position: "Manager",
      },
      locationDetails: {
        location: "ABT Cafeteria LTD",
      },
      kinInfo: {
        firstName: "Jane",
        middleName: "",
        lastName: "Doe",
        addr: "123 Main St",
        zip: "10001",
        email: "jane.doe@example.com",
        mobile: "111-222-3333",
        telephone: "444-555-6666",
        relation: "Spouse",
      },
    },
    bankDetails: {
      BankInfo: {
        BankName: "First National Bank",
        BranchAcc: "Main Branch",
        AccHolderName: "John A. Doe",
        BranchSortCode: "12-34-56",
        AccNumber: "12345678",
      },
      salaryInfo: {
        EmployeeType: "Full-time",
        Salary: "Monthly",
      },
    },
    StatutoryInfo: {
      BankInfo: {
        Nationality: "American",
        PlaceofBirth: "New York",
        DateofBirth: "1990-05-20T00:00:00.000Z",
        Gender: "Male",
        Age: "34",
        MaritalStatus: "Married",
        PassportNumber: "P1234567",
      },
      NInumber: {
        NInumber: "AB123456C",
      },
      Tax: {
        HavingtaxP45: true,
      },
    },
    StatmentsInfo: {
      EmployeeStatement: {
        Statement: "Statement1",
      },
      studentLoan: {
        studentLoan: "No",
      },
      medicalCondition: {
        MedicalCondition: "None",
      },
    },
    shifts: [
      {
        id: "shift1",
        location: "Cremes Cafe",
        empId: "1",
        title: "Morning Shift",
        shiftType: "Manager",
        shiftDate: new Date(2024, 7, 29),
        shiftStartTime: new Date(2024, 7, 29, 9, 0),
        shiftEndTime: new Date(2024, 7, 29, 17, 0),
        isApproved: true,
      },
    ],
  },
  {
    id: "2",
    empName: "Jane Smith",
    empImgUrl: "/placeholder.svg?height=150&width=150",
    department: "FOH",
    basicInfo: {
      joiningInfo: {
        joiningDate: "2021-03-10T00:00:00.000Z",
      },
      empDetails: {
        empImgUrl: "/placeholder.svg?height=150&width=150",
        firstName: "Jane",
        middleName: "",
        lastName: "Smith",
        addr: "456 Oak Ave",
        zip: "10002",
        city: "New York",
        state: "NY",
        country: "USA",
        email: "jane.smith@example.com",
        mobile: "234-567-8901",
        telephone: "876-543-2109",
      },
      deptDetails: {
        department: "FOH",
        position: "Waiter",
      },
      locationDetails: {
        location: "Cremes Cafe",
      },
      kinInfo: {
        firstName: "Bob",
        middleName: "",
        lastName: "Smith",
        addr: "456 Oak Ave",
        zip: "10002",
        email: "bob.smith@example.com",
        mobile: "222-333-4444",
        telephone: "555-666-7777",
        relation: "Brother",
      },
    },
    bankDetails: {
      BankInfo: {
        BankName: "Second National Bank",
        BranchAcc: "Downtown Branch",
        AccHolderName: "Jane Smith",
        BranchSortCode: "23-45-67",
        AccNumber: "23456789",
      },
      salaryInfo: {
        EmployeeType: "Part-time",
        Salary: "Hourly",
      },
    },
    StatutoryInfo: {
      BankInfo: {
        Nationality: "American",
        PlaceofBirth: "Boston",
        DateofBirth: "1995-08-15T00:00:00.000Z",
        Gender: "Female",
        Age: "29",
        MaritalStatus: "Single",
        PassportNumber: "P2345678",
      },
      NInumber: {
        NInumber: "BC234567D",
      },
      Tax: {
        HavingtaxP45: false,
      },
    },
    StatmentsInfo: {
      EmployeeStatement: {
        Statement: "Statement2",
      },
      studentLoan: {
        studentLoan: "Yes",
      },
      medicalCondition: {
        MedicalCondition: "Allergies",
      },
    },
    shifts: [
      {
        id: "shift2",
        location: "Cremes Cafe",
        empId: "2",
        title: "Evening Shift",
        shiftType: "Waiter",
        shiftDate: new Date(2024, 7, 30),
        shiftStartTime: new Date(2024, 7, 30, 14, 0),
        shiftEndTime: new Date(2024, 7, 30, 22, 0),
        isApproved: false,
      },
    ],
  },
]

const mockShiftDetails = [
  {
    Shift_date: "01 March 2021",
    location: "Cremes Cafe",
    startTime: "09:00",
    endTime: "15:00",
    break: "00:45",
    approved: "Not approved",
  },
  {
    Shift_date: "02 March 2021",
    location: "Cremes Cafe",
    startTime: "09:00",
    endTime: "15:00",
    break: "00:45",
    approved: "Approved",
  },
]

const mockDocDetails: DocumentDetail[] = [
  {
    docName: "Passport",
    desp: "Passport of employee",
    docType: "contract",
    attachment: "image_123.jpg",
  },
  {
    docName: "Driving License",
    desp: "Driving license of employee",
    docType: "ID",
    attachment: "license.pdf",
  },
]

// --- DataTable Component ---
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
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="h-12 px-4 text-left align-middle font-medium text-gray-500">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b transition-colors hover:bg-gray-50">
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

// --- Main Component ---
const EmployeeManagementComponent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("all-employees")
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null)
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees)
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(mockEmployees)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("Basic")

  // Calendar states
  const [viewDate, setViewDate] = useState(new Date())
  const [showAddShiftDialog, setShowAddShiftDialog] = useState(false)
  const [showEditShiftDialog, setShowEditShiftDialog] = useState(false)
  const [showAddVacationDialog, setShowAddVacationDialog] = useState(false)
  const [selectedShift, setSelectedShift] = useState<ShiftEvent | null>(null)

  // Form states
  const [employeeForm, setEmployeeForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    mobile: "",
    telephone: "",
    addr: "",
    city: "",
    state: "",
    country: "",
    zip: "",
    department: "",
    position: "",
    location: "",
    joiningDate: "",
    // Add more fields as needed
  })

  const [shiftForm, setShiftForm] = useState({
    city: "",
    name: "",
    department: "",
    position: "",
    startTime: "",
    endTime: "",
    approve: false,
  })

  // Filter employees
  const filterEmployees = useCallback(() => {
    let filtered = employees.filter(
      (emp) =>
        emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.empName.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (selectedDepartments.length > 0 && !selectedDepartments.includes("all")) {
      filtered = filtered.filter((emp) => selectedDepartments.includes(emp.department))
    }

    setFilteredEmployees(filtered)
  }, [employees, searchTerm, selectedDepartments])

  useEffect(() => {
    filterEmployees()
  }, [filterEmployees])

  // Navigation functions
  const navigateToView = (view: ViewType, employeeId?: string) => {
    setCurrentView(view)
    if (employeeId) {
      setSelectedEmployeeId(employeeId)
    }
  }

  const handleBack = () => {
    setCurrentView("all-employees")
    setSelectedEmployeeId(null)
  }

  // Employee CRUD operations
  const handleDeleteEmployee = (employee: Employee) => {
    setEmployeeToDelete(employee)
    setShowDeleteDialog(true)
  }

  const confirmDeleteEmployee = () => {
    if (employeeToDelete) {
      setEmployees(employees.filter((emp) => emp.id !== employeeToDelete.id))
      setShowDeleteDialog(false)
      setEmployeeToDelete(null)
    }
  }

  const handleSaveEmployee = () => {
    // Implementation for saving employee
    setShowSaveDialog(true)
  }

  // Get selected employee
  const selectedEmployee = selectedEmployeeId ? employees.find((emp) => emp.id === selectedEmployeeId) : null

  // Column definitions for employee table
  const employeeColumns: ColumnDef<Employee>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />
      ),
    },
    {
      accessorKey: "empName",
      header: "EMPLOYEE NAME",
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.empImgUrl || "/placeholder.svg"} alt={row.original.empName} />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.original.empName}</span>
        </div>
      ),
    },
    {
      accessorKey: "id",
      header: "EMP ID",
    },
    {
      accessorKey: "department",
      header: "DEPARTMENT",
    },
    {
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => navigateToView("view-employee", row.original.id)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigateToView("edit-employee", row.original.id)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigateToView("view-calendar", row.original.id)}>
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteEmployee(row.original)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ]

  // Shift columns
  const shiftColumns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />
      ),
    },
    { accessorKey: "Shift_date", header: "DATE" },
    { accessorKey: "location", header: "LOCATION" },
    { accessorKey: "startTime", header: "START TIME" },
    { accessorKey: "endTime", header: "END TIME" },
    { accessorKey: "break", header: "BREAK" },
    { accessorKey: "approved", header: "APPROVED" },
    {
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ]

  // Document columns
  const documentColumns: ColumnDef<DocumentDetail>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />
      ),
    },
    { accessorKey: "docName", header: "DOCUMENT NAME" },
    { accessorKey: "desp", header: "DESCRIPTION" },
    { accessorKey: "docType", header: "DOCUMENT TYPE" },
    { accessorKey: "attachment", header: "ATTACHMENT" },
    {
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ]

  // Render different views
  const renderAllEmployeesView = () => (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Employees</h1>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              {/* <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" /> */}
              <Input
                placeholder="Employee Name or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              <Button variant="link" className="text-blue-600 text-sm mt-1" onClick={() => setSearchTerm("")}>
                VIEW ALL
              </Button>
            </div>
            <div>
              <Select
                value={selectedDepartments.join(",")}
                onValueChange={(value) => setSelectedDepartments(value ? value.split(",") : [])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BOH">BOH</SelectItem>
                  <SelectItem value="FOH">FOH</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="all">Select All</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div></div>
            <div className="flex justify-end">
              <Button className="bg-black text-white" onClick={() => navigateToView("add-employee")}>
                <Plus className="h-4 w-4 mr-2" />
                ADD NEW
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Search</h2>
        <DataTable columns={employeeColumns} data={filteredEmployees} />
      </div>
    </div>
  )

  const renderViewEmployeeView = () => {
    if (!selectedEmployee) return <div>Employee not found</div>

    return (
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Card className="w-60 flex-shrink-0 shadow-md rounded-none border-r">
          <CardHeader className="pb-0">
            <Button variant="ghost" size="sm" onClick={handleBack} className="self-start p-0 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <CardTitle className="text-xl">My Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
              <TabsList className="flex flex-col h-auto p-0 bg-transparent">
                {[
                  { name: "Basic Information", value: "Basic" },
                  { name: "Bank Details", value: "Bank" },
                  { name: "Shifts", value: "Shifts" },
                  { name: "Documents", value: "Docs" },
                  { name: "Statutory", value: "Statutory" },
                  { name: "Statements", value: "Statements" },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="w-full justify-start px-6 py-4 text-base font-medium data-[state=active]:bg-gray-100"
                  >
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-end mb-6">
            <Button
              className="bg-black text-white"
              onClick={() => navigateToView("edit-employee", selectedEmployee.id)}
            >
              <Edit className="h-4 w-4 mr-2" />
              EDIT
            </Button>
          </div>

          <Tabs value={activeTab} className="w-full">
            <TabsContent value="Basic">
              <div className="space-y-6">
                {/* Joining Information */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Joining Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Joining Date</Label>
                      <div className="text-base font-medium">
                        {selectedEmployee.basicInfo.joiningInfo.joiningDate
                          ? format(new Date(selectedEmployee.basicInfo.joiningInfo.joiningDate), "dd MMMM yyyy")
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-t-2 border-gray-200" />

                {/* Employee Details */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Employee Details</h3>
                  <div className="mb-6">
                    <Label className="text-sm text-gray-500 mb-2 block">Profile Photo</Label>
                    <div className="w-36 h-36 rounded-lg shadow-md flex items-center justify-center overflow-hidden">
                      <Avatar className="w-full h-full rounded-none">
                        <AvatarImage
                          src={selectedEmployee.basicInfo.empDetails.empImgUrl || "/placeholder.svg"}
                          alt="Employee Image"
                        />
                        <AvatarFallback>
                          <User className="h-12 w-12 text-gray-400" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">First Name</Label>
                      <div className="text-base font-medium">{selectedEmployee.basicInfo.empDetails.firstName}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Middle Name</Label>
                      <div className="text-base font-medium">
                        {selectedEmployee.basicInfo.empDetails.middleName || "N/A"}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Last Name</Label>
                      <div className="text-base font-medium">{selectedEmployee.basicInfo.empDetails.lastName}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Address</Label>
                      <div className="text-base font-medium">{selectedEmployee.basicInfo.empDetails.addr}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Zip Code</Label>
                      <div className="text-base font-medium">{selectedEmployee.basicInfo.empDetails.zip}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Town/City</Label>
                      <div className="text-base font-medium">{selectedEmployee.basicInfo.empDetails.city}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">State/Region</Label>
                      <div className="text-base font-medium">{selectedEmployee.basicInfo.empDetails.state}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Country</Label>
                      <div className="text-base font-medium">{selectedEmployee.basicInfo.empDetails.country}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Email</Label>
                      <div className="text-base font-medium">{selectedEmployee.basicInfo.empDetails.email}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Mobile Number</Label>
                      <div className="text-base font-medium">{selectedEmployee.basicInfo.empDetails.mobile}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Telephone</Label>
                      <div className="text-base font-medium">
                        {selectedEmployee.basicInfo.empDetails.telephone || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-t-2 border-gray-200" />

                {/* Department Details */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Department Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Department</Label>
                      <div className="text-base font-medium">{selectedEmployee.basicInfo.deptDetails.department}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Position</Label>
                      <div className="text-base font-medium">{selectedEmployee.basicInfo.deptDetails.position}</div>
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-t-2 border-gray-200" />

                {/* Kin Information */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Kin Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">First Name</Label>
                      <div className="text-base font-medium">{selectedEmployee.basicInfo.kinInfo.firstName}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Middle Name</Label>
                      <div className="text-base font-medium">
                        {selectedEmployee.basicInfo.kinInfo.middleName || "N/A"}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Last Name</Label>
                      <div className="text-base font-medium">{selectedEmployee.basicInfo.kinInfo.lastName}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Email</Label>
                      <div className="text-base font-medium">{selectedEmployee.basicInfo.kinInfo.email}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Mobile Number</Label>
                      <div className="text-base font-medium">{selectedEmployee.basicInfo.kinInfo.mobile}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Relation</Label>
                      <div className="text-base font-medium">{selectedEmployee.basicInfo.kinInfo.relation}</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="Bank">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Bank Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Bank Name</Label>
                      <div className="text-base font-medium">{selectedEmployee.bankDetails.BankInfo.BankName}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Branch Account</Label>
                      <div className="text-base font-medium">{selectedEmployee.bankDetails.BankInfo.BranchAcc}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Account Holder Name</Label>
                      <div className="text-base font-medium">{selectedEmployee.bankDetails.BankInfo.AccHolderName}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Bank Sort Code</Label>
                      <div className="text-base font-medium">
                        {selectedEmployee.bankDetails.BankInfo.BranchSortCode}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Account Number</Label>
                      <div className="text-base font-medium">{selectedEmployee.bankDetails.BankInfo.AccNumber}</div>
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-t-2 border-gray-200" />

                <div>
                  <h3 className="text-xl font-semibold mb-4">Salary Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Employee Type</Label>
                      <div className="text-base font-medium">
                        {selectedEmployee.bankDetails.salaryInfo.EmployeeType}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Salary Type</Label>
                      <div className="text-base font-medium">{selectedEmployee.bankDetails.salaryInfo.Salary}</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="Shifts">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Shift Details</h3>
                <DataTable columns={shiftColumns} data={mockShiftDetails} />
              </div>
            </TabsContent>

            <TabsContent value="Docs">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Documents</h3>
                <DataTable columns={documentColumns} data={mockDocDetails} />
              </div>
            </TabsContent>

            <TabsContent value="Statutory">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Statutory Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Nationality</Label>
                      <div className="text-base font-medium">{selectedEmployee.StatutoryInfo.BankInfo.Nationality}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Place of Birth</Label>
                      <div className="text-base font-medium">
                        {selectedEmployee.StatutoryInfo.BankInfo.PlaceofBirth}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Date of Birth</Label>
                      <div className="text-base font-medium">
                        {format(new Date(selectedEmployee.StatutoryInfo.BankInfo.DateofBirth), "dd MMMM yyyy")}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Gender</Label>
                      <div className="text-base font-medium">{selectedEmployee.StatutoryInfo.BankInfo.Gender}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Age</Label>
                      <div className="text-base font-medium">{selectedEmployee.StatutoryInfo.BankInfo.Age}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 uppercase">Marital Status</Label>
                      <div className="text-base font-medium">
                        {selectedEmployee.StatutoryInfo.BankInfo.MaritalStatus}
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-t-2 border-gray-200" />

                <div>
                  <h3 className="text-xl font-semibold mb-4">NI Number</h3>
                  <div>
                    <Label className="text-xs text-gray-500 uppercase">NI Number</Label>
                    <div className="text-base font-medium">{selectedEmployee.StatutoryInfo.NInumber.NInumber}</div>
                  </div>
                </div>

                <hr className="my-6 border-t-2 border-gray-200" />

                <div>
                  <h3 className="text-xl font-semibold mb-4">Tax - P45</h3>
                  <div className="text-base font-medium">
                    {selectedEmployee.StatutoryInfo.Tax.HavingtaxP45 ? "Employee has a Tax - P45" : "Not Applicable"}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="Statements">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Employee Statement</h3>
                  <div className="text-base font-medium">
                    {selectedEmployee.StatmentsInfo.EmployeeStatement.Statement === "Statement1" && (
                      <>
                        This is my first job since last 6th April and I have not been receiving taxable jobseeker's
                        allowances and support allowances or taxable incapacity benefits or a State or Occupation
                        pension
                      </>
                    )}
                    {selectedEmployee.StatmentsInfo.EmployeeStatement.Statement === "Statement2" && (
                      <>
                        This is my only job now, but since last 6th April I have had another job, or received taxable
                        jobseeker's allowance or employment and support allowances or taxable incapacity benefits
                      </>
                    )}
                    {selectedEmployee.StatmentsInfo.EmployeeStatement.Statement === "Statement3" && (
                      <>I do not receive a state or I have another job or receive a state or Occupational pension</>
                    )}
                  </div>
                </div>

                <hr className="my-6 border-t-2 border-gray-200" />

                <div>
                  <h3 className="text-xl font-semibold mb-4">Student Loan</h3>
                  <div className="text-base font-medium">
                    {selectedEmployee.StatmentsInfo.studentLoan.studentLoan === "Yes"
                      ? "Employee has a Student Loan"
                      : "Not Applicable"}
                  </div>
                </div>

                <hr className="my-6 border-t-2 border-gray-200" />

                <div>
                  <h3 className="text-xl font-semibold mb-4">Medical Condition</h3>
                  <div className="text-base font-medium">
                    {selectedEmployee.StatmentsInfo.medicalCondition.MedicalCondition}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  const renderEditEmployeeView = () => {
    if (!selectedEmployee) return <div>Employee not found</div>

    return (
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Card className="w-60 flex-shrink-0 shadow-md rounded-none border-r">
          <CardHeader className="pb-0">
            <Button variant="ghost" size="sm" onClick={handleBack} className="self-start p-0 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <CardTitle className="text-xl">Edit Employee</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
              <TabsList className="flex flex-col h-auto p-0 bg-transparent">
                {[
                  { name: "Basic Information", value: "Basic" },
                  { name: "Bank Details", value: "Bank" },
                  { name: "Shifts", value: "Shifts" },
                  { name: "Documents", value: "Docs" },
                  { name: "Statutory", value: "Statutory" },
                  { name: "Statements", value: "Statements" },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="w-full justify-start px-6 py-4 text-base font-medium data-[state=active]:bg-gray-100"
                  >
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="flex justify-end mb-6">
            <Button className="bg-black text-white" onClick={handleSaveEmployee}>
              <Save className="h-4 w-4 mr-2" />
              SAVE
            </Button>
          </div>

          <Tabs value={activeTab} className="w-full">
            <TabsContent value="Basic">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Joining Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="joiningDate">Joining Date</Label>
                      <Input
                        id="joiningDate"
                        type="date"
                        defaultValue={
                          selectedEmployee.basicInfo.joiningInfo.joiningDate
                            ? format(new Date(selectedEmployee.basicInfo.joiningInfo.joiningDate), "yyyy-MM-dd")
                            : ""
                        }
                      />
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-t-2 border-gray-200" />

                <div>
                  <h3 className="text-xl font-semibold mb-4">Employee Details</h3>
                  <div className="mb-6">
                    <Label className="text-sm text-gray-500 mb-2 block">Profile Photo</Label>
                    <div className="w-36 h-36 rounded-lg shadow-md flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Upload Photo</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" defaultValue={selectedEmployee.basicInfo.empDetails.firstName} />
                    </div>
                    <div>
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input id="middleName" defaultValue={selectedEmployee.basicInfo.empDetails.middleName} />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" defaultValue={selectedEmployee.basicInfo.empDetails.lastName} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input id="address" defaultValue={selectedEmployee.basicInfo.empDetails.addr} />
                    </div>
                    <div>
                      <Label htmlFor="zip">Zip Code</Label>
                      <Input id="zip" defaultValue={selectedEmployee.basicInfo.empDetails.zip} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label htmlFor="city">Town/City</Label>
                      <Input id="city" defaultValue={selectedEmployee.basicInfo.empDetails.city} />
                    </div>
                    <div>
                      <Label htmlFor="state">State/Region</Label>
                      <Input id="state" defaultValue={selectedEmployee.basicInfo.empDetails.state} />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" defaultValue={selectedEmployee.basicInfo.empDetails.country} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={selectedEmployee.basicInfo.empDetails.email} />
                    </div>
                    <div>
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input id="mobile" defaultValue={selectedEmployee.basicInfo.empDetails.mobile} />
                    </div>
                    <div>
                      <Label htmlFor="telephone">Telephone</Label>
                      <Input id="telephone" defaultValue={selectedEmployee.basicInfo.empDetails.telephone} />
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-t-2 border-gray-200" />

                <div>
                  <h3 className="text-xl font-semibold mb-4">Department Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Select defaultValue={selectedEmployee.basicInfo.deptDetails.department}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Management">Management</SelectItem>
                          <SelectItem value="FOH">FOH</SelectItem>
                          <SelectItem value="BOH">BOH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input id="position" defaultValue={selectedEmployee.basicInfo.deptDetails.position} />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="Bank">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Bank Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input id="bankName" defaultValue={selectedEmployee.bankDetails.BankInfo.BankName} />
                    </div>
                    <div>
                      <Label htmlFor="branchAcc">Branch Account</Label>
                      <Input id="branchAcc" defaultValue={selectedEmployee.bankDetails.BankInfo.BranchAcc} />
                    </div>
                    <div>
                      <Label htmlFor="accHolderName">Account Holder Name</Label>
                      <Input id="accHolderName" defaultValue={selectedEmployee.bankDetails.BankInfo.AccHolderName} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="sortCode">Bank Sort Code</Label>
                      <Input id="sortCode" defaultValue={selectedEmployee.bankDetails.BankInfo.BranchSortCode} />
                    </div>
                    <div>
                      <Label htmlFor="accNumber">Account Number</Label>
                      <Input id="accNumber" defaultValue={selectedEmployee.bankDetails.BankInfo.AccNumber} />
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-t-2 border-gray-200" />

                <div>
                  <h3 className="text-xl font-semibold mb-4">Salary Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="empType">Employee Type</Label>
                      <Select defaultValue={selectedEmployee.bankDetails.salaryInfo.EmployeeType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="salaryType">Salary Type</Label>
                      <Select defaultValue={selectedEmployee.bankDetails.salaryInfo.Salary}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Hourly">Hourly</SelectItem>
                          <SelectItem value="Annual">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="Shifts">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Shift Details</h3>
                <DataTable columns={shiftColumns} data={mockShiftDetails} />
              </div>
            </TabsContent>

            <TabsContent value="Docs">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Documents</h3>
                <DataTable columns={documentColumns} data={mockDocDetails} />
              </div>
            </TabsContent>

            <TabsContent value="Statutory">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Statutory Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input id="nationality" defaultValue={selectedEmployee.StatutoryInfo.BankInfo.Nationality} />
                    </div>
                    <div>
                      <Label htmlFor="placeOfBirth">Place of Birth</Label>
                      <Input id="placeOfBirth" defaultValue={selectedEmployee.StatutoryInfo.BankInfo.PlaceofBirth} />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        defaultValue={format(
                          new Date(selectedEmployee.StatutoryInfo.BankInfo.DateofBirth),
                          "yyyy-MM-dd",
                        )}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select defaultValue={selectedEmployee.StatutoryInfo.BankInfo.Gender}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" defaultValue={selectedEmployee.StatutoryInfo.BankInfo.Age} />
                    </div>
                    <div>
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <Select defaultValue={selectedEmployee.StatutoryInfo.BankInfo.MaritalStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                          <SelectItem value="Widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <hr className="my-6 border-t-2 border-gray-200" />

                <div>
                  <h3 className="text-xl font-semibold mb-4">NI Number</h3>
                  <div>
                    <Label htmlFor="niNumber">NI Number</Label>
                    <Input id="niNumber" defaultValue={selectedEmployee.StatutoryInfo.NInumber.NInumber} />
                  </div>
                </div>

                <hr className="my-6 border-t-2 border-gray-200" />

                <div>
                  <h3 className="text-xl font-semibold mb-4">Tax - P45</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="taxP45" defaultChecked={selectedEmployee.StatutoryInfo.Tax.HavingtaxP45} />
                    <Label htmlFor="taxP45">Employee has a Tax - P45</Label>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="Statements">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Employee Statement</h3>
                  <RadioGroup defaultValue={selectedEmployee.StatmentsInfo.EmployeeStatement.Statement}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Statement1" id="statement1" />
                      <Label htmlFor="statement1">
                        This is my first job since last 6th April and I have not been receiving taxable jobseeker's
                        allowances
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Statement2" id="statement2" />
                      <Label htmlFor="statement2">
                        This is my only job now, but since last 6th April I have had another job
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Statement3" id="statement3" />
                      <Label htmlFor="statement3">
                        I do not receive a state or I have another job or receive a state or Occupational pension
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <hr className="my-6 border-t-2 border-gray-200" />

                <div>
                  <h3 className="text-xl font-semibold mb-4">Student Loan</h3>
                  <RadioGroup defaultValue={selectedEmployee.StatmentsInfo.studentLoan.studentLoan}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Yes" id="loanYes" />
                      <Label htmlFor="loanYes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="No" id="loanNo" />
                      <Label htmlFor="loanNo">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                <hr className="my-6 border-t-2 border-gray-200" />

                <div>
                  <h3 className="text-xl font-semibold mb-4">Medical Condition</h3>
                  <Textarea
                    placeholder="Enter medical condition details"
                    defaultValue={selectedEmployee.StatmentsInfo.medicalCondition.MedicalCondition}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  const renderAddEmployeeView = () => (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Card className="w-60 flex-shrink-0 shadow-md rounded-none border-r">
        <CardHeader className="pb-0">
          <Button variant="ghost" size="sm" onClick={handleBack} className="self-start p-0 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-xl">Add Employee</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
            <TabsList className="flex flex-col h-auto p-0 bg-transparent">
              {[
                { name: "Basic Information", value: "Basic" },
                { name: "Bank Details", value: "Bank" },
                { name: "Documents", value: "Docs" },
                { name: "Statutory", value: "Statutory" },
                { name: "Statements", value: "Statements" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="w-full justify-start px-6 py-4 text-base font-medium data-[state=active]:bg-gray-100"
                >
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <Button className="bg-black text-white" onClick={handleSaveEmployee}>
            <Save className="h-4 w-4 mr-2" />
            SAVE
          </Button>
        </div>

        <Tabs value={activeTab} className="w-full">
          <TabsContent value="Basic">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Joining Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="joiningDate">Joining Date</Label>
                    <Input id="joiningDate" type="date" />
                  </div>
                </div>
              </div>

              <hr className="my-6 border-t-2 border-gray-200" />

              <div>
                <h3 className="text-xl font-semibold mb-4">Employee Details</h3>
                <div className="mb-6">
                  <Label className="text-sm text-gray-500 mb-2 block">Profile Photo</Label>
                  <div className="w-36 h-36 rounded-lg shadow-md flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Upload Photo</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter first name" />
                  </div>
                  <div>
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input id="middleName" placeholder="Enter middle name" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter last name" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="Enter address" />
                  </div>
                  <div>
                    <Label htmlFor="zip">Zip Code</Label>
                    <Input id="zip" placeholder="Enter zip code" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="city">Town/City</Label>
                    <Input id="city" placeholder="Enter city" />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Region</Label>
                    <Input id="state" placeholder="Enter state" />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" placeholder="Enter country" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter email" />
                  </div>
                  <div>
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input id="mobile" placeholder="Enter mobile number" />
                  </div>
                  <div>
                    <Label htmlFor="telephone">Telephone</Label>
                    <Input id="telephone" placeholder="Enter telephone" />
                  </div>
                </div>
              </div>

              <hr className="my-6 border-t-2 border-gray-200" />

              <div>
                <h3 className="text-xl font-semibold mb-4">Department Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Management">Management</SelectItem>
                        <SelectItem value="FOH">FOH</SelectItem>
                        <SelectItem value="BOH">BOH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input id="position" placeholder="Enter position" />
                  </div>
                </div>
              </div>

              <hr className="my-6 border-t-2 border-gray-200" />

              <div>
                <h3 className="text-xl font-semibold mb-4">Kin Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="kinFirstName">First Name</Label>
                    <Input id="kinFirstName" placeholder="Enter first name" />
                  </div>
                  <div>
                    <Label htmlFor="kinMiddleName">Middle Name</Label>
                    <Input id="kinMiddleName" placeholder="Enter middle name" />
                  </div>
                  <div>
                    <Label htmlFor="kinLastName">Last Name</Label>
                    <Input id="kinLastName" placeholder="Enter last name" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="kinEmail">Email</Label>
                    <Input id="kinEmail" type="email" placeholder="Enter email" />
                  </div>
                  <div>
                    <Label htmlFor="kinMobile">Mobile Number</Label>
                    <Input id="kinMobile" placeholder="Enter mobile number" />
                  </div>
                  <div>
                    <Label htmlFor="kinRelation">Relation</Label>
                    <Input id="kinRelation" placeholder="Enter relation" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="Bank">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Bank Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input id="bankName" placeholder="Enter bank name" />
                  </div>
                  <div>
                    <Label htmlFor="branchAcc">Branch Account</Label>
                    <Input id="branchAcc" placeholder="Enter branch account" />
                  </div>
                  <div>
                    <Label htmlFor="accHolderName">Account Holder Name</Label>
                    <Input id="accHolderName" placeholder="Enter account holder name" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sortCode">Bank Sort Code</Label>
                    <Input id="sortCode" placeholder="Enter sort code" />
                  </div>
                  <div>
                    <Label htmlFor="accNumber">Account Number</Label>
                    <Input id="accNumber" placeholder="Enter account number" />
                  </div>
                </div>
              </div>

              <hr className="my-6 border-t-2 border-gray-200" />

              <div>
                <h3 className="text-xl font-semibold mb-4">Salary Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="empType">Employee Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="salaryType">Salary Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select salary type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Hourly">Hourly</SelectItem>
                        <SelectItem value="Annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="Docs">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Documents</h3>
              <DataTable columns={documentColumns} data={[]} />
            </div>
          </TabsContent>

          <TabsContent value="Statutory">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Statutory Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input id="nationality" placeholder="Enter nationality" />
                  </div>
                  <div>
                    <Label htmlFor="placeOfBirth">Place of Birth</Label>
                    <Input id="placeOfBirth" placeholder="Enter place of birth" />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" placeholder="Enter age" />
                  </div>
                  <div>
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <hr className="my-6 border-t-2 border-gray-200" />

              <div>
                <h3 className="text-xl font-semibold mb-4">NI Number</h3>
                <div>
                  <Label htmlFor="niNumber">NI Number</Label>
                  <Input id="niNumber" placeholder="Enter NI number" />
                </div>
              </div>

              <hr className="my-6 border-t-2 border-gray-200" />

              <div>
                <h3 className="text-xl font-semibold mb-4">Tax - P45</h3>
                <div className="flex items-center space-x-2">
                  <Checkbox id="taxP45" />
                  <Label htmlFor="taxP45">Employee has a Tax - P45</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="Statements">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4">Employee Statement</h3>
                <RadioGroup defaultValue="Statement1">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Statement1" id="statement1" />
                    <Label htmlFor="statement1">
                      This is my first job since last 6th April and I have not been receiving taxable jobseeker's
                      allowances
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Statement2" id="statement2" />
                    <Label htmlFor="statement2">
                      This is my only job now, but since last 6th April I have had another job
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Statement3" id="statement3" />
                    <Label htmlFor="statement3">
                      I do not receive a state or I have another job or receive a state or Occupational pension
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <hr className="my-6 border-t-2 border-gray-200" />

              <div>
                <h3 className="text-xl font-semibold mb-4">Student Loan</h3>
                <RadioGroup defaultValue="No">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Yes" id="loanYes" />
                    <Label htmlFor="loanYes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="No" id="loanNo" />
                    <Label htmlFor="loanNo">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <hr className="my-6 border-t-2 border-gray-200" />

              <div>
                <h3 className="text-xl font-semibold mb-4">Medical Condition</h3>
                <Textarea placeholder="Enter medical condition details" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )

  const renderViewCalendarView = () => {
    if (!selectedEmployee) return <div>Employee not found</div>

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const startOfWeekDate = startOfWeek(viewDate)
    const weekDates = Array.from({ length: 7 }, (_, i) => addDays(startOfWeekDate, i))

    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={handleBack} className="mr-2 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Employee Calendar - {selectedEmployee.empName}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="sm" onClick={() => setViewDate(addDays(viewDate, -7))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-4 py-2 text-sm font-medium min-w-[150px] text-center">
                {format(viewDate, "MMMM yyyy")}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setViewDate(addDays(viewDate, 7))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="p-0">
            {/* Calendar Header */}
            <div className="grid grid-cols-7 border-b bg-gray-50">
              {weekDays.map((day, index) => (
                <div key={day} className="p-4 text-center font-medium text-gray-600 border-r last:border-r-0">
                  <div className="text-sm">{day}</div>
                  <div className="text-lg font-bold mt-1">{format(weekDates[index], "d")}</div>
                </div>
              ))}
            </div>

            {/* Calendar Body */}
            <div className="grid grid-cols-7" style={{ minHeight: "400px" }}>
              {weekDates.map((date, index) => {
                const dayShifts = selectedEmployee.shifts.filter((shift) => isSameDay(shift.shiftDate, date))
                const isToday = isSameDay(date, new Date())

                return (
                  <div
                    key={index}
                    className={`border-r last:border-r-0 border-b p-2 relative group ${isToday ? "bg-yellow-50" : ""}`}
                    style={{ minHeight: "100px" }}
                  >
                    {dayShifts.map((shift) => (
                      <div
                        key={shift.id}
                        className={`mb-1 p-2 rounded text-xs ${
                          shift.isApproved
                            ? "bg-green-100 border-l-4 border-green-500"
                            : "bg-gray-100 border-l-4 border-black"
                        }`}
                      >
                        <div className="font-medium">{shift.shiftType}</div>
                        <div>
                          {format(shift.shiftStartTime, "HH:mm")} - {format(shift.shiftEndTime, "HH:mm")}
                        </div>
                        <div className="flex justify-end space-x-1 mt-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedShift(shift)
                              setShowEditShiftDialog(true)
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Add shift button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowAddShiftDialog(true)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case "all-employees":
        return renderAllEmployeesView()
      case "view-employee":
        return renderViewEmployeeView()
      case "edit-employee":
        return renderEditEmployeeView()
      case "add-employee":
        return renderAddEmployeeView()
      case "view-calendar":
        return renderViewCalendarView()
      default:
        return renderAllEmployeesView()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentView()}

      {/* Delete Employee Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Delete Employee
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteDialog(false)} className="p-0">
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <Trash2 className="h-10 w-10 mx-auto text-gray-500" />
            <h4 className="text-lg font-medium">Delete Employee</h4>
            <div className="mt-2">
              <Button className="bg-black text-white hover:bg-gray-800" onClick={confirmDeleteEmployee}>
                Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Confirmation Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Success
              <Button variant="ghost" size="sm" onClick={() => setShowSaveDialog(false)} className="p-0">
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <Check className="h-10 w-10 mx-auto text-green-600" />
            <h4 className="text-lg font-medium">Employee saved successfully!</h4>
            <div className="mt-2">
              <Button className="bg-black text-white hover:bg-gray-800" onClick={() => setShowSaveDialog(false)}>
                OK
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Shift Dialog */}
      <Dialog open={showAddShiftDialog} onOpenChange={setShowAddShiftDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Add Shift
              <Button className="bg-black text-white hover:bg-gray-800">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shiftCity">City</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="London">London</SelectItem>
                    <SelectItem value="New York">New York</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="shiftEmployee">Employee</Label>
                <Input id="shiftEmployee" value={selectedEmployee?.empName || ""} disabled />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shiftStartTime">Start Time</Label>
                <Input id="shiftStartTime" type="time" />
              </div>
              <div>
                <Label htmlFor="shiftEndTime">End Time</Label>
                <Input id="shiftEndTime" type="time" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="shiftApprove" />
              <Label htmlFor="shiftApprove">Approve</Label>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Shift Dialog */}
      <Dialog open={showEditShiftDialog} onOpenChange={setShowEditShiftDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Edit Shift
              <Button className="bg-black text-white hover:bg-gray-800">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editShiftCity">City</Label>
                <Select defaultValue={selectedShift?.location}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="London">London</SelectItem>
                    <SelectItem value="New York">New York</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editShiftEmployee">Employee</Label>
                <Input id="editShiftEmployee" value={selectedEmployee?.empName || ""} disabled />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editShiftStartTime">Start Time</Label>
                <Input
                  id="editShiftStartTime"
                  type="time"
                  defaultValue={selectedShift ? format(selectedShift.shiftStartTime, "HH:mm") : ""}
                />
              </div>
              <div>
                <Label htmlFor="editShiftEndTime">End Time</Label>
                <Input
                  id="editShiftEndTime"
                  type="time"
                  defaultValue={selectedShift ? format(selectedShift.shiftEndTime, "HH:mm") : ""}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="editShiftApprove" defaultChecked={selectedShift?.isApproved} />
              <Label htmlFor="editShiftApprove">Approve</Label>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EmployeeManagementComponent
