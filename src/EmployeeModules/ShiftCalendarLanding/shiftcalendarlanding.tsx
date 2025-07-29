import {
  Calendar,
  dateFnsLocalizer,
  Views,
  Event as CalendarEvent,
} from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import React, { useEffect, useMemo, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useForm } from 'react-hook-form';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/outline';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type Shift = {
  id: number;
  title: string;
  start: Date;
  end: Date;
  status?: string;
  isVacation?: boolean;
};

type Employee = {
  id: number;
  name: string;
  department: string;
};

export default function ShiftCalendar() {
  const [tab, setTab] = useState<'Employees' | 'My Shifts'>('Employees');
  const [viewDate, setViewDate] = useState(new Date());
  const [events, setEvents] = useState<Shift[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  const { register, handleSubmit, reset } = useForm();

  const employees: Employee[] = [
    { id: 1, name: 'Shrangi', department: 'HR' },
    { id: 2, name: 'Amit', department: 'Sales' },
  ];

  const columns = [
    { headerName: 'WEEK START', field: 'weekStart', sortable: true, filter: true },
    { headerName: 'WEEK END', field: 'weekEnd', sortable: true, filter: true },
    { headerName: 'TOTAL SHIFT', field: 'totalShift' },
    { headerName: 'TOTAL LEAVES', field: 'totalLeaves' },
    {
      headerName: 'STATUS',
      field: 'status',
      cellStyle: (params: any) => ({ color: params.value === 'Published' ? 'green' : 'black' }),
    },
  ];

  const rowData = [
    {
      weekStart: '2024-07-01',
      weekEnd: '2024-07-07',
      totalShift: 5,
      totalLeaves: 1,
      status: 'Published',
    },
  ];

  useEffect(() => {
    setEvents([
      {
        id: 1,
        title: 'Shrangi Shift',
        start: new Date(),
        end: new Date(new Date().setHours(new Date().getHours() + 4)),
        status: 'Published',
      },
    ]);
  }, []);

  const onSubmit = (data: any) => {
    const start = new Date(`${data.date}T${data.startTime}`);
    const end = new Date(`${data.date}T${data.endTime}`);

    const newShift: Shift = {
      id: events.length + 1,
      title: data.title,
      start,
      end,
      status: data.status,
    };

    setEvents([...events, newShift]);
    setModalOpen(false);
    reset();
  };

  const deleteShift = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Shift Calendar</h1>
        <div>
          <button
            className={`px-4 py-1 mr-2 ${tab === 'Employees' ? 'bg-black text-white' : 'bg-gray-200'}`}
            onClick={() => setTab('Employees')}
          >
            Employees
          </button>
          <button
            className={`px-4 py-1 ${tab === 'My Shifts' ? 'bg-black text-white' : 'bg-gray-200'}`}
            onClick={() => setTab('My Shifts')}
          >
            My Shifts
          </button>
        </div>
      </div>

      {tab === 'Employees' && (
        <>
          <div className="ag-theme-alpine" style={{ height: 300 }}>
            <AgGridReact columnDefs={columns} rowData={rowData} pagination={true} />
          </div>
          <button
            className="mt-4 bg-black text-white px-3 py-1 rounded"
            onClick={() => setModalOpen(true)}
          >
            <PlusIcon className="w-5 h-5 inline-block mr-1" />
            Add Shift
          </button>
        </>
      )}

      {tab === 'My Shifts' && (
        <div className="h-[600px] mt-4">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={[Views.WEEK]}
            defaultView={Views.WEEK}
            date={viewDate}
            onNavigate={date => setViewDate(date)}
            style={{ height: '100%' }}
            components={{
              event: ({ event }) => (
                <div className="relative bg-white p-2 border rounded shadow-sm">
                  <div className="font-semibold text-sm">{event.title}</div>
                  <div className="text-xs">{format(event.start, 'hh:mm a')} - {format(event.end, 'hh:mm a')}</div>
                  <div className="absolute top-1 right-1 flex gap-1">
                    <PencilIcon className="w-4 h-4 text-blue-500 cursor-pointer" onClick={() => {
                      setSelectedShift(event);
                      setModalOpen(true);
                    }} />
                    <TrashIcon className="w-4 h-4 text-red-500 cursor-pointer" onClick={() => deleteShift(event.id)} />
                  </div>
                </div>
              ),
            }}
          />
        </div>
      )}

      {/* Modal */}
      <Transition appear show={modalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white w-full max-w-md p-6 rounded shadow-xl">
                <Dialog.Title className="text-lg font-bold mb-4">Add/Edit Shift</Dialog.Title>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                  <input {...register('title')} placeholder="Title" className="w-full border p-2 rounded" required />
                  <input {...register('date')} type="date" className="w-full border p-2 rounded" required />
                  <input {...register('startTime')} type="time" className="w-full border p-2 rounded" required />
                  <input {...register('endTime')} type="time" className="w-full border p-2 rounded" required />
                  <select {...register('status')} className="w-full border p-2 rounded">
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                  <div className="flex justify-end gap-2">
                    <button type="button" className="px-4 py-1 border" onClick={() => setModalOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="px-4 py-1 bg-black text-white rounded">
                      Save
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
