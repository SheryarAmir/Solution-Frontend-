import React from 'react';
import { FaPencilAlt } from 'react-icons/fa';

type ViewShiftActionCellRendererProps = {
  data: {
    id: string | number;
    [key: string]: any;
  };
  context: {
    componentParent: {
      editEmployee: (id: string | number) => void;
    };
  };
};

const ViewShiftActionCellRenderer: React.FC<ViewShiftActionCellRendererProps> = ({ data, context }) => {
  const handleEdit = () => {
    context.componentParent.editEmployee(data.id);
  };

  return (
    <div>
      <FaPencilAlt
        className="text-gray-600 hover:text-yellow-500 cursor-pointer align-middle mr-2.5"
        onClick={handleEdit}
      />
    </div>
  );
};

export default ViewShiftActionCellRenderer;
  