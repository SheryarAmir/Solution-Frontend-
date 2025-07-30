import React from 'react';
import { FaEye, FaDownload, FaTrash } from 'react-icons/fa';

type EditDocumentActionCellRendererProps = {
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

const EditDocumentActionCellRenderer: React.FC<EditDocumentActionCellRendererProps> = ({ data, context }) => {
  const viewDocument = () => {
    context.componentParent.viewDocument(data.id);
  };

  const deleteDocument = () => {
    context.componentParent.editDocument(data.id);
  };

  const downloadDocument = () => {
    context.componentParent.downloadDocument(data.id);
  };

  return (
    <div className="flex items-center">
      <FaEye
        className="text-gray-600 hover:text-green-600 cursor-pointer"
        onClick={viewDocument}
      />
      <FaDownload
        className="ml-2 text-gray-600 hover:text-blue-600 cursor-pointer"
        onClick={downloadDocument}
      />
      <FaTrash
        className="ml-2 text-gray-600 hover:text-[#A24646] cursor-pointer"
        onClick={deleteDocument}
      />
    </div>
  );
};

export default EditDocumentActionCellRenderer;
