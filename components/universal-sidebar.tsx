"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  HomeIcon,
  BriefcaseIcon,
  UsersIcon,
  BarChart3Icon,
  SettingsIcon,
  XIcon,
  LogInIcon,
  UserPlusIcon,
} from "lucide-react";
import Link from "next/link";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";

interface UniversalSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const publicNavItems = [
  {
    name: "Home",
    href: "/",
    icon: HomeIcon,
  },
  {
    name: "Jobs",
    href: "/jobs",
    icon: BriefcaseIcon,
  },
];

const dashboardNavItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    name: "Jobs",
    href: "/dashboard/jobs",
    icon: BriefcaseIcon,
  },
  {
    name: "Applications",
    href: "/dashboard/applications",
    icon: UsersIcon,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3Icon,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: SettingsIcon,
  },
];

export function UniversalSidebar({ isOpen, onToggle }: UniversalSidebarProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const navItems = isDashboard ? dashboardNavItems : publicNavItems;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:inset-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-default-200 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <h1 className="text-xl font-bold text-primary">
              {isDashboard ? "ATS Portal" : "Resume Tracker"}
            </h1>
          </Link>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onClick={onToggle}
            className="lg:hidden"
          >
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation - Flex grow to take available space */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" &&
                  item.href !== "/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-default-700 hover:bg-default-100"
                    }
                  `}
                  onClick={() => {
                    // Close mobile sidebar when navigating
                    if (window.innerWidth < 1024) {
                      onToggle();
                    }
                  }}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? "text-white" : "text-default-400"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section */}
        <div className="flex-shrink-0 border-t border-default-200 p-4">
          {status === "loading" ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-default-300 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-default-300 rounded animate-pulse mb-2" />
                <div className="h-3 bg-default-300 rounded animate-pulse w-2/3" />
              </div>
            </div>
          ) : session ? (
            <Card className="shadow-sm">
              <CardBody className="p-3">
                <Dropdown placement="top-start">
                  <DropdownTrigger>
                    <div className="flex items-center space-x-3 cursor-pointer hover:bg-default-100 rounded-lg p-2 -m-2 transition-colors">
                      <Avatar
                        size="sm"
                        name={session.user.name || "User"}
                        src={session.user.image || undefined}
                        color="primary"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-default-900 truncate">
                          {session.user.name}
                        </p>
                        <p className="text-xs text-default-500 truncate">
                          {session.user.email}
                        </p>
                        {session.user.company && (
                          <p className="text-xs text-default-400 truncate">
                            {session.user.company}
                          </p>
                        )}
                      </div>
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="profile" className="h-14 gap-2">
                      <p className="font-semibold">{session.user.name}</p>
                      <p className="text-sm">{session.user.email}</p>
                      {session.user.company && (
                        <p className="text-xs text-default-500">
                          {session.user.company}
                        </p>
                      )}
                    </DropdownItem>
                    {!isDashboard ? (
                      <DropdownItem key="dashboard" as={Link} href="/dashboard">
                        Dashboard
                      </DropdownItem>
                    ) : null}
                    <DropdownItem
                      key="settings"
                      as={Link}
                      href="/dashboard/settings"
                    >
                      Settings
                    </DropdownItem>
                    <DropdownItem
                      key="logout"
                      color="danger"
                      onClick={handleLogout}
                    >
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-3">
              <Button
                as={Link}
                href="/auth/login"
                variant="flat"
                className="w-full justify-start"
                startContent={<LogInIcon className="h-4 w-4" />}
              >
                Login
              </Button>
              <Button
                as={Link}
                href="/auth/register"
                color="primary"
                variant="flat"
                className="w-full justify-start"
                startContent={<UserPlusIcon className="h-4 w-4" />}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>

        {/* Theme Switch - At the very bottom */}
        <div className="flex-shrink-0 border-t border-default-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-default-700">Theme</span>
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </>
  );
}
