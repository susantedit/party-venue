import { Navigate } from 'react-router-dom';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { SkeletonLoader } from '@/components/shared/SkeletonLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user, role } = useFirebaseAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <SkeletonLoader className="h-16 w-16 rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  // Email verification check
  if (user && !user.emailVerified) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Email Not Verified</h2>
          <p className="text-gray-600">Please check your email and verify your account before accessing the dashboard.</p>
        </div>
      </div>
    );
  }

  if (requiredRole && role !== requiredRole && role !== 'super-admin') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
