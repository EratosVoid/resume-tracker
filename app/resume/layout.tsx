"use client";

import { LayoutWrapper } from "@/components/layout-wrapper";
import { useSession } from "next-auth/react";

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user is logged in (HR or applicant), show the sidebar layout
  if (
    session &&
    (session.user.role === "hr" || session.user.role === "applicant")
  ) {
    return (
      <div className="min-h-screen bg-default-50">
        <LayoutWrapper>{children}</LayoutWrapper>
      </div>
    );
  }

  // If user is not logged in or doesn't have appropriate role, show without sidebar
  return <div className="min-h-screen bg-default-50">{children}</div>;
}
