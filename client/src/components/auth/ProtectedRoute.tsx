"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  readonly children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        if (pathname.startsWith("/partner") || pathname.startsWith("/auth/restaurant")) {
          router.push("/auth/restaurant/login");
        } else {
          router.push("/auth/login");
        }
      } else if (user.isPureStaff && (pathname.startsWith("/partner/pricing") || pathname.startsWith("/partner/staff"))) {
        // Block pure staff from accessing pricing or staff management pages
        router.push("/partner/dashboard");
      }
    }
  }, [isLoading, user, router, pathname]);

  if (isLoading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-[#888888]">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
