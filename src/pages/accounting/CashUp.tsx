import { Permission } from '../../types/auth';
import { ProtectedRoute } from '../../components/ProtectedRoute';

const CashUp = () => {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_CASHUP}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Cash Up</h1>
        <p>Cash up management page</p>
      </div>
    </ProtectedRoute>
  );
};

export default CashUp; 