import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';

interface Employee {
  id: string;
  basicInfo: {
    empDetails: {
      empImgUrl: string;
    };
  };
  // Add other employee properties as needed
}

interface ShiftDetail {
  Shift_date: string;
  location: string;
  startTime: string;
  endTime: string;
  break: string;
  approved: string;
}

interface DocDetail {
  docName: string;
  desp: string;
  docType: string;
  attachment: string;
}

const ViewEmployeeComponent: React.FC = () => {
  const { id: empid } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [empFormTab, setEmpFormTab] = useState<string>("Basic");
  const [allEmployee, setAllEmployee] = useState<Employee[]>([]);
  const [empobj, setEmpobj] = useState<Employee | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Mock data - replace with actual API calls
  const ShiftDetails: ShiftDetail[] = [
    {
      Shift_date: "01 March 2021",
      location: "Cremes Cafe",
      startTime: "09:00",
      endTime: "15:00",
      break: "00:45",
      approved: "Not approved",
    },
    {
      Shift_date: "01 March 2021",
      location: "Cremes Cafe",
      startTime: "09:00",
      endTime: "15:00",
      break: "00:45",
      approved: "Not approved",
    },
    {
      Shift_date: "01 March 2021",
      location: "Cremes Cafe",
      startTime: "09:00",
      endTime: "15:00",
      break: "00:45",
      approved: "Not approved",
    },
    {
      Shift_date: "01 March 2021",
      location: "Cremes Cafe",
      startTime: "09:00",
      endTime: "15:00",
      break: "00:45",
      approved: "Not approved",
    },
  ];

  const DocDetails: DocDetail[] = [
    {
      docName: "Passport",
      desp: "Passport of employee",
      docType: "contract",
      attachment: "image_123.jpg",
    },
  ];

  const columnDefs = [
    {
      field: "Shift_date",
      headerName: "DATE",
      sortable: true,
      filter: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
    },
    { field: "location", headerName: "LOCATION", sortable: true, filter: true },
    {
      field: "startTime",
      headerName: "START TIME",
      sortable: true,
      filter: true,
    },
    {
      field: "endTime",
      headerName: "END TIME",
      sortable: true,
      filter: true,
    },
    {
      field: "break",
      headerName: "BREAK",
      sortable: true,
      filter: true,
    },
    {
      field: "approved",
      headerName: "APPROVED",
      sortable: true,
      filter: true,
    },
  ];

  const columnDefs2 = [
    {
      field: "docName",
      headerName: "DOCUMENT NAME",
      sortable: true,
      filter: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
    },
    { field: "desp", headerName: "DESCRIPTION", sortable: true, filter: true },
    {
      field: "docType",
      headerName: "DOCUMENT TYPE",
      sortable: true,
      filter: true,
    },
    {
      field: "attachment",
      headerName: "ATTACHMENT",
      sortable: true,
      filter: true,
    },
  ];

  useEffect(() => {
    // Replace with actual API call
    // employeeFacade.getEmpShiftCalendar().then(data => {
    //   setAllEmployee(data);
    //   const foundEmp = data.find((e: Employee) => e.id === empid);
    //   setEmpobj(foundEmp);
    // });
    
    // Mock implementation
    const mockData: Employee[] = [
      {
        id: empid || '',
        basicInfo: {
          empDetails: {
            empImgUrl: ''
          }
        }
      }
    ];
    setAllEmployee(mockData);
    setEmpobj(mockData.find(e => e.id === empid) || null);
  }, [empid]);

  const setFormTab = (tab: string) => {
    setEmpFormTab(tab);
  };

  const deleteEmployeeData = () => {
    // Replace with actual delete call
    // employeeFacade.deleteEmployee(empobj?.id);
    console.log(empobj, "Has been deleted");
    navigate("/ROS/emp-management/employees/all-employee");
    setIsDeleteOpen(false);
  };

  const goToEdit = () => {
    navigate(`/ROS/emp-management/employees/edit-employee/${empid}`);
  };

  return (
    <div className="flex flex-0 flex-auto">
      {/* Sidebar */}
      <div className="flex-basis-[235px] shadow-[2px_2px_4px_rgba(88,88,88,0.2)] h-[163vh] ml-[-110px] mt-[-31px]">
        <div className="pl-[25px] pb-[20px] back-icon">
          <button onClick={() => navigate("/ROS/emp-management/employees/all-employee")} className="cursor-pointer">
            Back
          </button>
        </div>
        <ul className="nav-list">
          {["Basic", "Contact", "Job", "Pay", "Documents", "Shifts"].map((tab) => (
            <li
              key={tab}
              className={`px-[27px] py-[22px] cursor-pointer ${
                empFormTab === tab ? 'shadow-[inset_0px_11px_8px_-5px_#ccc,inset_0px_-11px_8px_-5px_#ccc]' : ''
              }`}
              onClick={() => setFormTab(tab)}
            >
              {tab}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-full mt-[-28px] emp-details">
        <div className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-normal font-roboto text-black heading">Employee Details</h1>
          <div className="flex gap-4 save">
            <button 
              onClick={() => setIsDeleteOpen(true)}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Delete
            </button>
            <button 
              onClick={goToEdit}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Edit
            </button>
          </div>
        </div>

        {empFormTab === "Basic" && (
          <div className="p-4">
            <div className="form-title">
              <div className="profileTitle">Profile Picture</div>
              <div className="box shadow-[2px_2px_12px_rgba(88,88,88,0.2)] max-w-[150px] h-[150px]">
                {empobj?.basicInfo.empDetails.empImgUrl ? (
                  <img 
                    src={empobj.basicInfo.empDetails.empImgUrl} 
                    alt="Employee" 
                    className="w-[139px] ml-[-9px] mt-[5px] EmpObjImg"
                  />
                ) : (
                  <div className="relative text-gray-500 left-[38%] top-[39%] label">Image</div>
                )}
              </div>
            </div>

            {/* Basic Info Fields */}
            <div className="mt-6">
              <h3 className="text-lg font-roboto text-black">Basic Information</h3>
              <hr className="my-4 border-t-2 border-black border-opacity-10" />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-roboto text-black title">First Name</p>
                  <p className="text-base font-roboto text-black form-detail">{empobj?.basicInfo?.firstName || '-'}</p>
                </div>
                <div>
                  <p className="text-xs font-roboto text-black title">Last Name</p>
                  <p className="text-base font-roboto text-black form-detail">{empobj?.basicInfo?.lastName || '-'}</p>
                </div>
                {/* Add more fields as needed */}
              </div>
            </div>
          </div>
        )}

        {empFormTab === "Shifts" && (
          <div className="p-4">
            <h2 className="text-xl font-roboto text-black mb-4">Shift Details</h2>
            <div className="ag-theme-alpine pl-[15px] pt-[15px]">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      {columnDefs.map((col) => (
                        <th key={col.field} className="px-4 py-2 text-left border">
                          {col.headerName}
                        </th>
                      ))}
                      <th className="px-4 py-2 text-left border">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ShiftDetails.map((shift, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border">{shift.Shift_date}</td>
                        <td className="px-4 py-2 border">{shift.location}</td>
                        <td className="px-4 py-2 border">{shift.startTime}</td>
                        <td className="px-4 py-2 border">{shift.endTime}</td>
                        <td className="px-4 py-2 border">{shift.break}</td>
                        <td className="px-4 py-2 border">{shift.approved}</td>
                        <td className="px-4 py-2 border">
                          {/* Replace with your action component */}
                          <button className="text-blue-500">Actions</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {empFormTab === "Documents" && (
          <div className="p-4">
            <h2 className="text-xl font-roboto text-black mb-4">Document Details</h2>
            <div className="ag-theme-alpine pl-[15px] pt-[15px]">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      {columnDefs2.map((col) => (
                        <th key={col.field} className="px-4 py-2 text-left border">
                          {col.headerName}
                        </th>
                      ))}
                      <th className="px-4 py-2 text-left border">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DocDetails.map((doc, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 border">{doc.docName}</td>
                        <td className="px-4 py-2 border">{doc.desp}</td>
                        <td className="px-4 py-2 border">{doc.docType}</td>
                        <td className="px-4 py-2 border">{doc.attachment}</td>
                        <td className="px-4 py-2 border">
                          {/* Replace with your action component */}
                          <button className="text-blue-500">Actions</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs can be implemented similarly */}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 deletepopup h-[216px] w-[458px] rounded-[10px]">
            <Dialog.Title className="text-lg font-bold">Delete Employee</Dialog.Title>
            <Dialog.Description className="mt-4">
              Are you sure you want to delete this employee?
            </Dialog.Description>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={deleteEmployeeData}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default ViewEmployeeComponent;