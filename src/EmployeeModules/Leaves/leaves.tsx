"use client"

import type React from "react"
import { useState } from "react"
import { format, isSameDay, isAfter } from "date-fns"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Save,
  ArrowLeft,
  Info,
  TriangleIcon as ExclamationTriangle,
  X,
  Check,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface LeaveEvent {
  start: Date
  end: Date
  status: "Approved" | "Rejected" | "Pending"
  icon?: string
  delete?: string
  edit?: string
}

interface Employee {
  picture: string
  name: string
  roll: number
  role: string
}

interface EmployeeEvent {
  id: number
  start: Date
  end: Date
  people: Employee[]
}

interface VacationForm {
  startDate: string
  endDate: string
  comment: string
  durationType: "single" | "range"
}

const LeavesComponent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"employees" | "my-leaves">("my-leaves")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeEvent | null>(null)
  const [editingLeave, setEditingLeave] = useState<any>(null)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [confirmationType, setConfirmationType] = useState<"request" | "add" | "edit">("request")

  const [requestForm, setRequestForm] = useState<VacationForm>({
    startDate: "",
    endDate: "",
    comment: "",
    durationType: "range",
  })

  const [editForm, setEditForm] = useState<VacationForm>({
    startDate: "",
    endDate: "",
    comment: "",
    durationType: "range",
  })

  // Sample data
  const [events] = useState<LeaveEvent[]>([
    {
      start: new Date(2024, 11, 2), // December 2024
      end: new Date(2024, 11, 2),
      status: "Approved",
    },
    {
      start: new Date(2024, 11, 10),
      end: new Date(2024, 11, 10),
      status: "Rejected",
    },
    {
      start: new Date(2024, 11, 27),
      end: new Date(2024, 11, 27),
      status: "Approved",
    },
    {
      start: new Date(2024, 11, 17),
      end: new Date(2024, 11, 17),
      status: "Pending",
    },
  ])

  const [employeeEvents] = useState<EmployeeEvent[]>([
    {
      id: 1,
      start: new Date(2024, 11, 4), // December 2024
      end: new Date(2024, 11, 4),
      people: [
        {
          picture: "/placeholder.svg?height=40&width=40",
          name: "charan",
          roll: 102,
          role: "FOH",
        },
        {
          picture: "/placeholder.svg?height=40&width=40",
          name: "shrangi",
          roll: 110,
          role: "BOH",
        },
        {
          picture: "/placeholder.svg?height=40&width=40",
          name: "ashvita",
          roll: 403,
          role: "Management",
        },
        {
          picture: "/placeholder.svg?height=40&width=40",
          name: "satya",
          roll: 400,
          role: "FOH",
        },
      ],
    },
  ])

  const today = new Date()
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const startingDayOfWeek = firstDayOfMonth.getDay()

  const getUpcomingLeave = () => {
    try {
      const upcomingLeaves = events.filter((event) => {
        const eventDate = new Date(event.start)
        return !isNaN(eventDate.getTime()) && isAfter(eventDate, today)
      })
      return upcomingLeaves.length > 0 ? upcomingLeaves[0].start : null
    } catch (error) {
      return null
    }
  }

  const getDayEvents = (date: Date) => {
    if (activeTab === "my-leaves") {
      return events.filter((event) => isSameDay(event.start, date))
    } else {
      return employeeEvents.filter((event) => isSameDay(event.start, date))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      case "Pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const handleRequestSubmit = () => {
    setConfirmationType("request")
    setShowRequestDialog(false)
    setShowConfirmDialog(true)
  }

  const handleEditSubmit = () => {
    setConfirmationType("edit")
    setShowEditDialog(false)
    setShowConfirmDialog(true)
  }

  const handleAddSubmit = () => {
    setConfirmationType("add")
    setShowAddDialog(false)
    setShowConfirmDialog(true)
  }

  const openEditDialog = (dayData: any) => {
    const event = dayData.events?.[0]
    if (event) {
      setEditingLeave(dayData)
      try {
        const eventDate = new Date(event.start)
        if (!isNaN(eventDate.getTime())) {
          setEditForm({
            startDate: format(eventDate, "yyyy-MM-dd"),
            endDate: format(eventDate, "yyyy-MM-dd"),
            comment: event.status || "",
            durationType: "single",
          })
        } else {
          // Fallback to current date if event date is invalid
          const today = new Date()
          setEditForm({
            startDate: format(today, "yyyy-MM-dd"),
            endDate: format(today, "yyyy-MM-dd"),
            comment: event.status || "",
            durationType: "single",
          })
        }
      } catch (error) {
        // Fallback to current date if there's any error
        const today = new Date()
        setEditForm({
          startDate: format(today, "yyyy-MM-dd"),
          endDate: format(today, "yyyy-MM-dd"),
          comment: event.status || "",
          durationType: "single",
        })
      }
      setShowEditDialog(true)
    }
  }

  const renderCalendarDays = () => {
    const days = []
    const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 bg-gray-50"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const isToday = isSameDay(date, today)
      const dayEvents = getDayEvents(date)
      const canAddEvent = isAfter(date, today) && dayEvents.length === 0

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 relative group ${
            isToday ? "bg-blue-50" : "bg-white"
          } ${dayEvents.length > 0 ? getStatusColor(dayEvents[0]?.status || "") : ""}`}
        >
          <div className="p-1">
            <span className="text-sm font-medium">{day}</span>
            {isToday && (
              <div className="absolute top-1 right-1">
                <Badge variant="secondary" className="text-xs">
                  Today
                </Badge>
              </div>
            )}
          </div>

          {/* Hover add button */}
          {canAddEvent && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button size="sm" variant="ghost" onClick={() => setShowRequestDialog(true)} className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* My Leaves Events */}
          {activeTab === "my-leaves" && dayEvents.length > 0 && (
            <div className="absolute bottom-1 left-1 right-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {dayEvents[0].status === "Approved" && <Check className="h-3 w-3" />}
                  <span className="text-xs font-medium">{dayEvents[0].status}</span>
                </div>
                {dayEvents[0].status === "Pending" && (
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditDialog({ events: dayEvents, date })}
                      className="h-6 w-6 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowDeleteDialog(true)} className="h-6 w-6 p-0">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Employee Events */}
          {activeTab === "employees" && dayEvents.length > 0 && (
            <div className="absolute bottom-1 left-1 right-1">
              <div className="text-xs">
                {(dayEvents[0] as EmployeeEvent).people.slice(0, 2).map((person, idx) => (
                  <span key={idx} className="mr-1">
                    {person.name},
                  </span>
                ))}
                {(dayEvents[0] as EmployeeEvent).people.length > 2 && (
                  <button
                    onClick={() => {
                      setSelectedEmployee(dayEvents[0] as EmployeeEvent)
                      setShowEmployeeDialog(true)
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    more
                  </button>
                )}
              </div>
            </div>
          )}
        </div>,
      )
    }

    // Fill remaining cells
    const remainingCells = totalCells - (daysInMonth + startingDayOfWeek)
    for (let i = 0; i < remainingCells; i++) {
      days.push(<div key={`empty-end-${i}`} className="h-24 border border-gray-200 bg-gray-50"></div>)
    }

    return days
  }

  const upcomingLeave = getUpcomingLeave()

  return (
    <div className="px-12 py-6   ">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <h1 className="text-2xl font-bold">Leaves</h1>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "employees" | "my-leaves")}>
            <TabsList>
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="my-leaves">My Leaves</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center space-x-3">
          {activeTab === "my-leaves" ? (
            <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
              <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800">REQUEST VACATION</Button>
              </DialogTrigger>
            </Dialog>
          ) : (
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Plus className="h-4 w-4 mr-2" />
                  ADD VACATION
                </Button>
              </DialogTrigger>
            </Dialog>
          )}

          {/* Calendar Navigation */}
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="px-4 py-2 text-sm font-medium min-w-[150px] text-center">
              {format(currentDate, "MMMM yyyy")}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats for My Leaves */}
      {activeTab === "my-leaves" && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex space-x-6">
            <div>
              <div className="text-2xl font-bold">28</div>
              <div className="text-sm text-gray-600">Total Holidays</div>
            </div>
            <div>
              <div className="text-2xl font-bold">17</div>
              <div className="text-sm text-gray-600">Remaining Holidays</div>
            </div>
            <div>
              <div className="text-2xl font-bold">11</div>
              <div className="text-sm text-gray-600">Used Holidays</div>
            </div>
          </div>
          {upcomingLeave && (
            <div className="mt-4 md:mt-0">
              <span className="font-medium">Upcoming Leave: </span>
              <span>
                {(() => {
                  try {
                    const date = new Date(upcomingLeave)
                    return !isNaN(date.getTime()) ? format(date, "d MMM yyyy") : "Invalid date"
                  } catch (error) {
                    return "Invalid date"
                  }
                })()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Calendar */}
      <Card>
        <CardContent className="p-0">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 border-b">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-3 text-center font-medium text-gray-600 border-r last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="grid grid-cols-7">{renderCalendarDays()}</div>
        </CardContent>
      </Card>

      {/* Request Vacation Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => setShowRequestDialog(false)} className="mr-2 p-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              Request vacation
            </DialogTitle>
            <p className="text-sm text-gray-600">Account balance</p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Stats */}
            <div className="flex space-x-6">
              <div>
                <div className="text-xl font-bold">28</div>
                <div className="text-xs text-gray-600">Total holidays</div>
              </div>
              <div>
                <div className="text-xl font-bold">17</div>
                <div className="text-xs text-gray-600">holidays left</div>
              </div>
              <div>
                <div className="text-xl font-bold">11</div>
                <div className="text-xs text-gray-600">Used holidays</div>
              </div>
            </div>

            {/* Info */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Info className="h-4 w-4" />
              <span>shifts that conflict the vacation period will be set to open shifts</span>
            </div>

            <hr />

            {/* Duration Type */}
            <RadioGroup
              value={requestForm.durationType}
              onValueChange={(value) =>
                setRequestForm((prev) => ({ ...prev, durationType: value as "single" | "range" }))
              }
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="single" />
                <Label htmlFor="single">Single day</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="range" />
                <Label htmlFor="range">Range</Label>
              </div>
            </RadioGroup>

            {/* Date Inputs */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  type="date"
                  value={requestForm.startDate}
                  onChange={(e) => setRequestForm((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="border-0 border-b-2 border-gray-300 rounded-none"
                />
              </div>
              {requestForm.durationType === "range" && (
                <div className="flex-1">
                  <Input
                    type="date"
                    value={requestForm.endDate}
                    onChange={(e) => setRequestForm((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="border-0 border-b-2 border-gray-300 rounded-none"
                  />
                </div>
              )}
            </div>

            {/* Comment */}
            <div>
              <Input
                placeholder="comments"
                value={requestForm.comment}
                onChange={(e) => setRequestForm((prev) => ({ ...prev, comment: e.target.value }))}
                className="border-0 border-b-2 border-gray-300 rounded-none"
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleRequestSubmit} className="bg-black text-white">
                <Save className="h-4 w-4 mr-2" />
                SAVE
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => setShowEditDialog(false)} className="mr-2 p-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              Request vacation
            </DialogTitle>
            <p className="text-sm text-gray-600">Account balance</p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Stats */}
            <div className="flex space-x-6">
              <div>
                <div className="text-xl font-bold">28</div>
                <div className="text-xs text-gray-600">Total Holidays</div>
              </div>
              <div>
                <div className="text-xl font-bold">17</div>
                <div className="text-xs text-gray-600">Holidays Left</div>
              </div>
              <div>
                <div className="text-xl font-bold">11</div>
                <div className="text-xs text-gray-600">Used Holidays</div>
              </div>
            </div>

            {/* Info */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Info className="h-4 w-4" />
              <span>Shifts that conflict the Vacation period will be set to Open Shifts</span>
            </div>

            <hr />

            {/* Duration Type */}
            <RadioGroup
              value={editForm.durationType}
              onValueChange={(value) => setEditForm((prev) => ({ ...prev, durationType: value as "single" | "range" }))}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="edit-single" />
                <Label htmlFor="edit-single">Single Day</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="edit-range" />
                <Label htmlFor="edit-range">Range</Label>
              </div>
            </RadioGroup>

            {/* Date Inputs */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  type="date"
                  value={editForm.startDate}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="border-0 border-b-2 border-gray-300 rounded-none"
                />
              </div>
              {editForm.durationType === "range" && (
                <div className="flex-1">
                  <Input
                    type="date"
                    value={editForm.endDate}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, endDate: e.target.value }))}
                    className="border-0 border-b-2 border-gray-300 rounded-none"
                  />
                </div>
              )}
            </div>

            {/* Comment */}
            <div>
              <Input
                placeholder="Comments"
                value={editForm.comment}
                onChange={(e) => setEditForm((prev) => ({ ...prev, comment: e.target.value }))}
                className="border-0 border-b-2 border-gray-300 rounded-none"
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleEditSubmit} className="bg-black text-white">
                <Save className="h-4 w-4 mr-2" />
                SAVE
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Vacation Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Button variant="ghost" size="sm" onClick={() => setShowAddDialog(false)} className="mr-2 p-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              Add New Vacation
            </DialogTitle>
            <p className="text-sm text-gray-600">Account balance</p>
          </DialogHeader>

          <div className="space-y-6">
            {/* Stats */}
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

            {/* Info */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Info className="h-4 w-4" />
              <span>Shifts that conflict the vacation period will be set to open shifts</span>
            </div>

            <hr />

            {/* Employee Selection */}
            <div className="space-y-4">
              <Select>
                <SelectTrigger className="border-0 border-b-2 border-gray-300 rounded-none">
                  <SelectValue placeholder="john deo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john-deo">john deo</SelectItem>
                </SelectContent>
              </Select>
              <Label className="text-sm">Department: Management</Label>
            </div>

            {/* Duration Type */}
            <RadioGroup defaultValue="range" className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single" id="add-single" />
                <Label htmlFor="add-single">Single day</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="add-range" />
                <Label htmlFor="add-range">Range</Label>
              </div>
            </RadioGroup>

            {/* Date Inputs */}
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  type="date"
                  placeholder="start date"
                  className="border-0 border-b-2 border-gray-300 rounded-none"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="date"
                  placeholder="end date"
                  className="border-0 border-b-2 border-gray-300 rounded-none"
                />
              </div>
            </div>

            {/* Comment */}
            <div>
              <Input placeholder="comments" className="border-0 border-b-2 border-gray-300 rounded-none" />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleAddSubmit} className="bg-black text-white">
                <Save className="h-4 w-4 mr-2" />
                SAVE
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Employee Details Dialog */}
      <Dialog open={showEmployeeDialog} onOpenChange={setShowEmployeeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button variant="ghost" size="sm" onClick={() => setShowEmployeeDialog(false)} className="mr-2 p-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <DialogTitle>Employees on Leaves</DialogTitle>
                  {selectedEmployee && (
                    <p className="text-sm text-gray-600 mt-1">{format(selectedEmployee.start, "MMMM d, yyyy")}</p>
                  )}
                </div>
              </div>
              <Button
                onClick={() => {
                  setShowEmployeeDialog(false)
                  setShowAddDialog(true)
                }}
                className="bg-black text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                ADD VACATION
              </Button>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {selectedEmployee?.people.map((person, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={person.picture || "/placeholder.svg"} alt={person.name} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{person.name}</div>
                    <div className="text-sm text-gray-600">{person.roll}</div>
                  </div>
                  <div className="text-sm text-gray-600">{person.role}</div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost">
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md">
          <div className="text-center space-y-4">
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteDialog(false)} className="p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <ExclamationTriangle className="h-8 w-8 text-yellow-500" />
              <span className="text-lg font-medium">Are you sure about cancelling your vacation?</span>
            </div>
            <div className="text-left">
              <Label htmlFor="reason">Reason</Label>
              <Input id="reason" className="border-0 border-b-2 border-gray-300 rounded-none mt-2" />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowDeleteDialog(false)} className="bg-black text-white">
                CANCEL VACATION
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                {confirmationType === "request" && "Vacation request has been made"}
                {confirmationType === "edit" && "Vacation request has been made"}
                {confirmationType === "add" && "Successfully vacation is added"}
              </h3>
              {(confirmationType === "request" || confirmationType === "edit") && (
                <div className="font-medium">
                  {(() => {
                    const startDate = confirmationType === "request" ? requestForm.startDate : editForm.startDate
                    const endDate = confirmationType === "request" ? requestForm.endDate : editForm.endDate

                    if (!startDate) return null

                    try {
                      const start = new Date(startDate)
                      const end = endDate ? new Date(endDate) : start

                      if (isNaN(start.getTime()) || (endDate && isNaN(end.getTime()))) {
                        return <span>Invalid date</span>
                      }

                      if (startDate === endDate || !endDate) {
                        return <span>{format(start, "dd MMM yyyy")}</span>
                      } else {
                        return (
                          <span>
                            {format(start, "dd MMM yyyy")} To {format(end, "dd MMM yyyy")}
                          </span>
                        )
                      }
                    } catch (error) {
                      return <span>Invalid date</span>
                    }
                  })()}
                </div>
              )}
            </div>
            <Button onClick={() => setShowConfirmDialog(false)} className="bg-black text-white w-full">
              VIEW VACATION CALENDAR
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default LeavesComponent
