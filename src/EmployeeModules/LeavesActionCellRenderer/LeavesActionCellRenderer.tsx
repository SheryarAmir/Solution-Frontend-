import React from 'react';
import { FaEye, FaTimes, FaCheck } from 'react-icons/fa';

type LeavesActionCellRendererProps = {
  data: {
    id: string | number;
    [key: string]: any;
  };
  context: {
    componentParent: {
      viewLeavesRequest: (id: string | number) => void;
    };
  };
};

const LeavesActionCellRenderer: React.FC<LeavesActionCellRendererProps> = ({ data, context }) => {
  const viewLeavesRequest = () => {
    context.componentParent.viewLeavesRequest(data.id);
  };

  return (
    <div className="flex items-center">
      <FaEye
        className="mr-3 text-gray-600 hover:text-green-700 cursor-pointer"
        onClick={viewLeavesRequest}
      />
      <FaTimes className="mr-3 text-[rgba(162,70,70,1)] cursor-pointer hover:text-red-700" />
      <FaCheck className="text-[rgba(70,143,73,1)] cursor-pointer hover:text-green-800" />
    </div>
  );
};

export default LeavesActionCellRenderer;
