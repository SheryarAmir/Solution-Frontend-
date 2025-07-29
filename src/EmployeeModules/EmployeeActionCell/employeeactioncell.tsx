import React, { useEffect, useState } from "react";
import { FaTrash, FaPencilAlt, FaEye, FaCalendarAlt } from "react-icons/fa";
import type { ICellRendererParams } from "ag-grid-community";

interface Employee {
  id: string;
  // other fields if needed
}

interface ActionCellRendererProps extends ICellRendererParams {
  data: Employee;
  context: {
    componentParent: {
      viewCalender: (id: string) => void;
      editEmployee: (id: string) => void;
      viewEmployee: (id: string) => void;
      deleteEmployee: (employee: Employee) => void;
    };
  };
}


const EmployeeActionCellRenderer: React.FC<ActionCellRendererProps> = (props) => {
  const [employee, setEmployee] = useState<Employee>(props.data);

  useEffect(() => {
    setEmployee(props.data);
  }, [props.data]);

  return (
    <div className="flex items-center gap-3 text-gray-700 text-lg">
      <FaCalendarAlt
        className="cursor-pointer hover:fill-blue-700"
        onClick={() => props.context.componentParent.viewCalender(employee.id)}
      />
      <FaPencilAlt
        className="cursor-pointer hover:text-yellow-500"
        onClick={() => props.context.componentParent.editEmployee(employee.id)}
      />
      <FaEye
        className="cursor-pointer hover:text-green-600"
        onClick={() => props.context.componentParent.viewEmployee(employee.id)}
      />
      <FaTrash
        className="cursor-pointer hover:text-red-600"
        onClick={() => props.context.componentParent.deleteEmployee(employee)}
      />
    </div>
  );
};

export default EmployeeActionCellRenderer;
