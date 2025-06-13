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

  if (!isMounted) return <div className="w-6 h-6" />;

  return (
    <Switch
      classNames={{
        base: clsx(
          "px-0 gap-2 !bg-transparent hover:!bg-transparent",
          className,
          classNames?.base
        ),
        wrapper: clsx(
          "p-0 h-4 overflow-visible",
          "bg-transparent hover:bg-transparent",
          "group-data-[selected=true]:bg-transparent",
          {
            "justify-start": theme === "light",
            "justify-end": theme === "dark",
          },
          classNames?.wrapper
        ),
        thumb: clsx(
          "w-6 h-6 border-2 shadow-lg",
          "group-data-[selected=true]:ml-6",
          {
            "bg-yellow-300 border-yellow-400": theme === "light",
            "bg-slate-900 border-slate-800": theme === "dark",
          },
          classNames?.thumb
        ),
      }}
      size="lg"
      thumbIcon={({ isSelected, className }) =>
        isSelected ? (
          <MoonFilledIcon className={className} />
        ) : (
          <SunFilledIcon className={className} />
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
