import React from 'react';
import { FaEye, FaTimes, FaCheck } from 'react-icons/fa';

type ProfileActionCellRendererProps = {
  data: {
    id: string | number;
    [key: string]: any;
  };
  context: {
    componentParent: {
      viewProfileRequest: (id: string | number) => void;
    };
  };
};

const ProfileActionCellRenderer: React.FC<ProfileActionCellRendererProps> = ({ data, context }) => {
  const viewProfileRequest = () => {
    context.componentParent.viewProfileRequest(data.id);
  };

  return (
    <div className="flex items-center">
      <FaEye
        className="mr-3 text-gray-600 hover:text-green-700 cursor-pointer"
        onClick={viewProfileRequest}
      />
      <FaTimes className="mr-3 text-[rgba(162,70,70,1)] cursor-pointer hover:text-red-700" />
      <FaCheck className="text-[rgba(70,143,73,1)] cursor-pointer hover:text-green-800" />
    </div>
  );
};

export default ProfileActionCellRenderer;
