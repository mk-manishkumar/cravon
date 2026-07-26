"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const queryClient = useQueryClient();

  // Fetch the current user session automatically
  const { data, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        const response = await authService.getMe();
        return response?.user || null;
      } catch (error) {
        console.error("Failed to fetch user session:", error);
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: false, // Don't retry on 401 Unauthorized
  });

  // Handle logout via mutation
  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: async () => {
      await authService.logout();
    },
    onSettled: () => {
      // Regardless of success or failure, clear the auth state locally
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  const value = useMemo(
    () => ({
      user: data || null,
      isLoading,
      logout,
      isLoggingOut,
    }),
    [data, isLoading, logout, isLoggingOut]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
