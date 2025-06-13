"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";

export const NavBar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <Navbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">ATS</p>
          </NextLink>
        </NavbarBrand>
        <ul className="hidden lg:flex gap-4 justify-start ml-2">
          <NavbarItem>
            <NextLink
              className={clsx(
                linkStyles({ color: "foreground" }),
                "data-[active=true]:text-primary data-[active=true]:font-medium"
              )}
              color="foreground"
              href="/"
            >
              Home
            </NextLink>
          </NavbarItem>
          <NavbarItem>
            <NextLink
              className={clsx(
                linkStyles({ color: "foreground" }),
                "data-[active=true]:text-primary data-[active=true]:font-medium"
              )}
              color="foreground"
              href="/jobs"
            >
              Jobs
            </NextLink>
          </NavbarItem>
          {session && (
            <NavbarItem>
              <NextLink
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href="/dashboard"
              >
                Dashboard
              </NextLink>
            </NavbarItem>
          )}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        
        {status === "loading" ? (
          <NavbarItem>
            <div className="w-8 h-8 rounded-full bg-default-300 animate-pulse" />
          </NavbarItem>
        ) : session ? (
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name={session.user.name || "User"}
                  size="sm"
                  src={session.user.image || undefined}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">{session.user.name}</p>
                  <p className="text-sm">{session.user.email}</p>
                  {session.user.company && (
                    <p className="text-xs text-default-500">{session.user.company}</p>
                  )}
                </DropdownItem>
                <DropdownItem key="dashboard" as={NextLink} href="/dashboard">
                  Dashboard
                </DropdownItem>
                <DropdownItem key="settings" as={NextLink} href="/dashboard/settings">
                  Settings
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        ) : (
          <>
            <NavbarItem className="hidden md:flex">
              <Button
                as={NextLink}
                className="text-sm font-normal text-default-600"
                href="/auth/login"
                variant="flat"
              >
                Login
              </Button>
            </NavbarItem>
            <NavbarItem className="hidden md:flex">
              <Button
                as={NextLink}
                color="primary"
                href="/auth/register"
                variant="flat"
              >
                Sign Up
              </Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          <NavbarMenuItem>
            <Link color="foreground" href="/" size="lg">
              Home
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link color="foreground" href="/jobs" size="lg">
              Jobs
            </Link>
          </NavbarMenuItem>
          {session ? (
            <>
              <NavbarMenuItem>
                <Link color="foreground" href="/dashboard" size="lg">
                  Dashboard
                </Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link color="danger" onClick={handleLogout} size="lg">
                  Logout
                </Link>
              </NavbarMenuItem>
            </>
          ) : (
            <>
              <NavbarMenuItem>
                <Link color="foreground" href="/auth/login" size="lg">
                  Login
                </Link>
              </NavbarMenuItem>
              <NavbarMenuItem>
                <Link color="primary" href="/auth/register" size="lg">
                  Sign Up
                </Link>
              </NavbarMenuItem>
            </>
          )}
        </div>
      </NavbarMenu>
    </Navbar>
  );
};
