"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Layouts/Navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useAuth } from "@/hooks/auth";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { user } = useAuth();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation user={user} />
      <main>{children}</main>
    </div>
  );
};

export default AuthLayout;