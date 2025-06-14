"use client";

import { LayoutWrapper } from "@/components/layout-wrapper";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ApplicantLayout({
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

    // Ensure only applicants can access this area
    if (session.user.role !== "applicant") {
      router.push("/auth/login");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session || session.user.role !== "applicant") {
    return null;
  }

  // Always show the sidebar layout for authenticated applicants
  return (
    <div className="min-h-screen bg-default-50">
      <LayoutWrapper>{children}</LayoutWrapper>
    </div>
  );
}
 