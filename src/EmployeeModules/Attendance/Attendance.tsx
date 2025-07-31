"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { format, isSameDay, startOfWeek, addDays } from "date-fns"
import { ChevronLeft, ChevronRight, CalendarIcon, Eye, Filter } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Checkbox } from "../../components/ui/checkbox"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"

interface Employee {
  id: string
  empName: string
  empImgUrl: string
  department: string
  status: "On Duty" | "Off Duty" | "Late" | "Absent"
}

interface AttendanceDetail {
  attendance_date: string
  attendance_Details: {
    empAttendanceDetails: Employee[]
  }
}

const AttendanceComponent: React.FC = () => {
  const [view, setView] = useState<"D" | "W">("D")
  const [viewDate, setViewDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [dispAttendance, setDispAttendance] = useState<Employee[]>([])
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Sample attendance data
  const [allAttendance] = useState<AttendanceDetail[]>([
    {
      attendance_date: new Date().toISOString(),
      attendance_Details: {
        empAttendanceDetails: [
          {
            id: "EMP001",
            empName: "John Doe",
            empImgUrl: "/placeholder.svg?height=40&width=40",
            department: "Engineering",
            status: "On Duty",
          },
          {
            id: "EMP002",
            empName: "Jane Smith",
            empImgUrl: "/placeholder.svg?height=40&width=40",
            department: "Marketing",
            status: "Off Duty",
          },
          {
            id: "EMP003",
            empName: "Mike Johnson",
            empImgUrl: "/placeholder.svg?height=40&width=40",
            department: "Sales",
            status: "Late",
          },
          {
            id: "EMP004",
            empName: "Sarah Wilson",
            empImgUrl: "/placeholder.svg?height=40&width=40",
            department: "HR",
            status: "On Duty",
          },
          {
            id: "EMP005",
            empName: "David Brown",
            empImgUrl: "/placeholder.svg?height=40&width=40",
            department: "Finance",
            status: "Absent",
          },
        ],
      },
    },
    {
      attendance_date: addDays(new Date(), -1).toISOString(),
      attendance_Details: {
        empAttendanceDetails: [
          {
            id: "EMP001",
            empName: "John Doe",
            empImgUrl: "/placeholder.svg?height=40&width=40",
            department: "Engineering",
            status: "On Duty",
          },
          {
            id: "EMP002",
            empName: "Jane Smith",
            empImgUrl: "/placeholder.svg?height=40&width=40",
            department: "Marketing",
            status: "On Duty",
          },
        ],
      },
    },
  ])

  useEffect(() => {
    getAttendanceOfDay()
  }, [viewDate, allAttendance])

  const getAttendanceOfDay = () => {
    const att = allAttendance.find((x) => isSameDay(viewDate, new Date(x.attendance_date)))
    if (att) {
      setDispAttendance(att.attendance_Details.empAttendanceDetails)
    } else {
      setDispAttendance([])
    }
  }

  const changeDate = (date: Date) => {
    setViewDate(date)
    setSelectedDate(date)
  }

  const toggleTab = (date: Date) => {
    setSelectedDate(date)
    setViewDate(date)
  }

  const checkDate = (date: Date) => {
    return isSameDay(date, viewDate)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Duty":
        return "bg-green-100 text-green-800"
      case "Off Duty":
        return "bg-red-100 text-red-800"
      case "Late":
        return "bg-yellow-100 text-yellow-800"
      case "Absent":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getWeekDays = () => {
    const start = startOfWeek(viewDate)
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }

  const handleEmployeeSelect = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees([...selectedEmployees, employeeId])
    } else {
      setSelectedEmployees(selectedEmployees.filter((id) => id !== employeeId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(filteredAttendance.map((emp) => emp.id))
    } else {
      setSelectedEmployees([])
    }
  }

  const filteredAttendance = dispAttendance.filter((employee) => {
    const matchesSearch =
      employee.empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const viewCalendar = (employeeId: string) => {
    // Navigate to employee calendar view
    console.log(`Navigate to calendar for employee: ${employeeId}`)
  }

  return (
    <div className="py-6 px-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="text-2xl font-bold">Attendance</h1>

        {/* View Toggle */}
        <div className="flex items-center space-x-4">
          <Tabs value={view} onValueChange={(value) => setView(value as "D" | "W")}>
            <TabsList>
              <TabsTrigger value="D">Day View</TabsTrigger>
              <TabsTrigger value="W">Week View</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Date Navigation */}
          <div className="flex items-center space-x-2 border rounded-md">
            <Button variant="ghost" size="sm" onClick={() => changeDate(addDays(viewDate, -1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-4 py-2 text-sm font-medium min-w-[150px] text-center">
              {format(viewDate, "MMMM d, yyyy")}
            </div>
            <Button variant="ghost" size="sm" onClick={() => changeDate(addDays(viewDate, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Week View Navigation */}
      {view === "W" && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-center space-x-1">
              {getWeekDays().map((day, index) => (
                <button
                  key={index}
                  onClick={() => toggleTab(day)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    checkDate(day)
                      ? "bg-black text-white border-b-2 border-black"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xs text-gray-500 uppercase">{format(day, "EEE")}</div>
                    <div className="font-semibold">{format(day, "d")}</div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Attendance for {format(viewDate, "MMMM d, yyyy")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="On Duty">On Duty</SelectItem>
                <SelectItem value="Off Duty">Off Duty</SelectItem>
                <SelectItem value="Late">Late</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Attendance Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedEmployees.length === filteredAttendance.length && filteredAttendance.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>EMPLOYEE NAME</TableHead>
                  <TableHead>EMP ID</TableHead>
                  <TableHead>DEPARTMENT</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead className="text-center">VIEW SCHEDULE</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No attendance data found for {format(viewDate, "MMMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAttendance.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedEmployees.includes(employee.id)}
                          onCheckedChange={(checked) => handleEmployeeSelect(employee.id, checked as boolean)}
                        />
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
                        <Badge className={getStatusColor(employee.status)}>{employee.status}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => viewCalendar(employee.id)}>
                              <CalendarIcon className="h-4 w-4 mr-2" />
                              View Calendar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Filter className="h-4 w-4 mr-2" />
                              View Details
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

          {/* Summary */}
          {filteredAttendance.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
              <span>Total: {filteredAttendance.length}</span>
              <span>On Duty: {filteredAttendance.filter((emp) => emp.status === "On Duty").length}</span>
              <span>Off Duty: {filteredAttendance.filter((emp) => emp.status === "Off Duty").length}</span>
              <span>Late: {filteredAttendance.filter((emp) => emp.status === "Late").length}</span>
              <span>Absent: {filteredAttendance.filter((emp) => emp.status === "Absent").length}</span>
              {selectedEmployees.length > 0 && (
                <span className="font-medium">Selected: {selectedEmployees.length}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default AttendanceComponent
