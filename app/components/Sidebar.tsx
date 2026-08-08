"use client";

import Link from "next/link";
import ThemeToggle from "../template/ThemeToggle";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, UserRoundPen } from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Register", icon: UserRoundPen, href: "/register" },
  { label: "Login", icon: UserRoundPen, href: "/login" },
  { label: "Song Upload", icon: PlusCircle, href: "/songs/new" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col justify-between">
      {/* Top Section: Brand & Nav */}
      <div className="flex flex-col gap-6">
        {/* Brand Logo */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
              B
            </div>
            <span className="text-lg font-bold tracking-tight dark:text-white/80 text-black">
              Backend
            </span>
          </div>
          <div className="px-2 pt-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-black dark:text-white dark:hover:text-white/70 hover:text-black hover:bg-slate-800/10 dark:hover:bg-indigo-600/20"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section (Optional: User profile / Footer) */}
      <div className="border-t border-slate-800/80 pt-4 px-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-700" />
          <div className="flex flex-col">
            <span className="text-xs font-medium dark:text-white text-black">
              Bigweb Developer
            </span>
            <span className="text-[10px] text-slate-400">
              bigweb.developer@gmail.com
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
