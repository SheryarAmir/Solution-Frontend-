import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { CheckIcon, XIcon, PlusIcon, SearchIcon, Trash2Icon } from 'lucide-react';

interface Employee {
  id: string;
  empName: string;
  empImgUrl: string;
  department: string;
}

const AllEmployeeComponent: React.FC = () => {
  const navigate = useNavigate();
  const [searchEmployee, setSearchEmployee] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string[]>([]);
  const [allEmployee, setAllEmployee] = useState<Employee[]>([]);
  const [dispEmployee, setDispEmployee] = useState<Employee[]>([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteCashupObj, setDeleteCashupObj] = useState<Employee | null>(null);
  
  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockData: Employee[] = [
      { id: "1", empName: "John Doe", empImgUrl: "", department: "BOH" },
      { id: "2", empName: "Jane Smith", empImgUrl: "", department: "FOH" },
      { id: "3", empName: "Mike Johnson", empImgUrl: "", department: "Management" },
      { id: "4", empName: "Sarah Williams", empImgUrl: "", department: "BOH" },
    ];
    setAllEmployee(mockData);
    setDispEmployee(mockData);
  }, []);

  const refreshEmployeeData = () => {
    // Replace with actual API call
    // employeeFacade.load().then(data => {
    //   setAllEmployee(data);
    //   setDispEmployee(data);
    // });
  };

  const viewAll = () => {
    setDispEmployee([...allEmployee]);
    setSearchEmployee("");
    setSelectedDepartment([]);
  };

  const onEnter = (value: string) => {
    setSearchEmployee(value);
    filterEmployee(value, selectedDepartment);
  };

  const selectedDept = (val: string[]) => {
    setSelectedDepartment(val);
    filterEmployee(searchEmployee, val);
  };

  const filterEmployee = (searchTerm: string, departments: string[]) => {
    let tempEmp = allEmployee.filter(
      (x) =>
        x.id === searchTerm ||
        x.empName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    tempEmp = tempEmp.filter(
      (x) =>
        departments.includes("all") ||
        departments.length === 0 ||
        departments.includes(x.department)
    );

    setDispEmployee(tempEmp);
  };

  const editEmployee = (id: string) => {
    navigate(`/ROS/emp-management/employees/edit-employee/${id}`);
  };

  const viewEmployee = (id: string) => {
    navigate(`/ROS/emp-management/employees/view-employee/${id}`);
  };

  const viewCalender = (id: string) => {
    navigate(`/ROS/emp-management/employees/view-calender/${id}`);
  };

  const addNewEmp = () => {
    navigate("/ROS/emp-management/employees/add-employee");
  };

  const deleteEmployee = (employee: Employee) => {
    setDeleteCashupObj(employee);
    setIsDeleteOpen(true);
  };

  const deleteEmployeeData = () => {
    if (!deleteCashupObj) return;
    
    console.log(deleteCashupObj, "Has been deleted");
    // Replace with actual delete call
    // employeeFacade.deleteEmployee(deleteCashupObj.id);
    // refreshEmployeeData();
    
    setIsDeleteOpen(false);
  };

  return (
    <div className="container mx-auto px-4">
      {/* First heading row */}
      <div className="flex justify-between items-center">
        <div className="left-header">
          <h1 className="text-2xl font-bold">Employees</h1>
        </div>
      </div>

      <div className="my-4" />

      {/* Search and filter box */}
      <div className="row">
        <div className="col-span-12">
          <div className="card border-none rounded-lg shadow-md">
            <div className="card-body p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search Employee ID and name */}
                <div className="col-span-1">
                  <div className="flex items-center">
                    <SearchIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                      type="text"
                      className="w-full border-none focus:ring-0 placeholder-gray-400 text-lg"
                      placeholder="Employee Name or ID"
                      value={searchEmployee}
                      onChange={(e) => onEnter(e.target.value)}
                    />
                  </div>
                  <hr className="border-t border-gray-300 mt-2" />
                  <p 
                    className="text-blue-500 text-sm font-medium cursor-pointer mt-1"
                    onClick={viewAll}
                  >
                    <b>VIEW ALL</b>
                  </p>
                </div>

                {/* Filter by Department */}
                <div className="col-span-1">
                  <div className="flex items-center">
                    <SearchIcon className="w-5 h-5 text-gray-400 mr-2" />
                    <select
                      multiple
                      className="w-full border-none focus:ring-0 placeholder-gray-400 text-lg bg-white"
                      value={selectedDepartment}
                      onChange={(e) => {
                        const options = Array.from(e.target.selectedOptions, option => option.value);
                        selectedDept(options);
                      }}
                    >
                      <option value="BOH">BOH</option>
                      <option value="FOH">FOH</option>
                      <option value="Management">Management</option>
                      <option value="all">Select All</option>
                    </select>
                  </div>
                  <hr className="border-t border-gray-300 mt-2 w-full" />
                </div>
                
                <div className="col-span-1"></div>
                
                {/* Add New button */}
                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    className="bg-black text-white px-4 py-2 rounded text-sm flex items-center"
                    onClick={addNewEmp}
                  >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    ADD NEW
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee data table */}
      <div className="row mt-6">
        <h2 className="text-2xl font-normal text-black">Recent Search</h2>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EMPLOYEE NAME
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  EMP ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DEPARTMENT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dispEmployee.map((employee) => (
                <tr key={employee.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {employee.empImgUrl ? (
                        <img
                          src={employee.empImgUrl}
                          alt="Employee"
                          className="w-8 h-8 rounded-full mr-2"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
                      )}
                      <span>{employee.empName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {employee.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {employee.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewEmployee(employee.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View
                      </button>
                      <button
                        onClick={() => editEmployee(employee.id)}
                        className="text-green-500 hover:text-green-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => viewCalender(employee.id)}
                        className="text-purple-500 hover:text-purple-700"
                      >
                        Calendar
                      </button>
                      <button
                        onClick={() => deleteEmployee(employee)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            <div className="flex justify-end">
              <button onClick={() => setIsDeleteOpen(false)}>
                <XIcon className="w-5 h-5 cursor-pointer" />
              </button>
            </div>
            <div className="flex flex-col items-center mt-2">
              <Trash2Icon className="w-12 h-12 text-red-500" />
              <Dialog.Title className="text-lg font-bold mt-4">Delete Employee</Dialog.Title>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={deleteEmployeeData}
                className="px-6 py-2 bg-black text-white rounded"
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

export default AllEmployeeComponent;