import React from 'react';
import { FaTrash, FaPencilAlt, FaEye } from 'react-icons/fa';

type MyShiftsActionCellRendererProps = {
  data: {
    id: string | number;
    [key: string]: any;
  };
  context: {
    componentParent: {
      editShifts: (id: string | number) => void;
      deleteShifts: (id: string | number) => void;
      viewShifts: (id: string | number) => void;
    };
  };
};

const MyShiftsActionCellRenderer: React.FC<MyShiftsActionCellRendererProps> = ({ data, context }) => {
  const handleEdit = () => context.componentParent.editShifts(data.id);
  const handleDelete = () => context.componentParent.deleteShifts(data.id);
  const handleView = () => context.componentParent.viewShifts(data.id);

  return (
    <div className="flex items-center space-x-3">
      <FaPencilAlt
        onClick={handleEdit}
        className="cursor-pointer hover:text-yellow-500"
      />
      <FaTrash
        onClick={handleDelete}
        className="cursor-pointer hover:text-red-600"
      />
      <FaEye
        onClick={handleView}
        className="cursor-pointer hover:text-green-600"
      />
    </div>
  );
};

export default MyShiftsActionCellRenderer;
