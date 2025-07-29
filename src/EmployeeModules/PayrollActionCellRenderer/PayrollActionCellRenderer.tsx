import React from "react";
import { FaDownload } from "react-icons/fa";
import type { ICellRendererParams } from "ag-grid-community";

interface PayrollCellRendererProps extends ICellRendererParams {
  data: {
    id: string;
    // Add more properties here if needed
  };
  context: {
    componentParent: {
      download: (id: string) => void;
    };
  };
}

const PayrollActionCellRenderer: React.FC<PayrollCellRendererProps> = ({
  data,
  context,
}) => {
  const handleDownload = () => {
    context.componentParent.download(data.id);
  };

  return (
    <div className="text-green-600 text-lg cursor-pointer">
      <FaDownload
        className="hover:fill-green-700 transition"
        onClick={handleDownload}
      />
    </div>
  );
};

export default PayrollActionCellRenderer;
