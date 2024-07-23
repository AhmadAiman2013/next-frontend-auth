"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Layouts/Navigation";

import { useAuth } from "@/hooks/useAuth";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth({ middleware: 'auth', redirectIfNotAuthenticated: '/login'});

  if (!user) {
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