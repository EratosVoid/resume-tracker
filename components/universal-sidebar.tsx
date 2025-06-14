"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Button, Card, CardBody, Avatar, Chip } from "@heroui/react";
import {
  HomeIcon,
  BriefcaseIcon,
  UsersIcon,
  BarChart3Icon,
  SettingsIcon,
  XIcon,
  LogInIcon,
  UserPlusIcon,
  LogOutIcon,
  SparklesIcon,
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

const hrDashboardNavItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    name: "My Jobs",
    href: "/dashboard/jobs",
    icon: BriefcaseIcon,
  },
  {
    name: "Browse Jobs",
    href: "/jobs",
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

const applicantDashboardNavItems = [
  {
    name: "Dashboard",
    href: "/applicant",
    icon: HomeIcon,
  },
  {
    name: "Browse Jobs",
    href: "/jobs",
    icon: BriefcaseIcon,
  },
  {
    name: "Create Resume",
    href: "/resume/create",
    icon: SparklesIcon,
  },
  {
    name: "Upload Resume",
    href: "/resume/upload",
    icon: UsersIcon,
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
  const isApplicantArea = pathname.startsWith("/applicant");
  const isJobsArea = pathname.startsWith("/jobs");
  const isResumeArea = pathname.startsWith("/resume");

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  // Determine which navigation items to show based on user role and context
  const getNavItems = () => {
    // If user is logged in and in areas that should show sidebar
    if (
      session &&
      (isDashboard || isApplicantArea || isJobsArea || isResumeArea)
    ) {
      if (session.user.role === "hr") {
        return hrDashboardNavItems;
      } else if (session.user.role === "applicant") {
        return applicantDashboardNavItems;
      }
    }

    // If not in authenticated areas or not logged in, show public nav
    return publicNavItems;
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 transform transition-all duration-300 ease-in-out flex flex-col shadow-xl
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:inset-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-primary/10 dark:bg-primary/20 rounded-xl group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
              <Logo className="h-8 w-8 rounded-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Screener.ai
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                AI-Powered Intelligence
              </p>
            </div>
          </Link>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onClick={onToggle}
            className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <XIcon className="h-5 w-5" />
          </Button>
        </div>

        {/* User Role Badge (if authenticated) */}
        {session && (
          <div className="px-6 py-4">
            <Chip
              size="sm"
              variant="flat"
              color={session.user.role === "hr" ? "secondary" : "primary"}
              className="font-medium"
            >
              {session.user.role === "hr" ? "HR Dashboard" : "Applicant Portal"}
            </Chip>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto">
          <div className="space-y-2">
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
                    group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-primary dark:hover:text-primary"
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
                    className={`mr-3 h-5 w-5 transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 dark:text-gray-500 group-hover:text-primary"
                    }`}
                  />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full opacity-80" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile Section - Simplified without dropdown */}
        {status === "loading" ? (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3" />
              </div>
            </div>
          </div>
        ) : session ? (
          <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
            {/* User Info */}
            <div className="p-4">
              <Card className="shadow-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardBody className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      size="md"
                      name={session.user.name || "User"}
                      src={session.user.image || undefined}
                      color="primary"
                      className="ring-2 ring-primary/20"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {session.user.email}
                      </p>
                      {session.user.company && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                          {session.user.company}
                        </p>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="px-4 pb-4 space-y-2">
              <Button
                as={Link}
                href="/dashboard/settings"
                variant="flat"
                className="w-full justify-start bg-gray-50 dark:bg-gray-950/20 hover:bg-gray-100 dark:hover:bg-gray-950/40 text-gray-600 dark:text-gray-400"
                startContent={<SettingsIcon className="h-4 w-4" />}
              >
                Settings
              </Button>
              <Button
                onClick={handleLogout}
                variant="flat"
                color="danger"
                className="w-full justify-start bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400"
                startContent={<LogOutIcon className="h-4 w-4" />}
              >
                Sign Out
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="space-y-3">
              <Button
                as={Link}
                href="/auth/login"
                variant="bordered"
                className="w-full justify-start border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                startContent={<LogInIcon className="h-4 w-4" />}
              >
                Sign In
              </Button>
              <Button
                as={Link}
                href="/auth/register"
                color="primary"
                className="w-full justify-start bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                startContent={<UserPlusIcon className="h-4 w-4" />}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}

        {/* Theme Switch */}
        <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-4 bg-gray-50/30 dark:bg-gray-900/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </span>
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </>
  );
}
