import React, { useState } from "react"
import { Button } from "./ui/button"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar as CalendarComponent } from "./ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover"

interface CalendarProps {
  isOpen?: boolean
  onClose?: () => void
  showDualMonth?: boolean
}

export default function Calendar({ isOpen, onClose, showDualMonth = false }: CalendarProps) {
  const [calendarOpen, setCalendarOpen] = useState(isOpen || false)
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  
  // Calculate next month
  const nextMonth = new Date(currentDate)
  nextMonth.setMonth(nextMonth.getMonth() + 1)

  const handleOpenChange = (open: boolean) => {
    setCalendarOpen(open)
    if (!open && onClose) {
      onClose()
    }
  }

  // Update internal state when external isOpen prop changes
  React.useEffect(() => {
    if (isOpen !== undefined) {
      setCalendarOpen(isOpen)
    }
  }, [isOpen])

  return (
    <Popover open={calendarOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="p-2 bg-transparent">
          <CalendarIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-[9999] bg-white shadow-lg border" align="end">
        {showDualMonth ? (
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
        ) : (
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
        )}
      </PopoverContent>
    </Popover>
  )
}