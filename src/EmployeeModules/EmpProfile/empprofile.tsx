import React, { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isToday,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { Dialog } from "@headlessui/react";

type Shift = {
  id: number;
  employeeName: string;
  startTime: string;
  endTime: string;
};

export default function ShiftCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [shifts, setShifts] = useState<{ [date: string]: Shift[] }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({ employeeName: "", startTime: "", endTime: "" });

  const generateCalendarDays = () => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  };

  const openAddShiftModal = (date: Date) => {
    setSelectedDate(date);
    setFormData({ employeeName: "", startTime: "", endTime: "" });
    setEditIndex(null);
    setModalOpen(true);
  };

  const openEditShiftModal = (date: Date, index: number) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const shift = shifts[dateKey]?.[index];
    if (!shift) return;
    setSelectedDate(date);
    setFormData({ employeeName: shift.employeeName, startTime: shift.startTime, endTime: shift.endTime });
    setEditIndex(index);
    setModalOpen(true);
  };

  const saveShift = () => {
    if (!selectedDate) return;
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    const newShift: Shift = {
      id: Date.now(),
      employeeName: formData.employeeName,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    setShifts((prev) => {
      const updated = { ...prev };
      const existing = updated[dateKey] || [];
      if (editIndex !== null) {
        existing[editIndex] = { ...existing[editIndex], ...newShift };
      } else {
        existing.push(newShift);
      }
      updated[dateKey] = existing;
      return updated;
    });
    setModalOpen(false);
  };

  const deleteShift = (date: Date, index: number) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const updated = { ...shifts };
    updated[dateKey]?.splice(index, 1);
    if (updated[dateKey]?.length === 0) delete updated[dateKey];
    setShifts(updated);
  };

  const days = generateCalendarDays();

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="text-blue-500 font-semibold">Prev</button>
        <h2 className="text-lg font-bold">{format(currentDate, "MMMM yyyy")}</h2>
        <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="text-blue-500 font-semibold">Next</button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-gray-700 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd");
          const shiftList = shifts[dayKey] || [];

          return (
            <div
              key={dayKey}
              className={`border rounded p-2 min-h-[120px] flex flex-col justify-between ${!isSameMonth(day, currentDate) ? "bg-gray-100" : ""}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs ${isToday(day) ? "text-red-500 font-semibold" : ""}`}>{format(day, "d")}</span>
                <button onClick={() => openAddShiftModal(day)} className="text-green-600 text-xs font-medium hover:underline">
                  + Add
                </button>
              </div>

              <div className="flex flex-col space-y-1">
                {shiftList.map((shift, index) => (
                  <div key={shift.id} className="bg-blue-100 text-xs p-1 rounded flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{shift.employeeName}</p>
                      <p>{shift.startTime} - {shift.endTime}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditShiftModal(day, index)}
                        className="text-blue-500 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteShift(day, index)}
                        className="text-red-500 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded shadow-md max-w-md w-full">
            <Dialog.Title className="text-lg font-semibold mb-4">
              {editIndex !== null ? "Edit Shift" : "Add Shift"}
            </Dialog.Title>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Employee Name"
                className="w-full border rounded p-2"
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
              />
              <input
                type="time"
                className="w-full border rounded p-2"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
              <input
                type="time"
                className="w-full border rounded p-2"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setModalOpen(false)} className="text-gray-500 px-4 py-2">Cancel</button>
                <button onClick={saveShift} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
