import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'shift' | 'leave' | 'profile' | 'delete';
  data?: any;
}

export const RequestModal = ({ isOpen, onClose, type, data }: ModalProps) => {
  if (type === 'delete') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-center">
              <i className="fa fa-exclamation-circle text-3xl mr-2" />
              <span className="text-xl font-bold">
                {data?.type === 'shift' 
                  ? 'Are you sure about cancel shift?' 
                  : data?.type === 'leave'
                  ? 'Are you sure about cancel leaves?'
                  : 'Are you sure about cancel request?'}
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button className="w-40 bg-black" onClick={onClose}>
              {data?.type === 'shift' ? 'DELETE SHIFT' : 
               data?.type === 'leave' ? 'DELETE VACATION' : 'DELETE REQUEST'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <i 
              className="fa fa-arrow-left mr-2 cursor-pointer" 
              onClick={onClose}
            />
            <span>
              {type === 'shift' ? 'Update Shift Request' : 
               type === 'leave' ? 'Vacation Request' : 'Profile'}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Modal content based on type */}
        {type === 'shift' && <ShiftModalContent />}
        {type === 'leave' && <LeaveModalContent />}
        {type === 'profile' && <ProfileModalContent />}
      </DialogContent>
    </Dialog>
  );
};

const ShiftModalContent = () => (
  <div className="space-y-4">
    {/* Shift modal content */}
  </div>
);

const LeaveModalContent = () => (
  <div className="space-y-4">
    {/* Leave modal content */}
  </div>
);

const ProfileModalContent = () => (
  <div className="space-y-4">
    {/* Profile modal content */}
  </div>
);