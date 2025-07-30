import React from 'react';
import { FaTrash } from 'react-icons/fa';

type NewPayrollActionCellRendererProps = {
  data: any;
  context: {
    componentParent: {
      deleteEmployee: (employee: any) => void;
    };
  };
};

const NewPayrollActionCellRenderer: React.FC<NewPayrollActionCellRendererProps> = ({ data, context }) => {
  const handleDelete = () => {
    context.componentParent.deleteEmployee(data);
  };

  return (
    <div>
      <FaTrash
        className="ml-2 text-gray-600 hover:text-red-600 cursor-pointer"
        onClick={handleDelete}
      />
    </div>
  );
};

export default NewPayrollActionCellRenderer;
