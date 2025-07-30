import React from 'react';
import { FaTrash, FaPencilAlt, FaEye } from 'react-icons/fa';

type MyProfileActionCellRendererProps = {
  data: {
    id: string | number;
    [key: string]: any;
  };
  context: {
    componentParent: {
      deleteProfile: (id: string | number) => void;
      viewprofile: (id: string | number) => void;
      editprofile: (id: string | number) => void;
    };
  };
};

const MyProfileActionCellRenderer: React.FC<MyProfileActionCellRendererProps> = ({ data, context }) => {
  const handleEdit = () => context.componentParent.editprofile(data.id);
  const handleDelete = () => context.componentParent.deleteProfile(data.id);
  const handleView = () => context.componentParent.viewprofile(data.id);

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

export default MyProfileActionCellRenderer;
