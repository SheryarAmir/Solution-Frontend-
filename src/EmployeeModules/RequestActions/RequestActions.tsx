
import type { RequestData } from '../../types/RequestTypes';

interface ActionCellProps {
  data: RequestData;
  onView?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  type: 'shift' | 'leave' | 'profile' | 'myshift' | 'myleave' | 'myprofile';
}

export const RequestActionCell = ({
  data,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  type
}: ActionCellProps) => {
  return (
    <div className="flex">
      {onView && (
        <i 
          className="fa fa-eye mr-3 cursor-pointer hover:text-[#468F49]" 
          onClick={() => onView(data.id)}
        />
      )}
      
      {onEdit && (
        <i 
          className="fa fa-pencil-alt mr-3 cursor-pointer hover:text-[#ECBC0F]" 
          onClick={() => onEdit(data.id)}
        />
      )}
      
      {onDelete && (
        <i 
          className="fa fa-trash mr-3 cursor-pointer hover:text-[#A24646]" 
          onClick={() => onDelete(data.id)}
        />
      )}
      
      {onReject && (
        <i 
          className="fa fa-times mr-3 cursor-pointer text-[rgba(162,70,70,1)] hover:text-[#A24646]" 
          onClick={() => onReject(data.id)}
        />
      )}
      
      {onApprove && (
        <i 
          className="fa fa-check cursor-pointer text-[rgba(70,143,73,1)] hover:text-[#468F49]" 
          onClick={() => onApprove(data.id)}
        />
      )}
    </div>
  );
};