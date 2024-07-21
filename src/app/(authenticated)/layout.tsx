"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Layouts/Navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useAuth } from "@/hooks/auth";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { user } = useAuth();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);


  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     router.replace("/login");
  //   }
  // }, [isAuthenticated, router]);

  return isAuthenticated ? (
    <div className="min-h-screen bg-gray-100">
      <Navigation user={user} />
      <main>{children}</main>
    </div>
  ) : router.replace("/login");
};

export default AppLayout;