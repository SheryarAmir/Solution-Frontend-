import React, { useState, useRef } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal } from 'react-bootstrap';
import { Dialog } from '@headlessui/react';

import { enUS } from 'date-fns/locale';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface LeaveEvent {
  start: Date;
  end: Date;
  status?: string;
  icon?: string;
  delete?: string;
  edit?: string;
  id?: number;
  people?: Array<{
    picture: string;
    name: string;
    roll: number;
    role: string;
  }>;
}

const LeavesComponent: React.FC = () => {
  const [viewMode, setViewMode] = useState<string>('My Leaves');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);
  const [showAddConfirmationModal, setShowAddConfirmationModal] = useState<boolean>(false);
  const [showEditConfirmationModal, setShowEditConfirmationModal] = useState<boolean>(false);
  
  const [selectedPeople, setSelectedPeople] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<LeaveEvent | null>(null);
  
  const [requestForm, setRequestForm] = useState({
    starttime: '',
    endtime: '',
    comment: ''
  });
  
  const [editForm, setEditForm] = useState({
    startdate: '',
    enddate: '',
    comment: ''
  });

  const events: LeaveEvent[] = [
    {
      start: new Date(2021, 2, 2),
      end: new Date(2021, 2, 2),
      status: "Approved",
      icon: 'fa fa-check-circle'
    },
    {
      start: new Date(2021, 2, 10),
      end: new Date(2021, 2, 10),
      status: "Rejected",
    },
    {
      start: new Date(2021, 2, 27),
      end: new Date(2021, 2, 27),
      status: "Approved",
      icon: 'fa fa-check-circle'
    },
    {
      start: new Date(2021, 2, 17),
      end: new Date(2021, 2, 17),
      status: "Pending",
      delete: "fa fa-trash",
      edit: "fa fa-pencil-alt"
    },
    {
      start: new Date(2021, 3, 27),
      end: new Date(2021, 3, 27),
      status: "Approved",
      icon: 'fa fa-check-circle'
    },
    {
      start: new Date(2021, 4, 23),
      end: new Date(2021, 4, 23),
      status: "Approved",
      icon: 'fa fa-check-circle'
    },
  ];

  const peopleEvents: LeaveEvent[] = [
    {
      id: 1,
      start: new Date(2021, 2, 4),
      end: new Date(2021, 2, 4),
      people: [
        {
          picture: "https://mdbootstrap.com/img/Photos/Avatars/img%20(10).jpg",
          name: "charan",
          roll: 102,
          role: "FOH"
        },
        {
          picture: "https://mdbootstrap.com/img/Photos/Avatars/img%20(12).jpg",
          name: "shrangi",
          roll: 110,
          role: "BOH"
        },
        {
          picture: "https://mdbootstrap.com/img/Photos/Avatars/img%20(30).jpg",
          name: "ashvita",
          roll: 403,
          role: "Management"
        },
        {
          picture: "https://mdbootstrap.com/img/Photos/Avatars/img%20(15).jpg",
          name: "satya",
          roll: 400,
          role: "FOH"
        }
      ]
    },
    {
      id: 2,
      start: new Date(2021, 2, 11),
      end: new Date(2021, 2, 11),
      people: [
        {
          picture: "https://mdbootstrap.com/img/Photos/Avatars/img%20(10).jpg",
          name: "charan",
          roll: 102,
          role: "FOH"
        },
        {
          picture: "https://mdbootstrap.com/img/Photos/Avatars/img%20(12).jpg",
          name: "shrangi",
          roll: 110,
          role: "BOH"
        },
        {
          picture: "https://mdbootstrap.com/img/Photos/Avatars/img%20(30).jpg",
          name: "ashvita",
          roll: 403,
          role: "Management"
        },
        {
          picture: "https://mdbootstrap.com/img/Photos/Avatars/img%20(15).jpg",
          name: "satya",
          roll: 400,
          role: "FOH"
        }
      ]
    },
    {
      id: 3,
      start: new Date(2021, 2, 26),
      end: new Date(2021, 2, 26),
      people: [
        {
          picture: "https://mdbootstrap.com/img/Photos/Avatars/img%20(10).jpg",
          name: "charan",
          roll: 102,
          role: "FOH"
        },
        {
          picture: "https://mdbootstrap.com/img/Photos/Avatars/img%20(12).jpg",
          name: "shrangi",
          roll: 110,
          role: "BOH"
        },
        {
          picture: "https://mdbootstrap.com/img/Photos/Avatars/img%20(30).jpg",
          name: "ashvita",
          roll: 403,
          role: "Management"
        }
      ]
    },
    {
      id: 4,
      start: new Date(2021, 2, 14),
      end: new Date(2021, 2, 14),
      people: [
        {
          picture: "https://mdbootstrap.com/img/Photos/Avatars/img%20(10).jpg",
          name: "charan",
          roll: 102,
          role: "FOH"
        },
        {
          picture: "https://mdbootstrap.com/img/Photos/Avatars/img%20(12).jpg",
          name: "shrangi",
          roll: 110,
          role: "BOH"
        },
        {
          picture: "https://mdbootstrap.com/img/Photos/Avatars/img%20(30).jpg",
          name: "ashvita",
          roll: 403,
          role: "Management"
        }
      ]
    },
  ];

  const handleRequestSubmit = () => {
    setShowRequestModal(false);
    setShowConfirmationModal(true);
  };

  const handleEditSubmit = () => {
    setShowEditModal(false);
    setShowEditConfirmationModal(true);
  };

  const handleAddSubmit = () => {
    setShowAddModal(false);
    setShowAddConfirmationModal(true);
  };

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
  };

  const navigate = (action: string) => {
    if (action === 'PREV') {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      setCurrentDate(newDate);
    } else if (action === 'NEXT') {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      setCurrentDate(newDate);
    }
  };

  const eventStyleGetter = (event: LeaveEvent) => {
    let style = {};
    if (event.status === 'Approved') {
      style = {
        backgroundColor: 'rgba(70, 143, 73, 0.1)',
        color: '#468F49',
      };
    } else if (event.status === 'Pending') {
      style = {
        backgroundColor: 'rgba(141, 141, 141, 0.1)',
        color: '#000000',
      };
    } else if (event.status === 'Rejected') {
      style = {
        backgroundColor: 'rgba(162, 70, 70, 0.1)',
        color: '#A24646',
        opacity: '90%',
      };
    } else if (event.people) {
      style = {
        backgroundColor: 'rgba(236, 188, 15, 0.1)',
      };
    }
    return { style };
  };

  const CustomEvent = ({ event }: { event: LeaveEvent }) => {
    if (viewMode === 'My Leaves') {
      return (
        <div className="relative h-full w-full">
          {event.status && (
            <div className="absolute bottom-1 left-1 text-xs">
              {event.icon && <i className={`${event.icon} mr-1`}></i>}
              <span className="font-bold">{event.status}</span>
            </div>
          )}
          {(event.edit || event.delete) && (
            <div className="absolute bottom-1 right-1 text-xs">
              {event.edit && (
                <i 
                  className={`${event.edit} mr-1 cursor-pointer hover:text-yellow-500`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(event);
                    setShowEditModal(true);
                  }}
                ></i>
              )}
              {event.delete && (
                <i 
                  className={`${event.delete} cursor-pointer hover:text-red-500`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDeleteModal(true);
                  }}
                ></i>
              )}
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="relative h-full w-full">
          {event.people && (
            <div className="text-xs px-1">
              {event.people.slice(0, 2).map((person, index) => (
                <span key={index} className="font-bold">{person.name}, </span>
              ))}
              {event.people.length > 2 && (
                <span 
                  className="text-blue-500 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPeople(event);
                    setShowModal(true);
                  }}
                >
                  more
                </span>
              )}
            </div>
          )}
        </div>
      );
    }
  };

  const CustomHeader = ({ label }: { label: string }) => {
    return (
      <div className="text-center font-bold">
        {label}
      </div>
    );
  };

  const CustomDay = ({ date }: { date: Date }) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const hasEvent = [...events, ...peopleEvents].some(
      e => e.start.toDateString() === date.toDateString()
    );
    const isFuture = date > today;

    return (
      <div className="relative h-full w-full">
        <div className="absolute top-1 right-1">{date.getDate()}</div>
        {isToday && (
          <div className="absolute top-1 left-1 text-xs font-bold">Today</div>
        )}
        {!hasEvent && isFuture && (
          <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2">
            <i 
              className="fa fa-plus-circle cursor-pointer"
              onClick={() => setShowRequestModal(true)}
            ></i>
          </div>
        )}
      </div>
    );
  };

  const upcomingLeave = events.find(event => event.start > new Date());

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap justify-between mb-4">
        <div className="flex items-center">
          <h4 className="mr-5">Leaves</h4>
          <div className="flex border rounded overflow-hidden">
            <button
              className={`px-4 py-1 ${viewMode === 'Employees' ? 'bg-black text-white' : 'bg-white'}`}
              onClick={() => setViewMode('Employees')}
            >
              Employees
            </button>
            <button
              className={`px-4 py-1 ${viewMode === 'My Leaves' ? 'bg-black text-white' : 'bg-white'}`}
              onClick={() => setViewMode('My Leaves')}
            >
              My Leaves
            </button>
          </div>
        </div>

        <div className="flex items-center">
          {viewMode === 'My Leaves' && (
            <button 
              className="btn btn-sm bg-black text-white mr-3"
              onClick={() => setShowRequestModal(true)}
            >
              REQUEST VACATION
            </button>
          )}
          {viewMode === 'Employees' && (
            <button 
              className="btn btn-sm bg-black text-white mr-3"
              onClick={() => setShowAddModal(true)}
            >
              <i className="fa fa-plus mr-1"></i> ADD VACATION
            </button>
          )}
          
          <div className="flex items-center border rounded" style={{ height: '30px', width: '200px' }}>
            <button 
              className="px-2"
              onClick={() => navigate('PREV')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"
                />
              </svg>
            </button>
            
            <h3 className="text-sm mx-auto">
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            
            <button 
              className="px-2"
              onClick={() => navigate('NEXT')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'My Leaves' && (
        <div className="flex flex-wrap justify-between mb-4">
          <div className="flex">
            <div className="mr-4">
              <b>28</b> <br />
              <small>Total Holidays</small>
            </div>
            <div className="mr-4">
              <b>17</b> <br />
              <small>Remaining Holidays</small>
            </div>
            <div className="mr-4">
              <b>11</b> <br />
              <small>Used Holidays</small>
            </div>
          </div>
          <div>
            <b>Upcoming Leave:</b> {upcomingLeave ? format(upcomingLeave.start, 'd MMM yyyy') : 'None'}
          </div>
        </div>
      )}

      <div className="bg-white rounded shadow" style={{ height: '600px' }}>
        <Calendar
          localizer={localizer}
          events={viewMode === 'My Leaves' ? events : peopleEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          date={currentDate}
          onNavigate={handleDateChange}
          view={Views.MONTH}
          components={{
            event: CustomEvent,
            month: {
              header: CustomHeader,
              dateHeader: ({ date }: { date: Date }) => <CustomDay date={date} />
            }
          }}
          eventPropGetter={eventStyleGetter}
        />
      </div>

      {/* People Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Body>
          <div className="flex justify-between">
            <h5>
              <span onClick={() => setShowModal(false)} className="cursor-pointer mr-2">
                <i className="fa fa-arrow-left"></i>
              </span>
              <b> Employees on Leaves </b>
              <div className="text-gray-500 ml-5">
                {selectedPeople && format(selectedPeople.start, 'MMM d, yyyy')}
              </div>
            </h5>
            <span 
              className="btn btn-sm bg-black text-white"
              onClick={() => {
                setShowModal(false);
                setShowAddModal(true);
              }}
            >
              <i className="fa fa-plus"></i> ADD VACATION
            </span>
          </div>
          <br />
          {selectedPeople?.people?.map((person: any, index: number) => (
            <div key={index} className="flex items-center mb-4">
              <div className="w-1/12 ml-4">
                <img
                  className="rounded-full"
                  width="30"
                  height="30"
                  alt="profile"
                  src={person.picture}
                />
              </div>
              <div className="w-2/12">{person.name}</div>
              <div className="w-2/12">{person.roll}</div>
              <div className="w-3/12">{person.role}</div>
              <div className="w-3/12">
                <i className="fas fa-calendar-alt mx-3 cursor-pointer hover:text-blue-500"></i>
                <i className="fas fa-pencil-alt mx-3 cursor-pointer hover:text-yellow-500"></i>
                <i className="fas fa-trash mx-3 cursor-pointer hover:text-red-500"></i>
              </div>
            </div>
          ))}
        </Modal.Body>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
        <Modal.Body>
          <form>
            <div className="flex justify-between">
              <h5>
                <span onClick={() => setShowEditModal(false)} className="cursor-pointer mr-2">
                  <i className="fa fa-arrow-left"></i>
                </span>
                <b> Request vacation </b>
                <p className="ml-5">Account balance</p>
              </h5>
              <span 
                className="btn btn-sm bg-black text-white"
                onClick={() => {
                  setShowEditModal(false);
                  handleEditSubmit();
                }}
              >
                <i className="far fa-save mr-1"></i> SAVE
              </span>
            </div>
            <div className="flex ml-3 mb-5">
              <div className="w-1/4">
                <b>28</b> <br />
                <small className="text-xs">Total Holidays</small>
              </div>
              <div className="w-1/4">
                <b>17</b> <br />
                <small className="text-xs">Holidays Left</small>
              </div>
              <div className="w-1/4">
                <b>11</b> <br />
                <small className="text-xs">Used Holidays</small>
              </div>
            </div>
            <div className="mb-3">
              <span className="text-sm ml-3">
                <i className="fa fa-info-circle fa-xs mr-1"></i> 
                Shifts that conflict the Vacation period will be set to Open Shifts
              </span>
            </div>
            <hr className="my-2" />
            <br />
            <div className="ml-5">
              <span className="mr-5">
                <input type="radio" name="test" id="singles" value="Single" />
                <label htmlFor="singles" className="ml-1">Single Day </label>
              </span>
              <span className="mr-5">
                <input
                  type="radio"
                  name="test"
                  id="multiples"
                  value="Multiple"
                  defaultChecked
                />
                <label htmlFor="multiples" className="ml-1">Range</label>
              </span>
            </div>
            <br />
            <div className="ml-5">
              <input
                type="date"
                name="startdate"
                id="startdate"
                className="border-b-2 border-gray-300 mr-5"
                value={editForm.startdate}
                onChange={(e) => setEditForm({...editForm, startdate: e.target.value})}
              />
              <input
                type="date"
                name="enddate"
                id="enddate"
                className="border-b-2 border-gray-300"
                value={editForm.enddate}
                onChange={(e) => setEditForm({...editForm, enddate: e.target.value})}
              />
            </div>
            <div className="ml-5 mt-5">
              <input
                type="text"
                name="comment"
                id="comment"
                className="border-b-2 border-gray-300 w-3/4"
                placeholder="Comments"
                value={editForm.comment}
                onChange={(e) => setEditForm({...editForm, comment: e.target.value})}
              />
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Request Vacation Modal */}
      <Modal show={showRequestModal} onHide={() => setShowRequestModal(false)} centered size="lg">
        <Modal.Body>
          <form>
            <div className="flex justify-between">
              <h5>
                <span onClick={() => setShowRequestModal(false)} className="cursor-pointer mr-2">
                  <i className="fa fa-arrow-left"></i>
                </span>
                <b> Request vacation </b>
                <p className="ml-5">Account balance</p>
              </h5>
              <span 
                className="btn btn-sm bg-black text-white"
                onClick={() => {
                  setShowRequestModal(false);
                  handleRequestSubmit();
                }}
              >
                <i className="far fa-save mr-1"></i> SAVE
              </span>
            </div>
            <div className="flex ml-3 mb-5">
              <div className="w-1/4">
                <b>28</b> <br />
                <small>Total holidays</small>
              </div>
              <div className="w-1/4">
                <b>17</b> <br />
                <small>holidays left</small>
              </div>
              <div className="w-1/4">
                <b>11</b> <br />
                <small>Used holidays</small>
              </div>
            </div>
            <div className="mb-3">
              <span className="text-sm ml-3">
                <i className="fa fa-info-circle fa-xs mr-1"></i> 
                shifts that conflict the vacation period will be set to open shifts
              </span>
            </div>
            <hr className="my-2" />
            <br />
            <div className="ml-5">
              <span className="mr-5">
                <input type="radio" name="test" id="singles" value="Single" />
                <label htmlFor="singles" className="ml-1">Single day </label>
              </span>
              <span className="mr-5">
                <input
                  type="radio"
                  name="test"
                  id="multiples"
                  value="Multiple"
                  defaultChecked
                />
                <label htmlFor="multiples" className="ml-1">Range</label>
              </span>
            </div>
            <br />
            <div className="ml-5">
              <input
                type="date"
                name="starttime"
                id="starttime"
                className="border-b-2 border-gray-300 mr-5"
                value={requestForm.starttime}
                onChange={(e) => setRequestForm({...requestForm, starttime: e.target.value})}
              />
              <input
                type="date"
                name="endtime"
                id="endtime"
                className="border-b-2 border-gray-300"
                value={requestForm.endtime}
                onChange={(e) => setRequestForm({...requestForm, endtime: e.target.value})}
              />
            </div>
            <div className="ml-5 mt-5">
              <input
                type="text"
                name="comment"
                id="comment"
                className="border-b-2 border-gray-300 w-3/4"
                placeholder="comments"
                value={requestForm.comment}
                onChange={(e) => setRequestForm({...requestForm, comment: e.target.value})}
              />
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Add Vacation Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered size="lg">
        <Modal.Body>
          <form>
            <div className="flex justify-between">
              <h5>
                <span onClick={() => setShowAddModal(false)} className="cursor-pointer mr-2">
                  <i className="fa fa-arrow-left"></i>
                </span>
                <b> Add New Vacation </b>
                <p className="ml-5">Account balance</p>
              </h5>
              <span 
                className="btn btn-sm bg-black text-white"
                onClick={() => {
                  setShowAddModal(false);
                  handleAddSubmit();
                }}
              >
                <i className="far fa-save mr-1"></i> SAVE
              </span>
            </div>
            <div className="flex ml-3 mb-5">
              <div className="w-1/4">
                <b>28</b> <br />
                <small>Total holidays</small>
              </div>
              <div className="w-1/4">
                <b>17</b> <br />
                <small>Holidays left</small>
              </div>
              <div className="w-1/4">
                <b>11</b> <br />
                <small>Used holidays</small>
              </div>
            </div>
            <div className="mb-3">
              <span className="text-sm ml-3">
                <i className="fa fa-info-circle fa-xs mr-1"></i> 
                Shifts that conflict the vacation period will be set to open shifts
              </span>
            </div>
            <hr className="my-2" />
            <div className="ml-5">
              <select
                name="name"
                id="name"
                className="border-b border-black w-4/5"
              >
                <option value="john deo">john deo</option>
              </select>
              <label className="ml-5 block">
                Department: Management
              </label>
            </div>
            <div className="mt-5 ml-5">
              <span className="mr-5">
                <input type="radio" name="test" id="singles" value="Single" />
                <label htmlFor="singles" className="ml-1">Single day </label>
              </span>
              <span className="mr-5">
                <input
                  type="radio"
                  name="test"
                  id="multiples"
                  value="Multiple"
                  defaultChecked
                />
                <label htmlFor="multiples" className="ml-1">Range</label>
              </span>
            </div>
            <br />
            <div className="ml-5">
              <input
                type="date"
                name="startdate"
                id="startdate"
                className="border-b-2 border-gray-300 mr-5"
              />
              <input
                type="date"
                name="enddate"
                id="enddate"
                className="border-b-2 border-gray-300"
              />
            </div>
            <div className="ml-5 mt-5">
              <input
                type="text"
                name="comment"
                id="comment"
                className="border-b-2 border-gray-300 w-3/4"
                placeholder="comments"
              />
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-4">
            <div className="text-right">
              <i 
                className="fa fa-times cursor-pointer"
                onClick={() => setShowDeleteModal(false)}
              ></i>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mt-3">
                <i className="fa fa-exclamation-circle text-3xl mr-2"></i> 
                <span className="font-bold">Are you sure about cancelling your vacation?</span>
              </div>
              <br />
              <div className="text-left mt-4">
                Reason <br />
                <input
                  type="text"
                  className="border-b-2 border-black w-full"
                />
              </div>
            </div>
            <br />
            <div className="text-right">
              <button
                className="btn btn-sm bg-black text-white px-4 py-1"
                onClick={() => setShowDeleteModal(false)}
              >
                CANCEL VACATION
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Vacation Request Confirmation Modal */}
      <Dialog open={showConfirmationModal} onClose={() => setShowConfirmationModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-4">
            <div className="text-center">
              <h6 className="mt-4">Vacation request has been made</h6>
              {requestForm.starttime === requestForm.endtime ? (
                <b>{format(new Date(requestForm.starttime), 'dd MMM yyyy')}</b>
              ) : (
                <b>
                  {format(new Date(requestForm.starttime), 'dd MMM yyyy')} To{' '}
                  {format(new Date(requestForm.endtime), 'dd MMM yyyy')}
                </b>
              )}
              <br />
            </div>
            <br />
            <div className="text-center">
              <button
                className="btn btn-sm bg-black text-white px-4 py-1"
                onClick={() => setShowConfirmationModal(false)}
              >
                VIEW VACATION CALENDAR
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Vacation Add Confirmation Modal */}
      <Dialog open={showAddConfirmationModal} onClose={() => setShowAddConfirmationModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-4">
            <div className="text-center">
              <h6 className="mt-4">Successfully vacation is added</h6>
              <br />
            </div>
            <br />
            <div className="text-center">
              <button
                className="btn btn-sm bg-black text-white px-4 py-1"
                onClick={() => setShowAddConfirmationModal(false)}
              >
                VIEW VACATION CALENDAR
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Vacation Edit Confirmation Modal */}
      <Dialog open={showEditConfirmationModal} onClose={() => setShowEditConfirmationModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-4">
            <div className="text-center">
              <h6 className="mt-4">Vacation request has been made</h6>
              {editForm.startdate === editForm.enddate ? (
                <b>{format(new Date(editForm.startdate), 'dd MMM yyyy')}</b>
              ) : (
                <b>
                  {format(new Date(editForm.startdate), 'dd MMM yyyy')} To{' '}
                  {format(new Date(editForm.enddate), 'dd MMM yyyy')}
                </b>
              )}
              <br />
            </div>
            <br />
            <div className="text-center">
              <button
                className="btn btn-sm bg-black text-white px-4 py-1"
                onClick={() => setShowEditConfirmationModal(false)}
              >
                VIEW VACATION CALENDAR
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default LeavesComponent;