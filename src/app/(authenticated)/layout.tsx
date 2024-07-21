"use client";

import { ReactNode } from "react";
import { useAuth } from "@/hooks/auth";
import Navigation from "@/components/Layouts/Navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    
    if (!isAuthenticated) {
      router.replace("/login");
    }
   
  }, [isAuthenticated, router]);
  return (
    <>
      {isAuthenticated && (
        <div className="min-h-screen bg-gray-100">
          <Navigation user={user} />
          <main>{children}</main>
        </div>
      )}
    </>
  );
};

export default AppLayout;
