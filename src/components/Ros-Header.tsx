"use client"

import { useState, useEffect } from "react"
import {  LogOut, } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Select,SelectTrigger, SelectValue } from "./ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Calendar as CalendarComponent } from "./ui/calendar"
import RosLogo from "../assets/images/ROS_FINAL-07.png"

export default function ROSHeader() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Mock user data - replace with actual authenticated user
  const user = {
    name: "duskoaky",
    email: "duskoaky@example.com",
    avatar: "/placeholder.svg?height=32&width=32&text=D",
  }

  // Update time every second for real-time display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDateTime = (date: Date) => {
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }

    const dateOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    }

    const time = date.toLocaleTimeString("en-US", timeOptions)
    const formattedDate = date.toLocaleDateString("en-US", dateOptions)

    return `${time}, ${formattedDate}`
  }

  const handleLogout = () => {
    console.log("Logging out user:", user.name)
    // Implement your logout logic here
    // For example: router.push('/login') or signOut()
  }

  const handleProfileSelect = (value: string) => {
    if (value === "logout") {
      handleLogout()
    }
    // Handle other profile actions
  }

  return (
    <header className="w-full bg-red-500 border-b border-gray-200 px-6 py-3 fixed">
      <div className="flex items-center justify-between max-w-full z-20">
        {/* Logo */}
        <div className="flex items-center">
          <div className="">
         <img src={RosLogo} alt="logo" className="w-20 cursor-pointer"/>
          </div>
        </div>

        {/* Right Section - Time, User Dropdown, Avatar */}
        <div className="flex items-center space-x-4">
          {/* Real-time Clock with Calendar */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="text-sm text-gray-700 hover:text-gray-900 font-medium cursor-pointer">
                {formatDateTime(currentTime)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[9999] bg-white border border-gray-200 shadow-lg" align="end">
              <CalendarComponent mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
            </PopoverContent>
          </Popover>

          {/* User Name Dropdown */}
          <Select onValueChange={handleProfileSelect}>
            <SelectTrigger className="w-auto border-none shadow-none bg-transparent hover:bg-gray-50">
              <SelectValue placeholder={user.name} />
            </SelectTrigger>
            {/* <SelectContent align="end">
              <SelectItem value="profile">
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </div>
              </SelectItem>
              <SelectItem value="settings">
                <div className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </div>
              </SelectItem>
              <SelectItem value="logout" className="text-red-600">
                <div className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </div>
              </SelectItem>
            </SelectContent> */}
          </Select>

          {/* User Avatar with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="bg-gray-600 text-white text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 z-[9999] bg-white border border-gray-200 shadow-lg" align="end" forceMount>
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
