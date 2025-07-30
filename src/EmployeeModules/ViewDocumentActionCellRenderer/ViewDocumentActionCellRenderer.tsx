import React from 'react';
import { FaEye, FaDownload, FaTrash } from 'react-icons/fa';

type ViewDocumentActionCellRendererProps = {
  data: {
    id: string | number;
    [key: string]: any;
  };
  context: {
    componentParent: {
      viewDocument: (id: string | number) => void;
      editDocument: (id: string | number) => void;
      downloadDocument: (id: string | number) => void;
    };
  };
};

const ViewDocumentActionCellRenderer: React.FC<ViewDocumentActionCellRendererProps> = ({ data, context }) => {
  const handleView = () => context.componentParent.viewDocument(data.id);
  const handleDelete = () => context.componentParent.editDocument(data.id);
  const handleDownload = () => context.componentParent.downloadDocument(data.id);

  return (
    <div className="flex items-center space-x-2">
      <FaEye
        onClick={handleView}
        className="cursor-pointer hover:text-green-600 align-middle"
      />
      <FaDownload
        onClick={handleDownload}
        className="cursor-pointer hover:text-blue-600 align-middle"
      />
      <FaTrash
        onClick={handleDelete}
        className="cursor-pointer hover:text-red-600 align-middle"
      />
    </div>
  );
};

export default ViewDocumentActionCellRenderer;
