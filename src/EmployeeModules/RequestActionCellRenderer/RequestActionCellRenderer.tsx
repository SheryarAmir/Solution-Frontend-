import React from 'react';
import { FaEye, FaTimes, FaCheck } from 'react-icons/fa';

type RequestActionCellRendererProps = {
  data: {
    id: string | number;
    [key: string]: any;
  };
  context: {
    componentParent: {
      viewShiftRequest: (id: string | number) => void;
    };
  };
};

const RequestActionCellRenderer: React.FC<RequestActionCellRendererProps> = ({ data, context }) => {
  const viewShiftRequest = () => {
    context.componentParent.viewShiftRequest(data.id);
  };

  return (
    <div className="flex items-center">
      <FaEye
        className="mr-3 text-gray-600 hover:text-green-600 cursor-pointer"
        onClick={viewShiftRequest}
      />
      <FaTimes
        className="mr-3 text-red-600 hover:text-red-700 cursor-pointer"
      />
      <FaCheck
        className="text-green-700 hover:text-green-800 cursor-pointer"
      />
    </div>
  );
};

export default RequestActionCellRenderer;
