"use client";

import { useEffect, useRef, useState } from "react";
import { FaMoon } from "react-icons/fa";
import { BsSunFill } from "react-icons/bs";
import { MdComputer } from "react-icons/md";

type Theme = "light" | "dark" | "system";

const ThemeToggle = () => {
  // IMPORTANT:
  // This must be the same during SSR and the first client render.
  const [theme, setTheme] = useState<Theme>("system");

  const [mounted, setMounted] = useState(false);

  // Keeps track of the selected theme without
  // causing state updates from inside effects.
  const themeRef = useRef<Theme>("system");

  /*
   * Apply the selected theme to <html>
   */
  const applyTheme = (selectedTheme: Theme) => {
    const root = document.documentElement;

    if (selectedTheme === "dark") {
      root.classList.add("dark");
      return;
    }

    if (selectedTheme === "light") {
      root.classList.remove("dark");
      return;
    }

    // SYSTEM
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    root.classList.toggle("dark", prefersDark);
  };

  /*
   * Mark the component as mounted.
   *
   * This is the ONLY setState call inside an effect.
   * It is used to prevent hydration mismatch.
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /*
   * Load the saved theme AFTER hydration.
   */
  useEffect(() => {
    if (!mounted) return;

    const savedTheme = localStorage.getItem("theme");

    let selectedTheme: Theme = "system";

    if (
      savedTheme === "light" ||
      savedTheme === "dark" ||
      savedTheme === "system"
    ) {
      selectedTheme = savedTheme;
    }

    // Update the ref, NOT React state.
    themeRef.current = selectedTheme;

    // Apply saved theme directly to the DOM.
    applyTheme(selectedTheme);
  }, [mounted]);

  /*
   * Watch for operating-system theme changes.
   *
   * This only matters when the user selected "system".
   */
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = () => {
      if (themeRef.current === "system") {
        applyTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [mounted]);

  /*
   * Theme cycle:
   *
   * Light → Dark → System → Light
   */
  const handleToggle = () => {
    const currentTheme = themeRef.current;

    let nextTheme: Theme;

    switch (currentTheme) {
      case "light":
        nextTheme = "dark";
        break;

      case "dark":
        nextTheme = "system";
        break;

      case "system":
      default:
        nextTheme = "light";
        break;
    }

    // Update ref
    themeRef.current = nextTheme;

    // This happens because of a user click,
    // so this is NOT the problematic effect setState.
    setTheme(nextTheme);

    // Save preference
    localStorage.setItem("theme", nextTheme);

    // Apply immediately
    applyTheme(nextTheme);
  };

  /*
   * IMPORTANT FOR HYDRATION
   *
   * Server:
   *   system button
   *
   * First client render:
   *   system button
   *
   * Therefore:
   *   NO hydration mismatch.
   */
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Theme"
        title="Theme"
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
          dark:bg-gray-800
          dark:text-white
        "
      >
        <MdComputer size={21} />
      </button>
    );
  }

  /*
   * Actual theme button
   */
  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Current theme: ${theme}. Click to change theme.`}
      title={`Theme: ${theme}`}
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
    >
      {theme === "light" && <BsSunFill size={19} />}

      {theme === "dark" && <FaMoon size={18} />}

      {theme === "system" && <MdComputer size={21} />}
    </button>
  );
};

export default ThemeToggle;
