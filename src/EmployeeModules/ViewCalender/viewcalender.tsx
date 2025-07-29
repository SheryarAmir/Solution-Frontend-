import React, { useState } from "react";
import {
  Calendar,
  dateFnsLocalizer,
  Event as CalendarEvent,
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

type ShiftEvent = CalendarEvent & {
  id: string;
  title: string;
  type: "shift" | "vacation";
  location: string;
};

type ShiftForm = {
  title: string;
  location: string;
  start: string;
  end: string;
};

type SlotInfo = {
  start: Date;
  end: Date;
  slots: Date[];
  action: "select" | "click" | "doubleClick";
};

export default function ViewCalendar() {
  const [events, setEvents] = useState<ShiftEvent[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { register, handleSubmit, reset } = useForm<ShiftForm>();

  const openModal = (date: Date) => {
    setSelectedDate(date);
    setIsOpen(true);
  };

  const onSubmit = (data: ShiftForm) => {
    const newEvent: ShiftEvent = {
      id: uuidv4(),
      title: data.title,
      start: new Date(data.start),
      end: new Date(data.end),
      type: "shift",
      location: data.location,
      allDay: false,
    };

    setEvents([...events, newEvent]);
    reset();
    setIsOpen(false);
  };

  const eventStyleGetter = (event: ShiftEvent) => {
    const backgroundColor =
      event.type === "shift" ? "#2563eb" : "#facc15"; // Blue or Yellow
    return {
      style: {
        backgroundColor,
        color: "white",
        borderRadius: "6px",
        border: "none",
        padding: "4px",
      },
    };
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Employee Shift Calendar</h1>

      <Calendar
        localizer={localizer}
        events={events}
        selectable
        style={{ height: "80vh" }}
        onSelectSlot={(slotInfo: SlotInfo) => openModal(slotInfo.start)}
        onSelectEvent={(event: CalendarEvent) =>
          alert(`Shift: ${event.title}`)
        }
        eventPropGetter={eventStyleGetter}
        popup
      />

      {/* Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <Dialog.Title className="text-lg font-bold mb-4">Add Shift</Dialog.Title>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                type="text"
                {...register("title", { required: true })}
                placeholder="Shift Title"
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                {...register("location")}
                placeholder="Location"
                className="w-full border p-2 rounded"
              />
              <input
                type="datetime-local"
                {...register("start")}
                defaultValue={selectedDate?.toISOString().slice(0, 16)}
                className="w-full border p-2 rounded"
              />
              <input
                type="datetime-local"
                {...register("end")}
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  Save
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
