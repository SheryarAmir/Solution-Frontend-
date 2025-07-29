import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportService } from '../../../service/report.service';
import { DownloadService } from '../../../../../shared/services/download.service';

interface ReportsActionCellRendererProps {
  data: {
    id: string;
    [key: string]: any;
  };
  context: {
    componentParent: {
      deleteReport: (data: any) => void;
    };
  };
}

const ReportsActionCellRenderer: React.FC<ReportsActionCellRendererProps> = ({ data, context }) => {
  const navigate = useNavigate();
  const reportService = new ReportService();
  const downloadService = new DownloadService();

  const viewReport = () => {
    navigate(`/accounting/report/view/${data.id}`);
  };

  const deleteReport = () => {
    context.componentParent.deleteReport(data);
  };

  const downloadEXCEL = () => {
    const reportData = reportService.getDummyReportById(data.id);
    downloadService.downloadExcel(reportData);
  };

  return (
    <div className="flex space-x-3">
      <button 
        onClick={viewReport}
        className="text-gray-600 hover:text-green-600 transition-colors duration-200"
        title="View Report"
      >
        <i className="fas fa-eye"></i>
      </button>
      
      <button 
        onClick={deleteReport}
        className="text-gray-600 hover:text-red-600 transition-colors duration-200"
        title="Delete Report"
      >
        <i className="fas fa-trash"></i>
      </button>
      
      <button 
        onClick={downloadEXCEL}
        className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
        title="Download Excel"
      >
        <i className="fas fa-file-excel"></i>
      </button>
    </div>
  );
};

export default ReportsActionCellRenderer;