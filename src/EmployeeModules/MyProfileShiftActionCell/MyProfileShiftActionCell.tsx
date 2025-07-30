import React from 'react';
import { FaPen } from 'react-icons/fa';

type MyProfileShiftActionCellProps = {
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

const MyProfileShiftActionCell: React.FC<MyProfileShiftActionCellProps> = ({ data, context }) => {
  const handleEdit = () => {
    context.componentParent.editEmployee(data.id);
  };

  return (
    <div className="flex items-center">
      <FaPen
        onClick={handleEdit}
        className="cursor-pointer hover:text-yellow-500 mr-2"
      />
    </div>
  );
};

export default MyProfileShiftActionCell;
