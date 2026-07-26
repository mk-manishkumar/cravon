"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ 
  children, 
  redirectTo = "/auth/login" 
}: { 
  children: React.ReactNode, 
  redirectTo?: string 
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  if (isLoading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-[#888888]">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
