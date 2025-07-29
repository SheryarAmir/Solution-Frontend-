import React, { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import type { ICellRendererParams } from "ag-grid-community";

interface AttendanceCellProps extends ICellRendererParams {
  data: {
    id: string;
    // Add other properties if needed
  };
  context: {
    componentParent: {
      viewCalender: (id: string) => void;
    };
  };
}

const AttendanceCellRendererActions: React.FC<AttendanceCellProps> = (props) => {
  const [rowData, setRowData] = useState(props.data);

  useEffect(() => {
    setRowData(props.data);
  }, [props.data]);

  return (
    <div className="text-blue-600 text-lg cursor-pointer">
      <FaCalendarAlt
        className="hover:fill-blue-700 transition"
        onClick={() => props.context.componentParent.viewCalender(rowData.id)}
      />
    </div>
  );
};

export default AttendanceCellRendererActions;
