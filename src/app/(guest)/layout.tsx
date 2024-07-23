"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";

const GuestLayout = ({ children }: { children: ReactNode }) => {

  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return <div>Loading...</div>
  }

  return <>{children}</>;
};

export default GuestLayout;