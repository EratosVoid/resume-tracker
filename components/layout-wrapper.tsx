"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { MenuIcon } from "lucide-react";
import { UniversalSidebar } from "./universal-sidebar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-1 h-full">
      <UniversalSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className="flex-1 min-h-screen max-h-screen overflow-y-auto">
        {/* Hamburger menu for mobile */}
        <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-default-200 px-4 py-3 lg:hidden">
          <Button isIconOnly variant="light" size="sm" onClick={toggleSidebar}>
            <MenuIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Main content */}
        {children}
      </div>
    </div>
  );
}
