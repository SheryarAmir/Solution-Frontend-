"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { format, addDays, startOfWeek, endOfWeek, isSameDay, differenceInHours, parseISO } from "date-fns"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Trash2,
  Pencil,
  Copy,
  CheckCircle,
  X,
  ArrowLeft,
  Info,
  User,
  ChevronDown,
  Save,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Label } from "../../components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Switch } from "../../components/ui/switch"
import { Checkbox } from "../../components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { Badge } from "../../components/ui/badge"

// --- Data Interfaces ---
interface ShiftCalendarEntry {
  id: string
  weekStart: string
  weekEnd: string
  totalShift: number
  totalLeaves: number
  status: "Published" | "Draft"
}

interface EmployeeBasicInfo {
  firstName: string
  middleName: string
  lastName: string
  city: string
}

interface EmployeeDeptDetails {
  department: string
  position: string
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

interface Employee {
  id: string
  empName: string
  empImgUrl: string
  department: string
  basicInfo: {
    empDetails: EmployeeBasicInfo
    deptDetails: EmployeeDeptDetails
  }
  shifts: ShiftEvent[]
}

interface DayData {
  day: string
  date: Date
  ppl: number
  hrs: number
  payroll: number
  events: ShiftEvent[]
}

// --- Mock Data ---
const mockShiftCalendarEntries: ShiftCalendarEntry[] = [
  {
    id: "SC001",
    weekStart: "2024-07-29T00:00:00.000Z",
    weekEnd: "2024-08-04T00:00:00.000Z",
    totalShift: 25,
    totalLeaves: 3,
    status: "Published",
  },
  {
    id: "SC002",
    weekStart: "2024-08-05T00:00:00.000Z",
    weekEnd: "2024-08-11T00:00:00.000Z",
    totalShift: 20,
    totalLeaves: 2,
    status: "Draft",
  },
  {
    id: "SC003",
    weekStart: "2024-08-12T00:00:00.000Z",
    weekEnd: "2024-08-18T00:00:00.000Z",
    totalShift: 18,
    totalLeaves: 1,
    status: "Published",
  },
]

const mockEmployees: Employee[] = [
  {
    id: "EMP001",
    empName: "John Doe",
    empImgUrl: "/placeholder.svg?height=40&width=40",
    department: "Management",
    basicInfo: {
      empDetails: { firstName: "John", middleName: "", lastName: "Doe", city: "London" },
      deptDetails: { department: "Management", position: "Manager" },
    },
    shifts: [
      {
        id: "SHIFT001",
        location: "London",
        empId: "EMP001",
        title: "Morning Shift",
        shiftType: "Manager",
        shiftDate: new Date(2024, 7, 29), // Aug 29
        shiftStartTime: new Date(2024, 7, 29, 9, 0),
        shiftEndTime: new Date(2024, 7, 29, 17, 0),
        isApproved: true,
      },
      {
        id: "SHIFT002",
        location: "London",
        empId: "EMP001",
        title: "Evening Shift",
        shiftType: "Manager",
        shiftDate: new Date(2024, 7, 30), // Aug 30
        shiftStartTime: new Date(2024, 7, 30, 14, 0),
        shiftEndTime: new Date(2024, 7, 30, 22, 0),
        isApproved: false,
      },
    ],
  },
  {
    id: "EMP002",
    empName: "Jane Smith",
    empImgUrl: "/placeholder.svg?height=40&width=40",
    department: "FOH",
    basicInfo: {
      empDetails: { firstName: "Jane", middleName: "", lastName: "Smith", city: "London" },
      deptDetails: { department: "FOH", position: "Waiter" },
    },
    shifts: [
      {
        id: "SHIFT003",
        location: "London",
        empId: "EMP002",
        title: "Lunch Shift",
        shiftType: "Waiter",
        shiftDate: new Date(2024, 7, 29), // Aug 29
        shiftStartTime: new Date(2024, 7, 29, 11, 0),
        shiftEndTime: new Date(2024, 7, 29, 15, 0),
        isApproved: true,
      },
    ],
  },
  {
    id: "EMP003",
    empName: "Mike Johnson",
    empImgUrl: "/placeholder.svg?height=40&width=40",
    department: "BOH",
    basicInfo: {
      empDetails: { firstName: "Mike", middleName: "", lastName: "Johnson", city: "London" },
      deptDetails: { department: "BOH", position: "Chef" },
    },
    shifts: [
      {
        id: "SHIFT004",
        location: "London",
        empId: "EMP003",
        title: "Kitchen Shift",
        shiftType: "Chef",
        shiftDate: new Date(2024, 7, 31), // Aug 31
        shiftStartTime: new Date(2024, 7, 31, 10, 0),
        shiftEndTime: new Date(2024, 7, 31, 18, 0),
        isApproved: true,
      },
    ],
  },
]

const ShiftCalendarComponent: React.FC = () => {
  const [currentMainTab, setCurrentMainTab] = useState<"employees" | "my-shifts">("employees")
  const [currentSchedulerView, setCurrentSchedulerView] = useState<"D" | "W" | "2W">("W")
  const [viewDate, setViewDate] = useState(new Date()) // For My Shifts calendar and Scheduler
  const [shiftCalendarEntries, setShiftCalendarEntries] = useState<ShiftCalendarEntry[]>(mockShiftCalendarEntries)
  const [allEmployees, setAllEmployees] = useState<Employee[]>(mockEmployees)
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(mockEmployees)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentView, setCurrentView] = useState<"landing" | "shift-schedular">("landing")

  // Dialog states
  const [showAddShiftDialog, setShowAddShiftDialog] = useState(false)
  const [showEditShiftDialog, setShowEditShiftDialog] = useState(false)
  const [showDeleteShiftDialog, setShowDeleteShiftDialog] = useState(false)
  const [showCopyScheduleDialog, setShowCopyScheduleDialog] = useState(false)
  const [showCopyConfirmationDialog, setShowCopyConfirmationDialog] = useState(false)
  const [showShiftAddConfirmation, setShowShiftAddConfirmation] = useState(false)
  const [showShiftEditConfirmation, setShowShiftEditConfirmation] = useState(false)
  const [showVacationEditConfirmation, setShowVacationEditConfirmation] = useState(false)

  // Form states for Add/Edit Shift
  const [addShiftForm, setAddShiftForm] = useState({
    city: "London",
    name: "",
    department: "",
    position: "",
    startTime: "",
    endTime: "",
    approve: false,
  })
  const [editShiftForm, setEditShiftForm] = useState({
    city: "",
    name: "",
    department: "",
    position: "",
    startTime: "",
    endTime: "",
    approve: false,
  })
  const [editVacationForm, setEditVacationForm] = useState({
    names: "",
    starts: "",
    ends: "",
    approve: "",
  })

  const [selectedShiftForDialog, setSelectedShiftForDialog] = useState<ShiftEvent | null>(null)
  const [selectedEmployeeForDialog, setSelectedEmployeeForDialog] = useState<Employee | null>(null)
  const [shiftToDeleteId, setShiftToDeleteId] = useState<string | null>(null)

  // --- Shift Calendar Landing (Employees Tab) Logic ---
  const handleDownloadCSV = () => {
    console.log("Downloading CSV:", shiftCalendarEntries)
    alert("CSV download initiated (check console for data).")
  }

  const handleDownloadExcel = () => {
    console.log("Downloading Excel:", shiftCalendarEntries)
    alert("Excel download initiated (check console for data).")
  }

  // --- Shift Scheduler (Add/Edit/Delete Shift) Logic ---
  const dayStrings = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const getWeekRange = (date: Date, view: "D" | "W" | "2W") => {
    const start = startOfWeek(date, { weekStartsOn: 0 }) // Sunday as start of week
    let end = endOfWeek(date, { weekStartsOn: 0 })

    if (view === "2W") {
      end = addDays(end, 7)
    }
    return { start, end }
  }

  const createEvents = useCallback(
    (start: Date, end: Date, shifts: ShiftEvent[], employees: Employee[]) => {
      const days: DayData[] = []
      let currDate = new Date(start)

      while (currDate <= end) {
        const dayEvents = shifts.filter((s) => isSameDay(s.shiftDate, currDate))
        const ppl = new Set(dayEvents.map((e) => e.empId)).size
        const hrs = dayEvents.reduce((totalHrs, s) => totalHrs + differenceInHours(s.shiftEndTime, s.shiftStartTime), 0)
        // Mock payroll calculation
        const payroll = ppl * 400 // Example: $400 per person per day

        days.push({
          day: dayStrings[currDate.getDay()],
          date: new Date(currDate),
          ppl,
          hrs,
          payroll,
          events: dayEvents,
        })
        currDate = addDays(currDate, 1)
      }
      return days
    },
    [dayStrings],
  )

  const [allDays, setAllDays] = useState<DayData[]>([])
  const [totalHours, setTotalHours] = useState(0)
  const [totalPayroll, setTotalPayroll] = useState(0)

  const updateSchedulerData = useCallback(() => {
    const { start, end } = getWeekRange(viewDate, currentSchedulerView)
    // Filter shifts relevant to the current view range
    const relevantShifts = allEmployees.flatMap((emp) =>
      emp.shifts.filter((shift) => shift.shiftDate >= start && shift.shiftDate <= end),
    )
    const generatedDays = createEvents(start, end, relevantShifts, allEmployees)
    setAllDays(generatedDays)

    const totalHrs = generatedDays.reduce((sum, day) => sum + day.hrs, 0)
    const totalPay = generatedDays.reduce((sum, day) => sum + day.payroll, 0)
    setTotalHours(totalHrs)
    setTotalPayroll(totalPay)
  }, [viewDate, currentSchedulerView, allEmployees, createEvents])

  useEffect(() => {
    updateSchedulerData()
  }, [updateSchedulerData])

  const filterEmployeesBySearch = useCallback(() => {
    const filtered = allEmployees.filter((emp) => emp.empName.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredEmployees(filtered)
  }, [allEmployees, searchTerm])

  useEffect(() => {
    filterEmployeesBySearch()
  }, [searchTerm, filterEmployeesBySearch])

  const getShiftEventForEmployeeAndDay = (empId: string, day: DayData) => {
    return day.events.find((event) => event.empId === empId)
  }

  const handleAddShiftClick = (day: DayData, employee: Employee) => {
    setSelectedShiftForDialog(null) // Ensure it's an add operation
    setSelectedEmployeeForDialog(employee)
    setAddShiftForm({
      city: employee.basicInfo.empDetails.city,
      name: employee.empName,
      department: employee.department,
      position: employee.basicInfo.deptDetails.position,
      startTime: "",
      endTime: "",
      approve: false,
    })
    setShowAddShiftDialog(true)
  }

  const handleEditShiftClick = (shift: ShiftEvent, employee: Employee) => {
    setSelectedShiftForDialog(shift)
    setSelectedEmployeeForDialog(employee)
    setEditShiftForm({
      city: employee.basicInfo.empDetails.city,
      name: employee.empName,
      department: employee.department,
      position: employee.basicInfo.deptDetails.position,
      startTime: format(shift.shiftStartTime, "HH:mm"),
      endTime: format(shift.shiftEndTime, "HH:mm"),
      approve: shift.isApproved,
    })
    setShowEditShiftDialog(true)
  }

  const handleEditVacationClick = (vacationEvent: ShiftEvent, employee: Employee) => {
    setSelectedShiftForDialog(vacationEvent)
    setSelectedEmployeeForDialog(employee)
    setEditVacationForm({
      names: employee.empName,
      starts: format(vacationEvent.shiftStartTime, "yyyy-MM-dd"),
      ends: format(vacationEvent.shiftEndTime, "yyyy-MM-dd"),
      approve: vacationEvent.isApproved ? "Approved" : "Pending", // Assuming status is string for vacation
    })
    setShowVacationEditConfirmation(true) // Reusing dialog for now
  }

  const handleAddShiftSubmit = () => {
    if (!selectedEmployeeForDialog) return

    const newShift: ShiftEvent = {
      id: `SHIFT${Date.now()}`, // Simple unique ID
      location: addShiftForm.city,
      empId: selectedEmployeeForDialog.id,
      title: "New Shift", // Placeholder
      shiftType: addShiftForm.position,
      shiftDate: new Date(selectedShiftForDialog?.shiftDate || new Date()), // Use the date from the cell clicked
      shiftStartTime: parseTime(selectedShiftForDialog?.shiftDate || new Date(), addShiftForm.startTime),
      shiftEndTime: parseTime(selectedShiftForDialog?.shiftDate || new Date(), addShiftForm.endTime),
      isApproved: addShiftForm.approve,
    }

    setAllEmployees((prev) =>
      prev.map((emp) =>
        emp.id === selectedEmployeeForDialog.id ? { ...emp, shifts: [...emp.shifts, newShift] } : emp,
      ),
    )
    setShowAddShiftDialog(false)
    setShowShiftAddConfirmation(true)
  }

  const handleEditShiftSubmit = () => {
    if (!selectedShiftForDialog || !selectedEmployeeForDialog) return

    const updatedShift: ShiftEvent = {
      ...selectedShiftForDialog,
      location: editShiftForm.city,
      shiftType: editShiftForm.position,
      shiftStartTime: parseTime(selectedShiftForDialog.shiftDate, editShiftForm.startTime),
      shiftEndTime: parseTime(selectedShiftForDialog.shiftDate, editShiftForm.endTime),
      isApproved: editShiftForm.approve,
    }

    setAllEmployees((prev) =>
      prev.map((emp) =>
        emp.id === selectedEmployeeForDialog.id
          ? {
              ...emp,
              shifts: emp.shifts.map((s) => (s.id === updatedShift.id ? updatedShift : s)),
            }
          : emp,
      ),
    )
    setShowEditShiftDialog(false)
    setShowShiftEditConfirmation(true)
  }

  const handleDeleteShiftClick = (shiftId: string) => {
    setShiftToDeleteId(shiftId)
    setShowDeleteShiftDialog(true)
  }

  const confirmDeleteShift = () => {
    if (shiftToDeleteId) {
      setAllEmployees((prev) =>
        prev.map((emp) => ({
          ...emp,
          shifts: emp.shifts.filter((s) => s.id !== shiftToDeleteId),
        })),
      )
      setShiftToDeleteId(null)
      setShowDeleteShiftDialog(false)
    }
  }

  const handleCopySchedule = () => {
    setShowCopyScheduleDialog(true)
  }

  const confirmCopySchedule = () => {
    // Simulate copying schedule to next week
    console.log("Schedule copied to next week!")
    setShowCopyScheduleDialog(false)
    setShowCopyConfirmationDialog(true)
  }

  const parseTime = (date: Date, timeString: string): Date => {
    const [hours, minutes] = timeString.split(":").map(Number)
    const newDate = new Date(date)
    newDate.setHours(hours, minutes, 0, 0)
    return newDate
  }

  // Helper to group employees by department
  const getEmployeesByDepartment = (department: string) => {
    return filteredEmployees.filter((emp) => emp.department === department)
  }

  const renderShiftCalendarLandingView = () => (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Shift Calendar</h1>
          <Tabs value={currentMainTab} onValueChange={(value) => setCurrentMainTab(value as "employees" | "my-shifts")}>
            <TabsList>
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="my-shifts">My Shifts</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {currentMainTab === "employees" && (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Date Range Picker Placeholder */}
            <div className="flex items-center gap-2">
              <Input type="date" placeholder="From Date" className="w-[150px]" />
              <Input type="date" placeholder="To Date" className="w-[150px]" />
            </div>
            <Button className="bg-black text-white hover:bg-gray-800" onClick={() => setCurrentView("shift-schedular")}>
              <Plus className="h-4 w-4 mr-2" /> Add Schedule
            </Button>
          </div>
        )}

        {currentMainTab === "my-shifts" && (
          <div className="flex items-center space-x-3">
            {/* Calendar Navigation for My Shifts */}
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewDate(addDays(viewDate, -7))} // Navigate by week
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="px-4 py-2 text-sm font-medium min-w-[150px] text-center">
                {format(viewDate, "MMMM yyyy")}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewDate(addDays(viewDate, 7))} // Navigate by week
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Content based on main tab */}
      <TabsContent value="employees" className="mt-0">
        <Card>
          <CardContent className="p-0">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>WEEK START</TableHead>
                    <TableHead>WEEK END</TableHead>
                    <TableHead>TOTAL SHIFT</TableHead>
                    <TableHead>TOTAL LEAVES</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shiftCalendarEntries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No shift calendar entries found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    shiftCalendarEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <Checkbox />
                        </TableCell>
                        <TableCell>{format(parseISO(entry.weekStart), "dd MMMM yyyy")}</TableCell>
                        <TableCell>{format(parseISO(entry.weekEnd), "dd MMMM yyyy")}</TableCell>
                        <TableCell>{entry.totalShift}</TableCell>
                        <TableCell>{entry.totalLeaves}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              entry.status === "Published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {entry.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => console.log("Edit", entry.id)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log("Delete", entry.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
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
      </TabsContent>

      <TabsContent value="my-shifts" className="mt-0">
        {/* This section would contain the My Shifts calendar view, similar to the Leaves component */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-7 border-b">
              {dayStrings.map((day) => (
                <div key={day} className="p-3 text-center font-medium text-gray-600 border-r last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {/* Simplified calendar grid for My Shifts */}
              {Array.from({ length: 35 }).map((_, i) => {
                const day = addDays(startOfWeek(viewDate), i)
                const isCurrentMonth = day.getMonth() === viewDate.getMonth()
                const isToday = isSameDay(day, new Date())
                const employeeShifts = allEmployees.flatMap(
                  (emp) => emp.shifts.filter((shift) => isSameDay(shift.shiftDate, day) && emp.id === "EMP001"), // Assuming EMP001 is "My Shifts"
                )

                return (
                  <div
                    key={i}
                    className={`h-24 border border-gray-200 relative group ${
                      isToday ? "bg-blue-50" : "bg-white"
                    } ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : ""}`}
                  >
                    <div className="p-1">
                      <span className="text-sm font-medium">{format(day, "d")}</span>
                      {isToday && (
                        <div className="absolute top-1 right-1">
                          <Badge variant="secondary" className="text-xs">
                            Today
                          </Badge>
                        </div>
                      )}
                    </div>
                    {employeeShifts.length > 0 && (
                      <div className="absolute bottom-1 left-1 right-1 text-xs">
                        {employeeShifts.map((shift) => (
                          <div
                            key={shift.id}
                            className={`flex items-center justify-between p-1 rounded ${
                              shift.isApproved ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            <span>
                              {format(shift.shiftStartTime, "HH:mm")} - {format(shift.shiftEndTime, "HH:mm")}
                            </span>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditShiftClick(shift, allEmployees[0])} // Pass relevant employee
                                className="h-6 w-6 p-0"
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteShiftClick(shift.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  )

  const renderShiftSchedulerView = () => (
    <div className="shift-calendar container-fluid p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold flex items-center">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView("landing")} className="mr-2 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          Shift Calendar
        </h1>
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button className="bg-black text-white hover:bg-gray-800" onClick={handleCopySchedule}>
            <Copy className="h-4 w-4 mr-2" /> COPY SCHEDULE
          </Button>
          <Select
            value={currentSchedulerView}
            onValueChange={(value) => setCurrentSchedulerView(value as "D" | "W" | "2W")}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="D">Daily</SelectItem>
              <SelectItem value="W">Weekly</SelectItem>
              <SelectItem value="2W">2 Weekly</SelectItem>
            </SelectContent>
          </Select>
          {/* Date Navigation */}
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setViewDate(
                  addDays(viewDate, currentSchedulerView === "D" ? -1 : currentSchedulerView === "W" ? -7 : -14),
                )
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-4 py-2 text-sm font-medium min-w-[150px] text-center">
              {format(viewDate, "MMMM d, yyyy")}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setViewDate(addDays(viewDate, currentSchedulerView === "D" ? 1 : currentSchedulerView === "W" ? 7 : 14))
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Heading row for weekly, 2weekly dates */}
      <div className="flex border-b border-gray-200 shadow-sm bg-white rounded-lg overflow-hidden mb-4">
        <div className="w-[174px] p-3 flex-shrink-0 border-r border-gray-200">
          <div className="text-green-600 font-semibold">PUBLISHED</div>
          <div className="relative mt-2 border-b border-gray-300 pb-1">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search Employee"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-6 border-none focus-visible:ring-0"
            />
          </div>
          <div className="mt-2 text-xs font-semibold">
            Hours/Payroll <br />
            {totalHours}h / £{totalPayroll.toFixed(2)}
          </div>
        </div>
        {allDays.map((day, index) => (
          <div key={index} className="flex-1 p-3 text-center border-r border-gray-200 last:border-r-0">
            <div className="text-sm font-bold">{currentSchedulerView === "2W" ? day.day.slice(0, 3) : day.day}</div>
            <div className="text-lg font-bold mt-1">{format(day.date, "d MMM")}</div>
            <div className="text-xs mt-1">{day.ppl} People</div>
            <div className="text-sm font-semibold mt-2">
              {day.hrs}h 0m/£{day.payroll.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Employee Rows by Department */}
      {["Management", "FOH", "BOH"].map((department) => (
        <Collapsible key={department} defaultOpen className="mb-4">
          <CollapsibleTrigger className="w-full flex justify-between items-center p-3 bg-gray-100 border border-gray-200 rounded-md font-semibold text-lg">
            {department}
            <ChevronDown className="h-4 w-4" /> {/* Placeholder for chevron icon */}
          </CollapsibleTrigger>
          <CollapsibleContent className="border border-t-0 border-gray-200 rounded-b-md overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
              {getEmployeesByDepartment(department).map((emp) => (
                <div key={emp.id} className="flex border-b border-gray-100 last:border-b-0">
                  <div className="w-[174px] p-3 flex-shrink-0 flex items-center border-r border-gray-200">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={emp.empImgUrl || "/placeholder.svg"} alt={emp.empName} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{emp.empName}</div>
                      <div className="text-xs text-gray-500">33h/ 3 Shifts</div> {/* Mock data */}
                    </div>
                  </div>
                  {allDays.map((day, dayIndex) => {
                    const event = getShiftEventForEmployeeAndDay(emp.id, day)
                    return (
                      <div
                        key={dayIndex}
                        className="flex-1 p-2 border-r border-gray-200 last:border-r-0 relative group h-24"
                      >
                        {event ? (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                            <div
                              className={`absolute left-0 top-0 bottom-0 w-2 ${
                                event.isApproved ? "bg-green-600" : "bg-black"
                              }`}
                            />
                            <div className="flex flex-col justify-between h-full w-full p-2 text-sm">
                              <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDeleteShiftClick(event.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Trash2 className="h-3 w-3 text-gray-500 hover:text-red-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEditShiftClick(event, emp)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Pencil className="h-3 w-3 text-gray-500 hover:text-yellow-600" />
                                </Button>
                              </div>
                              <div className="text-center">
                                {format(event.shiftStartTime, "HH:mm")} - {format(event.shiftEndTime, "HH:mm")}
                              </div>
                              {!event.isApproved && (
                                <div className="flex justify-center items-center text-green-600">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="ghost" onClick={() => handleAddShiftClick(day, emp)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}

      {/* Add Shift Dialog */}
      <Dialog open={showAddShiftDialog} onOpenChange={setShowAddShiftDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center">
                <Button variant="ghost" size="sm" onClick={() => setShowAddShiftDialog(false)} className="mr-2 p-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                Add Shift
              </DialogTitle>
              <Button className="bg-black text-white hover:bg-gray-800" onClick={handleAddShiftSubmit}>
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-6 p-4">
            <div className="flex flex-col space-y-4">
              <Select
                value={addShiftForm.city}
                onValueChange={(value) => setAddShiftForm((prev) => ({ ...prev, city: value }))}
              >
                <SelectTrigger className="border-b-2 border-gray-300 rounded-none">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="London">London</SelectItem>
                  <SelectItem value="US">US</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={addShiftForm.name}
                onValueChange={(value) => {
                  const emp = allEmployees.find((e) => e.id === value)
                  if (emp) {
                    setAddShiftForm((prev) => ({
                      ...prev,
                      name: emp.empName,
                      department: emp.department,
                      position: emp.basicInfo.deptDetails.position,
                    }))
                    setSelectedEmployeeForDialog(emp)
                  }
                }}
              >
                <SelectTrigger className="border-b-2 border-gray-300 rounded-none">
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
                  {allEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.empName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label className="text-sm">Department: {addShiftForm.department}</Label>
              <Input placeholder="Title" className="border-b-2 border-gray-300 rounded-none" />
              <Select
                value={addShiftForm.position}
                onValueChange={(value) => setAddShiftForm((prev) => ({ ...prev, position: value }))}
              >
                <SelectTrigger className="border-b-2 border-gray-300 rounded-none">
                  <SelectValue placeholder="Select Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Waiter">Waiter</SelectItem>
                  <SelectItem value="Chef">Chef</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-4 mt-5">
              <div className="flex-1">
                <Label htmlFor="add-start-time">Shift Start time</Label>
                <Input
                  id="add-start-time"
                  type="time"
                  value={addShiftForm.startTime}
                  onChange={(e) => setAddShiftForm((prev) => ({ ...prev, startTime: e.target.value }))}
                  className="border-b-2 border-gray-300 rounded-none"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="add-end-time">Shift end time</Label>
                <Input
                  id="add-end-time"
                  type="time"
                  value={addShiftForm.endTime}
                  onChange={(e) => setAddShiftForm((prev) => ({ ...prev, endTime: e.target.value }))}
                  className="border-b-2 border-gray-300 rounded-none"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-5">
              <Label htmlFor="add-approve">Approve</Label>
              <Switch
                id="add-approve"
                checked={addShiftForm.approve}
                onCheckedChange={(checked) => setAddShiftForm((prev) => ({ ...prev, approve: checked }))}
              />
            </div>
            <hr className="my-5 border-t border-gray-200" />
            <div className="space-y-2">
              <h3 className="font-bold">Send Changes</h3>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="send-sms" />
                  <Label htmlFor="send-sms">Send Sms</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="send-message" />
                  <Label htmlFor="send-message">Send Message</Label>
                </div>
              </div>
              <p className="text-xs text-gray-500 flex items-center">
                <Info className="h-3 w-3 mr-1" /> if changing shift from one employee to another, both employees will
                notify
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Shift Dialog */}
      <Dialog open={showEditShiftDialog} onOpenChange={setShowEditShiftDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center">
                <Button variant="ghost" size="sm" onClick={() => setShowEditShiftDialog(false)} className="mr-2 p-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                Edit Shift
              </DialogTitle>
              <Button className="bg-black text-white hover:bg-gray-800" onClick={handleEditShiftSubmit}>
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-6 p-4">
            <div className="flex flex-col space-y-4">
              <Select
                value={editShiftForm.city}
                onValueChange={(value) => setEditShiftForm((prev) => ({ ...prev, city: value }))}
              >
                <SelectTrigger className="border-b-2 border-gray-300 rounded-none">
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="London">London</SelectItem>
                  <SelectItem value="US">US</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={editShiftForm.name}
                onValueChange={(value) => {
                  const emp = allEmployees.find((e) => e.id === value)
                  if (emp) {
                    setEditShiftForm((prev) => ({
                      ...prev,
                      name: emp.empName,
                      department: emp.department,
                      position: emp.basicInfo.deptDetails.position,
                    }))
                    setSelectedEmployeeForDialog(emp)
                  }
                }}
              >
                <SelectTrigger className="border-b-2 border-gray-300 rounded-none">
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
                  {allEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.empName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label className="text-sm">Department: {editShiftForm.department}</Label>
              <Input placeholder="Title" className="border-b-2 border-gray-300 rounded-none" />
              <Select
                value={editShiftForm.position}
                onValueChange={(value) => setEditShiftForm((prev) => ({ ...prev, position: value }))}
              >
                <SelectTrigger className="border-b-2 border-gray-300 rounded-none">
                  <SelectValue placeholder="Select Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Waiter">Waiter</SelectItem>
                  <SelectItem value="Chef">Chef</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-4 mt-5">
              <div className="flex-1">
                <Label htmlFor="edit-start-time">Shift Start time</Label>
                <Input
                  id="edit-start-time"
                  type="time"
                  value={editShiftForm.startTime}
                  onChange={(e) => setEditShiftForm((prev) => ({ ...prev, startTime: e.target.value }))}
                  className="border-b-2 border-gray-300 rounded-none"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="edit-end-time">Shift end time</Label>
                <Input
                  id="edit-end-time"
                  type="time"
                  value={editShiftForm.endTime}
                  onChange={(e) => setEditShiftForm((prev) => ({ ...prev, endTime: e.target.value }))}
                  className="border-b-2 border-gray-300 rounded-none"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-5">
              <Label htmlFor="edit-approve">Approve</Label>
              <Switch
                id="edit-approve"
                checked={editShiftForm.approve}
                onCheckedChange={(checked) => setEditShiftForm((prev) => ({ ...prev, approve: checked }))}
              />
            </div>
            <hr className="my-5 border-t border-gray-200" />
            <div className="space-y-2">
              <h3 className="font-bold">Send Changes</h3>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="edit-send-sms" />
                  <Label htmlFor="edit-send-sms">Send Sms</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="edit-send-message" />
                  <Label htmlFor="edit-send-message">Send Message</Label>
                </div>
              </div>
              <p className="text-xs text-gray-500 flex items-center">
                <Info className="h-3 w-3 mr-1" /> if changing shift from one employee to another, both employees will
                notify
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Shift Confirmation Dialog */}
      <Dialog open={showDeleteShiftDialog} onOpenChange={setShowDeleteShiftDialog}>
        <DialogContent className="max-w-sm">
          <div className="text-center space-y-4">
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteShiftDialog(false)} className="p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Trash2 className="h-10 w-10 mx-auto text-gray-500 hover:text-red-600" />
            <h4 className="text-lg font-medium mt-4">Are you sure want to delete?</h4>
            <div className="mt-2">
              <Button className="bg-black text-white hover:bg-gray-800 w-24" onClick={confirmDeleteShift}>
                DELETE
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Copy Schedule Dialog */}
      <Dialog open={showCopyScheduleDialog} onOpenChange={setShowCopyScheduleDialog}>
        <DialogContent className="max-w-md">
          <div className="text-center space-y-4">
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowCopyScheduleDialog(false)} className="p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <h6 className="mt-3 text-lg font-medium">
              Are you sure you want to <br />
              copy this week schedule to next week?
            </h6>
            <p className="text-sm text-gray-600">
              ({format(viewDate, "dd MMM")} - {format(addDays(viewDate, 6), "dd MMM")}) Copy to (
              {format(addDays(viewDate, 7), "dd MMM")} - {format(addDays(viewDate, 13), "dd MMM")})
            </p>
            <div className="mt-4">
              <Button className="bg-black text-white hover:bg-gray-800 w-24" onClick={confirmCopySchedule}>
                Copy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Copy Schedule Confirmation Dialog */}
      <Dialog open={showCopyConfirmationDialog} onOpenChange={setShowCopyConfirmationDialog}>
        <DialogContent className="max-w-md">
          <div className="text-center space-y-4">
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowCopyConfirmationDialog(false)} className="p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CheckCircle className="h-10 w-10 mx-auto text-green-600" />
            <h6 className="mt-3 text-lg font-medium">Schedule Copied to next week!</h6>
            <div className="mt-4 flex justify-center space-x-4">
              <Button
                className="bg-black text-white hover:bg-gray-800 w-36"
                onClick={() => setShowCopyConfirmationDialog(false)}
              >
                VIEW THIS WEEK
              </Button>
              <Button
                className="bg-black text-white hover:bg-gray-800 w-36"
                onClick={() => setShowCopyConfirmationDialog(false)}
              >
                VIEW NEXT WEEK
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Shift Add Confirmation Dialog */}
      <Dialog open={showShiftAddConfirmation} onOpenChange={setShowShiftAddConfirmation}>
        <DialogContent className="max-w-sm">
          <div className="text-center space-y-4">
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowShiftAddConfirmation(false)} className="p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CheckCircle className="h-10 w-10 mx-auto text-green-600" />
            <h6 className="mt-4 text-lg font-medium">Shift is successfully added</h6>
            <div className="mt-2">
              <Button
                className="bg-black text-white hover:bg-gray-800 w-36"
                onClick={() => setShowShiftAddConfirmation(false)}
              >
                VIEW SHIFTS
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Shift Edit Confirmation Dialog */}
      <Dialog open={showShiftEditConfirmation} onOpenChange={setShowShiftEditConfirmation}>
        <DialogContent className="max-w-sm">
          <div className="text-center space-y-4">
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowShiftEditConfirmation(false)} className="p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CheckCircle className="h-10 w-10 mx-auto text-green-600" />
            <h6 className="mt-4 text-lg font-medium">Shift is successfully edited</h6>
            <div className="mt-2">
              <Button
                className="bg-black text-white hover:bg-gray-800 w-36"
                onClick={() => setShowShiftEditConfirmation(false)}
              >
                VIEW SHIFTS
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Vacation Edit Confirmation Dialog (reused for edit vacation) */}
      <Dialog open={showVacationEditConfirmation} onOpenChange={setShowVacationEditConfirmation}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVacationEditConfirmation(false)}
                  className="mr-2 p-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                Edit Vacation
              </DialogTitle>
              <Button
                className="bg-black text-white hover:bg-gray-800"
                onClick={() => {
                  /* handle save vacation edit */ setShowVacationEditConfirmation(false)
                }}
              >
                <Save className="h-4 w-4 mr-2" /> Save
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-6 p-4">
            <div className="flex space-x-6">
              <div>
                <div className="text-xl font-bold">28</div>
                <div className="text-xs text-gray-600">Total holidays</div>
              </div>
              <div>
                <div className="text-xl font-bold">17</div>
                <div className="text-xs text-gray-600">Holidays left</div>
              </div>
              <div>
                <div className="text-xl font-bold">11</div>
                <div className="text-xs text-gray-600">Used holidays</div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Info className="h-4 w-4" />
              <span>shifts that conflict the vacation period will be set to open shifts</span>
            </div>
            <hr className="my-6 border-t-2 border-gray-200" />
            <Select
              value={editVacationForm.names}
              onValueChange={(value) => setEditVacationForm((prev) => ({ ...prev, names: value }))}
            >
              <SelectTrigger className="border-b-2 border-gray-300 rounded-none">
                <SelectValue placeholder="Select Employee" />
              </SelectTrigger>
              <SelectContent>
                {allEmployees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.empName}>
                    {emp.empName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label className="text-sm">Department: {selectedEmployeeForDialog?.department}</Label>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  type="date"
                  value={editVacationForm.starts}
                  onChange={(e) => setEditVacationForm((prev) => ({ ...prev, starts: e.target.value }))}
                  className="border-b-2 border-gray-300 rounded-none"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="date"
                  value={editVacationForm.ends}
                  onChange={(e) => setEditVacationForm((prev) => ({ ...prev, ends: e.target.value }))}
                  className="border-b-2 border-gray-300 rounded-none"
                />
              </div>
            </div>
            <div>
              <Input
                placeholder="Comments"
                value={editVacationForm.approve} // This was 'approve' in Angular, assuming it's a comment field now
                onChange={(e) => setEditVacationForm((prev) => ({ ...prev, approve: e.target.value }))}
                className="border-b-2 border-gray-300 rounded-none"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === "landing" ? renderShiftCalendarLandingView() : renderShiftSchedulerView()}
    </div>
  )
}

export default ShiftCalendarComponent
