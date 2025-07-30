import React from 'react';
import { FaPencilAlt } from 'react-icons/fa';

type EditShiftActionCellRendererProps = {
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

const EditShiftActionCellRenderer: React.FC<EditShiftActionCellRendererProps> = ({ data, context }) => {
  const handleEdit = () => {
    context.componentParent.editEmployee(data.id);
  };

  return (
    <div>
      <FaPencilAlt
        className="text-gray-600 hover:text-yellow-500 cursor-pointer"
        onClick={handleEdit}
      />
    </div>
  );
};

export default EditShiftActionCellRenderer;
