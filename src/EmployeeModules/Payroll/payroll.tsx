"use client"

import { TabsContent } from "@/components/ui/tabs"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { format } from "date-fns"
import { Download, Plus, Search, Trash2, Save, ArrowLeft, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// --- Data Interfaces ---
interface Payroll {
  Report_Name: string
  Start_date: string
  End_date: string
}

interface Employee {
  id: string
  empName: string
  empImgUrl: string
  department: string
}

interface ChecklistItem {
  id: number
  value: string
  isSelected: boolean
}

// --- Mock Data ---
const mockAllPayroll: Payroll[] = [
  {
    Report_Name: "March 2024 Payroll",
    Start_date: "2024-03-01T00:00:00.000Z",
    End_date: "2024-03-31T00:00:00.000Z",
  },
  {
    Report_Name: "April 2024 Payroll",
    Start_date: "2024-04-01T00:00:00.000Z",
    End_date: "2024-04-30T00:00:00.000Z",
  },
  {
    Report_Name: "May 2024 Payroll",
    Start_date: "2024-05-01T00:00:00.000Z",
    End_date: "2024-05-31T00:00:00.000Z",
  },
]

const mockAllEmployees: Employee[] = [
  {
    id: "EMP001",
    empName: "John Doe",
    empImgUrl: "/placeholder.svg?height=40&width=40",
    department: "Engineering",
  },
  {
    id: "EMP002",
    empName: "Jane Smith",
    empImgUrl: "/placeholder.svg?height=40&width=40",
    department: "Marketing",
  },
  {
    id: "EMP003",
    empName: "Mike Johnson",
    empImgUrl: "/placeholder.svg?height=40&width=40",
    department: "Sales",
  },
  {
    id: "EMP004",
    empName: "Sarah Wilson",
    empImgUrl: "/placeholder.svg?height=40&width=40",
    department: "HR",
  },
  {
    id: "EMP005",
    empName: "David Brown",
    empImgUrl: "/placeholder.svg?height=40&width=40",
    department: "Finance",
  },
]

const PayrollComponent: React.FC = () => {
  const [currentView, setCurrentView] = useState<"all-payroll" | "new-payroll">("all-payroll")

  // --- AllPayrollComponent States ---
  const [payrollReports, setPayrollReports] = useState<Payroll[]>(mockAllPayroll)
  const [downloadOptionsVisible, setDownloadOptionsVisible] = useState(false)
  const [startDateFilter, setStartDateFilter] = useState<string>("")
  const [endDateFilter, setEndDateFilter] = useState<string>("")

  // --- NewPayrollComponent States ---
  const [employees, setEmployees] = useState<Employee[]>(mockAllEmployees)
  const [displayEmployees, setDisplayEmployees] = useState<Employee[]>(mockAllEmployees)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [showAddFieldDialog, setShowAddFieldDialog] = useState(false)
  const [showSaveReportDialog, setShowSaveReportDialog] = useState(false)
  const [showDeleteEmployeeDialog, setShowDeleteEmployeeDialog] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null)
  const [reportName, setReportName] = useState<string>("")

  // Checklists for "Add Fields" dialog
  const [checklistShift, setChecklistShift] = useState<ChecklistItem[]>([
    { id: 1, value: "Shift Type", isSelected: true },
    { id: 2, value: "Date", isSelected: true },
    { id: 3, value: "Location", isSelected: false },
    { id: 4, value: "Start Time", isSelected: false },
    { id: 5, value: "End Time", isSelected: false },
    { id: 6, value: "Break", isSelected: false },
    { id: 7, value: "Approved", isSelected: false },
  ])
  const [checklistBank1, setChecklistBank1] = useState<ChecklistItem[]>([
    { id: 1, value: "Bank Name", isSelected: true },
    { id: 2, value: "Branch Account", isSelected: true },
    { id: 3, value: "Account Holder Name", isSelected: false },
    { id: 4, value: "Branch Sort Code", isSelected: false },
    { id: 5, value: "Account Number", isSelected: false },
  ])
  const [checklistBank2, setChecklistBank2] = useState<ChecklistItem[]>([
    { id: 1, value: "Employee Salary", isSelected: false },
    { id: 2, value: "Hourly Salary", isSelected: false },
    { id: 3, value: "Fixed Salary", isSelected: false },
  ])
  const [checklistDetails1, setChecklistDetails1] = useState<ChecklistItem[]>([
    { id: 1, value: "Joining Date", isSelected: true },
  ])
  const [checklistDetails2, setChecklistDetails2] = useState<ChecklistItem[]>([
    { id: 1, value: "First Name", isSelected: true },
    { id: 2, value: "Middle Name", isSelected: false },
    { id: 3, value: "Last Name", isSelected: false },
    { id: 4, value: "Address", isSelected: false },
    { id: 5, value: "Zip Code", isSelected: false },
    { id: 6, value: "Town/City", isSelected: false },
    { id: 7, value: "State/Region", isSelected: false },
    { id: 8, value: "Country", isSelected: false },
    { id: 9, value: "Email", isSelected: false },
    { id: 10, value: "Mobile Number", isSelected: false },
    { id: 11, value: "Telephone", isSelected: false },
  ])
  const [checklistDetails3, setChecklistDetails3] = useState<ChecklistItem[]>([
    { id: 1, value: "Department", isSelected: true },
    { id: 2, value: "Position", isSelected: false },
    { id: 3, value: "Location", isSelected: false },
  ])
  const [checklistDetails4, setChecklistDetails4] = useState<ChecklistItem[]>([
    { id: 1, value: "First Name", isSelected: true },
    { id: 2, value: "Middle Name", isSelected: false },
    { id: 3, value: "Last Name", isSelected: false },
    { id: 4, value: "Address", isSelected: false },
    { id: 5, value: "Zip Code", isSelected: false },
    { id: 6, value: "Town/City", isSelected: false },
    { id: 7, value: "State/Region", isSelected: false },
    { id: 8, value: "Country", isSelected: false },
    { id: 9, value: "Email", isSelected: false },
    { id: 10, value: "Mobile Number", isSelected: false },
    { id: 11, value: "Telephone", isSelected: false },
  ])

  const [showFieldCount, setShowFieldCount] = useState(false)

  // --- AllPayrollComponent Functions ---
  const filterPayrollReports = useCallback(() => {
    let filtered = mockAllPayroll

    if (startDateFilter) {
      const start = new Date(startDateFilter)
      filtered = filtered.filter((report) => new Date(report.Start_date) >= start)
    }
    if (endDateFilter) {
      const end = new Date(endDateFilter)
      filtered = filtered.filter((report) => new Date(report.End_date) <= end)
    }
    setPayrollReports(filtered)
  }, [startDateFilter, endDateFilter])

  useEffect(() => {
    filterPayrollReports()
  }, [startDateFilter, endDateFilter, filterPayrollReports])

  const handleDownloadCSV = () => {
    console.log("Downloading CSV:", payrollReports)
    // In a real app, you'd generate and download the CSV here.
    alert("CSV download initiated (check console for data).")
  }

  const handleDownloadExcel = () => {
    console.log("Downloading Excel:", payrollReports)
    // In a real app, you'd generate and download the Excel here.
    alert("Excel download initiated (check console for data).")
  }

  // --- NewPayrollComponent Functions ---
  const filterEmployees = useCallback(() => {
    let filtered = employees.filter(
      (emp) =>
        emp.empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (selectedDepartments.length > 0 && !selectedDepartments.includes("all")) {
      filtered = filtered.filter((emp) => selectedDepartments.includes(emp.department))
    }
    setDisplayEmployees(filtered)
  }, [employees, searchTerm, selectedDepartments])

  useEffect(() => {
    filterEmployees()
  }, [searchTerm, selectedDepartments, filterEmployees])

  const handleDepartmentChange = (value: string) => {
    if (value === "all") {
      setSelectedDepartments(
        selectedDepartments.includes("all")
          ? []
          : ["BOH", "FOH", "Management", "Engineering", "Marketing", "Sales", "HR", "Finance", "all"],
      )
    } else {
      setSelectedDepartments((prev) =>
        prev.includes(value) ? prev.filter((dept) => dept !== value && dept !== "all") : [...prev, value],
      )
    }
  }

  const handleDeleteEmployee = (employee: Employee) => {
    setEmployeeToDelete(employee)
    setShowDeleteEmployeeDialog(true)
  }

  const confirmDeleteEmployee = () => {
    if (employeeToDelete) {
      console.log(`Deleting employee: ${employeeToDelete.id}`)
      setDisplayEmployees(displayEmployees.filter((emp) => emp.id !== employeeToDelete.id))
      setEmployees(employees.filter((emp) => emp.id !== employeeToDelete.id)) // Update original list too
      setShowDeleteEmployeeDialog(false)
      setEmployeeToDelete(null)
    }
  }

  const handleSaveReport = () => {
    setShowSaveReportDialog(true)
  }

  const confirmSaveReport = () => {
    if (reportName.trim()) {
      console.log(`Saving report: ${reportName}`)
      // Here you would typically send the report configuration and selected employees to a backend
      setShowSaveReportDialog(false)
      setReportName("")
      alert(`Report "${reportName}" saved!`)
    } else {
      alert("Please enter a report name.")
    }
  }

  const getCheckedCount = (checklist: ChecklistItem[]) => {
    return checklist.filter((item) => item.isSelected).length
  }

  const handleChecklistChange = (
    setter: React.Dispatch<React.SetStateAction<ChecklistItem[]>>,
    item: ChecklistItem,
    checked: boolean,
  ) => {
    setter((prev) => prev.map((i) => (i.id === item.id ? { ...i, isSelected: checked } : i)))
  }

  const handleChecklistSelectAll = (
    setter: React.Dispatch<React.SetStateAction<ChecklistItem[]>>,
    checked: boolean,
  ) => {
    setter((prev) => prev.map((i) => ({ ...i, isSelected: checked })))
  }

  const totalBasicInfoFields =
    getCheckedCount(checklistDetails1) +
    getCheckedCount(checklistDetails2) +
    getCheckedCount(checklistDetails3) +
    getCheckedCount(checklistDetails4)
  const totalBankDetailsFields = getCheckedCount(checklistBank1) + getCheckedCount(checklistBank2)
  const totalShiftFields = getCheckedCount(checklistShift)

  const renderAllPayrollView = () => (
    <div className="px-12 py-6 mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Payroll Report</h1>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="fromDate" className="sr-only">
              From Date
            </Label>
            <Input
              id="fromDate"
              type="date"
              placeholder="From Date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              className="w-[150px]"
            />
            <Label htmlFor="toDate" className="sr-only">
              To Date
            </Label>
            <Input
              id="toDate"
              type="date"
              placeholder="To Date"
              value={endDateFilter}
              onChange={(e) => setEndDateFilter(e.target.value)}
              className="w-[150px]"
            />
          </div>
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              className="px-3 mx-2 bg-transparent"
              onClick={() => setDownloadOptionsVisible(!downloadOptionsVisible)}
              onMouseEnter={() => setDownloadOptionsVisible(true)}
            >
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
            {downloadOptionsVisible && (
              <div
                className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10"
                onMouseLeave={() => setDownloadOptionsVisible(false)}
              >
                <Button variant="ghost" className="w-full justify-start" onClick={handleDownloadCSV}>
                  CSV
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={handleDownloadExcel}>
                  EXCEL
                </Button>
              </div>
            )}
          </div>
          <Button className="bg-black text-white hover:bg-gray-800" onClick={() => setCurrentView("new-payroll")}>
            <Plus className="h-4 w-4 mr-2" /> Create New
          </Button>
        </div>
      </div>

      {/* Payroll Table */}
      <Card>
        <CardContent className="p-0">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>REPORT NAME</TableHead>
                  <TableHead>START DATE</TableHead>
                  <TableHead>END DATE</TableHead>
                  <TableHead>DOWNLOAD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrollReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No payroll reports found.
                    </TableCell>
                  </TableRow>
                ) : (
                  payrollReports.map((report, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>{report.Report_Name}</TableCell>
                      <TableCell>{format(new Date(report.Start_date), "dd MMMM yyyy")}</TableCell>
                      <TableCell>{format(new Date(report.End_date), "dd MMMM yyyy")}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleDownloadCSV}>
                              <FileText className="h-4 w-4 mr-2" />
                              CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDownloadExcel}>
                              <FileText className="h-4 w-4 mr-2" />
                              EXCEL
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderNewPayrollView = () => (
    <div className="px-6 py-6  mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Payroll Reports</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowAddFieldDialog(true)}>
            <Plus className="h-4 w-4 mr-2" /> ADD FIELDS
          </Button>
          <Button className="bg-black text-white hover:bg-gray-800" onClick={handleSaveReport}>
            <Save className="h-4 w-4 mr-2" /> SAVE REPORT
          </Button>
        </div>
      </div>

      {/* Report Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="fromDateNew" className="text-xs text-gray-500">
                From Date
              </Label>
              <Input id="fromDateNew" type="date" placeholder="05 April 2021" className="border-b-2 border-gray-300" />
            </div>
            <div>
              <Label htmlFor="toDateNew" className="text-xs text-gray-500">
                To Date
              </Label>
              <Input id="toDateNew" type="date" placeholder="10 April 2021" className="border-b-2 border-gray-300" />
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Employee Name or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 border-b-2 border-gray-300"
              />
            </div>
            <div>
              <Select value={selectedDepartments.join(",")} onValueChange={handleDepartmentChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BOH">BOH</SelectItem>
                  <SelectItem value="FOH">FOH</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="all">Select All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Card for Number of Field selected */}
      {showFieldCount && (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          <Card className="shadow-lg p-4 text-center">
            <Badge className="absolute top-2 right-2 bg-black text-white rounded-full px-2 py-1 text-xs">
              {totalBasicInfoFields}
            </Badge>
            <CardContent className="pt-6">
              <div className="font-semibold text-sm uppercase opacity-70">Basic Info.</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg p-4 text-center">
            <Badge className="absolute top-2 right-2 bg-black text-white rounded-full px-2 py-1 text-xs">
              {totalBankDetailsFields}
            </Badge>
            <CardContent className="pt-6">
              <div className="font-semibold text-sm uppercase opacity-70">Bank Details</div>
            </CardContent>
          </Card>
          <Card className="shadow-lg p-4 text-center">
            <Badge className="absolute top-2 right-2 bg-black text-white rounded-full px-2 py-1 text-xs">
              {totalShiftFields}
            </Badge>
            <CardContent className="pt-6">
              <div className="font-semibold text-sm uppercase opacity-70">Shifts</div>
            </CardContent>
          </Card>
          <div className="col-span-3" /> {/* Placeholder for layout */}
        </div>
      )}

      {/* Employee Table for Payroll */}
      <Card>
        <CardContent className="p-0">
          <div className="verflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>EMPLOYEE NAME</TableHead>
                  <TableHead>EMP ID</TableHead>
                  <TableHead>DEPARTMENT</TableHead>
                  <TableHead>DELETE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No employees found.
                    </TableCell>
                  </TableRow>
                ) : (
                  displayEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <Checkbox />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={employee.empImgUrl || "/placeholder.svg"} alt={employee.empName} />
                            <AvatarFallback>
                              {employee.empName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{employee.empName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{employee.id}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteEmployee(employee)}>
                          <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Fields Dialog */}
      <Dialog open={showAddFieldDialog} onOpenChange={setShowAddFieldDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center">
                <Button variant="ghost" size="sm" onClick={() => setShowAddFieldDialog(false)} className="mr-2 p-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                Select Fields For Payroll Report
              </DialogTitle>
              <Button
                className="bg-black text-white hover:bg-gray-800"
                onClick={() => {
                  setShowFieldCount(true)
                  setShowAddFieldDialog(false)
                }}
              >
                <Plus className="h-4 w-4 mr-2" /> ADD
              </Button>
            </div>
          </DialogHeader>
          <Tabs defaultValue="basic-information" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic-information">Basic Information</TabsTrigger>
              <TabsTrigger value="bank-details">Bank Details</TabsTrigger>
              <TabsTrigger value="shifts">Shifts</TabsTrigger>
            </TabsList>
            <div className="p-4 max-h-[500px] overflow-y-auto">
              <TabsContent value="basic-information">
                <ul className="space-y-2">
                  <li>
                    <div className="flex items-center justify-between font-bold text-sm uppercase">
                      FIELD NAME
                      <Checkbox
                        checked={checklistDetails1.every((item) => item.isSelected)}
                        onCheckedChange={(checked) =>
                          handleChecklistSelectAll(setChecklistDetails1, checked as boolean)
                        }
                      />
                    </div>
                  </li>
                  {checklistDetails1.map((item) => (
                    <li key={item.id} className="flex items-center justify-between">
                      {item.value}
                      <Checkbox
                        checked={item.isSelected}
                        onCheckedChange={(checked) =>
                          handleChecklistChange(setChecklistDetails1, item, checked as boolean)
                        }
                      />
                    </li>
                  ))}
                </ul>
                <ul className="mt-4 space-y-2">
                  <li>
                    <div className="flex items-center justify-between font-bold text-sm uppercase">
                      BASIC DETAILS
                      <Checkbox
                        checked={checklistDetails2.every((item) => item.isSelected)}
                        onCheckedChange={(checked) =>
                          handleChecklistSelectAll(setChecklistDetails2, checked as boolean)
                        }
                      />
                    </div>
                  </li>
                  {checklistDetails2.map((item) => (
                    <li key={item.id} className="flex items-center justify-between">
                      {item.value}
                      <Checkbox
                        checked={item.isSelected}
                        onCheckedChange={(checked) =>
                          handleChecklistChange(setChecklistDetails2, item, checked as boolean)
                        }
                      />
                    </li>
                  ))}
                </ul>
                <ul className="mt-4 space-y-2">
                  <li>
                    <div className="flex items-center justify-between font-bold text-sm uppercase">
                      DEPARTMENT & LOCATION
                      <Checkbox
                        checked={checklistDetails3.every((item) => item.isSelected)}
                        onCheckedChange={(checked) =>
                          handleChecklistSelectAll(setChecklistDetails3, checked as boolean)
                        }
                      />
                    </div>
                  </li>
                  {checklistDetails3.map((item) => (
                    <li key={item.id} className="flex items-center justify-between">
                      {item.value}
                      <Checkbox
                        checked={item.isSelected}
                        onCheckedChange={(checked) =>
                          handleChecklistChange(setChecklistDetails3, item, checked as boolean)
                        }
                      />
                    </li>
                  ))}
                </ul>
                <ul className="mt-4 space-y-2">
                  <li>
                    <div className="flex items-center justify-between font-bold text-sm uppercase">
                      KIN DETAILS
                      <Checkbox
                        checked={checklistDetails4.every((item) => item.isSelected)}
                        onCheckedChange={(checked) =>
                          handleChecklistSelectAll(setChecklistDetails4, checked as boolean)
                        }
                      />
                    </div>
                  </li>
                  {checklistDetails4.map((item) => (
                    <li key={item.id} className="flex items-center justify-between">
                      {item.value}
                      <Checkbox
                        checked={item.isSelected}
                        onCheckedChange={(checked) =>
                          handleChecklistChange(setChecklistDetails4, item, checked as boolean)
                        }
                      />
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="bank-details">
                <ul className="space-y-2">
                  <li>
                    <div className="flex items-center justify-between font-bold text-sm uppercase">
                      BANK DETAILS
                      <Checkbox
                        checked={checklistBank1.every((item) => item.isSelected)}
                        onCheckedChange={(checked) => handleChecklistSelectAll(setChecklistBank1, checked as boolean)}
                      />
                    </div>
                  </li>
                  {checklistBank1.map((item) => (
                    <li key={item.id} className="flex items-center justify-between">
                      {item.value}
                      <Checkbox
                        checked={item.isSelected}
                        onCheckedChange={(checked) =>
                          handleChecklistChange(setChecklistBank1, item, checked as boolean)
                        }
                      />
                    </li>
                  ))}
                </ul>
                <ul className="mt-4 space-y-2">
                  <li>
                    <div className="flex items-center justify-between font-bold text-sm uppercase">
                      SALARY DETAILS
                      <Checkbox
                        checked={checklistBank2.every((item) => item.isSelected)}
                        onCheckedChange={(checked) => handleChecklistSelectAll(setChecklistBank2, checked as boolean)}
                      />
                    </div>
                  </li>
                  {checklistBank2.map((item) => (
                    <li key={item.id} className="flex items-center justify-between">
                      {item.value}
                      <Checkbox
                        checked={item.isSelected}
                        onCheckedChange={(checked) =>
                          handleChecklistChange(setChecklistBank2, item, checked as boolean)
                        }
                      />
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="shifts">
                <ul className="space-y-2">
                  <li>
                    <div className="flex items-center justify-between font-bold text-sm uppercase">
                      SHIFT DETAILS
                      <Checkbox
                        checked={checklistShift.every((item) => item.isSelected)}
                        onCheckedChange={(checked) => handleChecklistSelectAll(setChecklistShift, checked as boolean)}
                      />
                    </div>
                  </li>
                  {checklistShift.map((item) => (
                    <li key={item.id} className="flex items-center justify-between">
                      {item.value}
                      <Checkbox
                        checked={item.isSelected}
                        onCheckedChange={(checked) =>
                          handleChecklistChange(setChecklistShift, item, checked as boolean)
                        }
                      />
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Save Report Dialog */}
      <Dialog open={showSaveReportDialog} onOpenChange={setShowSaveReportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowSaveReportDialog(false)} className="p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogTitle className="text-center text-lg font-bold">Name Your Report Before Saving it</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <Label htmlFor="reportName" className="text-base">
              Name
            </Label>
            <Input
              id="reportName"
              type="text"
              placeholder="BOH - Payroll(March)"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              className="mt-2 border-b-2 border-gray-300 rounded-none"
            />
            <div className="flex justify-end mt-6">
              <Button className="bg-black text-white hover:bg-gray-800" onClick={confirmSaveReport}>
                Save Report
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Employee Confirmation Dialog */}
      <Dialog open={showDeleteEmployeeDialog} onOpenChange={setShowDeleteEmployeeDialog}>
        <DialogContent className="max-w-sm">
          <div className="text-center space-y-4">
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteEmployeeDialog(false)} className="p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Trash2 className="h-10 w-10 mx-auto text-gray-500 hover:text-red-600" />
            <h4 className="text-lg font-medium mt-4">Delete Employee ?</h4>
            <div className="mt-2">
              <Button className="bg-black text-white hover:bg-gray-800 w-24" onClick={confirmDeleteEmployee}>
                DELETE
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === "all-payroll" ? renderAllPayrollView() : renderNewPayrollView()}
    </div>
  )
}

export default PayrollComponent
