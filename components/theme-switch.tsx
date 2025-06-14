"use client";

import { Switch } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import clsx from "clsx";

import { MoonFilledIcon, SunFilledIcon } from "@/components/icons";
import { VisuallyHidden } from "@react-aria/visually-hidden";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: {
    base?: string;
    wrapper?: string;
    thumb?: string;
  };
}

export const ThemeSwitch: React.FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const onChange = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) return <div className="w-8 h-6" />;

  return (
    <Switch
      classNames={{
        base: clsx(
          "px-1 gap-2 !bg-transparent hover:!bg-transparent",
          className,
          classNames?.base
        ),
        wrapper: clsx(
          "p-0 h-6 w-12 overflow-visible rounded-full",
          "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600",
          "group-data-[selected=true]:bg-gray-700 group-data-[selected=true]:dark:bg-gray-200",
          "transition-colors duration-200",
          {
            "justify-start": theme === "light",
            "justify-end": theme === "dark",
          },
          classNames?.wrapper
        ),
        thumb: clsx(
          "w-5 h-5 border-2 shadow-lg transition-all duration-200",
          "group-data-[selected=true]:ml-6",
          {
            "bg-yellow-400 border-yellow-500 text-yellow-800":
              theme === "light",
            "bg-slate-800 border-slate-700 text-slate-100": theme === "dark",
          },
          classNames?.thumb
        ),
      }}
      size="md"
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <MoonFilledIcon
            className={clsx(className, "text-slate-100 w-3 h-3")}
          />
        ) : (
          <SunFilledIcon
            className={clsx(className, "text-yellow-800 w-3 h-3")}
          />
        )
      }
      isSelected={theme === "dark"}
      onValueChange={onChange}
    >
      <VisuallyHidden>
        <span>Switch to {theme === "light" ? "dark" : "light"} mode</span>
      </VisuallyHidden>
    </Switch>
  );
};
