"use client";

import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <HeroUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "hsl(var(--nextui-background))",
                color: "hsl(var(--nextui-foreground))",
                border: "1px solid hsl(var(--nextui-divider))",
              },
            }}
          />
        </NextThemesProvider>
      </HeroUIProvider>
    </SessionProvider>
  );
}
