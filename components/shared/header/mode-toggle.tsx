"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
//use client to use hooks and anything that is dynamic

const ModeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // * During SSR, next-themes doesn't know what the theme to use is, so it uses the default (usually system). However, when the client is rendered after, it may cause a mismatch in hydration because the actual theme may be dark. Some icons, styles, components, may change depending on the theme, so it causes a mismatch in the hydration.

  // * useEffect helps fix this by making sure that the client only runs after hydration, so no mismatch occurs.
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            className="focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            {theme === "system" ? (
              <SunMoon />
            ) : theme === "dark" ? (
              <MoonIcon />
            ) : (
              <SunIcon />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={theme === "system"}
            onClick={() => setTheme("system")}
          >
            System
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem
            checked={theme === "light"}
            onClick={() => setTheme("light")}
          >
            Light
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem
            checked={theme === "dark"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ModeToggle;
