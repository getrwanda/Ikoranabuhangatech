import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

import { User } from "@shared/schema";

interface ProtectedRouteProps {
  children: ReactNode;
}

interface AuthResponse {
  success: boolean;
  user: User | null;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  const { data, isLoading } = useQuery<AuthResponse>({
    queryKey: ["/api/auth/me"],
  });

  useEffect(() => {
    if (!isLoading) {
      if (!data?.user) {
        setLocation("/admin/login");
      } else {
        setIsChecking(false);
      }
    }
  }, [data, isLoading, setLocation]);

  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
