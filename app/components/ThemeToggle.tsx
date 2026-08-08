"use client";

import React, { useEffect, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";
import { MdComputer } from "react-icons/md";

type Theme = "dark" | "light" | "system";

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "system";
  }

  const savedTheme = localStorage.getItem("theme");

  if (
    savedTheme === "light" ||
    savedTheme === "dark" ||
    savedTheme === "system"
  ) {
    return savedTheme;
  }

  return "system";
};

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  /*
   * Apply theme to the <html> element
   */
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;

      if (systemDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  /*
   * Listen for system theme changes
   */
  useEffect(() => {
    if (theme !== "system") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = () => {
      const root = document.documentElement;

      if (mediaQuery.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [theme]);

  /*
   * Light → Dark → System → Light
   */
  const handleToggle = () => {
    setTheme((currentTheme) => {
      switch (currentTheme) {
        case "light":
          return "dark";

        case "dark":
          return "system";

        case "system":
          return "light";

        default:
          return "system";
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        bg-gray-100
        text-gray-800
        transition-all
        duration-300
        hover:scale-105
        hover:bg-gray-200
        active:scale-95
        dark:bg-gray-800
        dark:text-white
        dark:hover:bg-gray-700
      "
      aria-label={`Current theme: ${theme}. Click to change theme.`}
      title={`Theme: ${theme}`}
    >
      {theme === "light" && <BsSunFill size={19} />}

      {theme === "dark" && <FaMoon size={18} />}

      {theme === "system" && <MdComputer size={21} />}
    </button>
  );
};

export default ThemeToggle;
