import React from 'react';
import { FaTrash, FaPencilAlt, FaEye } from 'react-icons/fa';

type MyleavesActionCellRendererProps = {
  data: {
    id: string | number;
    [key: string]: any;
  };
  context: {
    componentParent: {
      edit: (id: string | number) => void;
      delete: (id: string | number) => void;
      viewLeaves: (id: string | number) => void;
    };
  };
};

const MyleavesActionCellRenderer: React.FC<MyleavesActionCellRendererProps> = ({ data, context }) => {
  const handleEdit = () => context.componentParent.edit(data.id);
  const handleDelete = () => context.componentParent.delete(data.id);
  const handleView = () => context.componentParent.viewLeaves(data.id);

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

export default MyleavesActionCellRenderer;
