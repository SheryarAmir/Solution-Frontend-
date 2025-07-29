import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isToday, isSameDay } from "date-fns";
import { Dialog } from "@headlessui/react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

type Shift = {
  id: number;
  employeeName: string;
  startTime: string;
  endTime: string;
};

export default function ShiftScheduler() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [shifts, setShifts] = useState<{ [key: string]: Shift[] }>({});
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ employeeName: "", startTime: "", endTime: "" });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    const days = eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    });
    setCalendarDays(days);
  }, [currentDate]);

  const openAddShiftModal = (date: Date) => {
    setSelectedDate(date);
    setFormData({ employeeName: "", startTime: "", endTime: "" });
    setEditIndex(null);
    setModalOpen(true);
  };

  const openEditShiftModal = (date: Date, index: number) => {
    setSelectedDate(date);
    const dateKey = format(date, "yyyy-MM-dd");
    const shift = shifts[dateKey]?.[index];
    if (!shift) return;

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

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="text-blue-500 font-medium">Previous</button>
        <h2 className="text-xl font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
        <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="text-blue-500 font-medium">Next</button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-gray-600 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day) => {
          const dayKey = format(day, "yyyy-MM-dd");
          const isTodayFlag = isToday(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();

          return (
            <div
              key={day.toString()}
              className={`border rounded-md p-2 min-h-[100px] relative ${!isCurrentMonth ? "bg-gray-100" : ""}`}
            >
              <div className="flex justify-between items-center">
                <span className={`text-xs font-medium ${isTodayFlag ? "text-red-500" : ""}`}>
                  {format(day, "d")}
                </span>
                <button
                  onClick={() => openAddShiftModal(day)}
                  className="text-green-600 hover:text-green-800"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-1 space-y-1">
                {(shifts[dayKey] || []).map((shift, index) => (
                  <div key={shift.id} className="bg-blue-100 p-1 rounded text-xs flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{shift.employeeName}</p>
                      <p>{shift.startTime} - {shift.endTime}</p>
                    </div>
                    <div className="flex gap-1">
                      <PencilIcon
                        className="w-4 h-4 text-blue-500 cursor-pointer"
                        onClick={() => openEditShiftModal(day, index)}
                      />
                      <TrashIcon
                        className="w-4 h-4 text-red-500 cursor-pointer"
                        onClick={() => deleteShift(day, index)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded shadow-lg">
            <Dialog.Title className="text-lg font-medium mb-4">
              {editIndex !== null ? "Edit Shift" : "Add Shift"}
            </Dialog.Title>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Employee Name"
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                className="w-full border rounded p-2"
              />
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full border rounded p-2"
              />
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full border rounded p-2"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => setModalOpen(false)} className="text-gray-600 px-4 py-2">Cancel</button>
                <button onClick={saveShift} className="bg-blue-600 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
