"use client";

import { LayoutWrapper } from "@/components/layout-wrapper";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/login");
      return;
    }

    // Redirect users to their appropriate dashboard
    const currentPath = window.location.pathname;

    if (session.user.role === "applicant" && currentPath === "/dashboard") {
      router.push("/applicant");
    } else if (session.user.role === "hr" && currentPath === "/applicant") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-default-50">
      <LayoutWrapper>{children}</LayoutWrapper>
    </div>
  );
}
