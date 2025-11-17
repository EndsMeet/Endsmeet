"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken, logout } from "@/lib/api";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = getToken();
    setHasToken(!!token);
  }, []);

  function handleLogout() {
    logout();
    setHasToken(false);
    router.push("/login");
  }

  const linkBase =
    "text-sm px-3 py-2 rounded-full transition-colors";
  const linkInactive =
    "text-zinc-300 hover:text-white hover:bg-zinc-800/60";
  const linkActive = "text-white bg-zinc-800";

  function navClass(href: string) {
    const isActive =
      href === "/"
        ? pathname === "/"
        : pathname?.startsWith(href);
    return `${linkBase} ${isActive ? linkActive : linkInactive}`;
  }

  return (
    <header className="w-full border-b border-zinc-800 bg-[#050505]/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-black text-sm font-semibold">
            EM
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-white">
              EndsMeet
            </span>
            <span className="text-[11px] text-zinc-500">
              Slimmer met je geld
            </span>
          </div>
        </Link>

        {/* Navigatie */}
        <nav className="flex items-center gap-2">
          <Link href="/" className={navClass("/")}>
            Home
          </Link>
          <Link href="/dashboard" className={navClass("/dashboard")}>
            Dashboard
          </Link>
          <Link href="/testers" className={navClass("/testers")}>
            Testpanel
          </Link>

          {!hasToken && (
            <>
              <Link
                href="/login"
                className={`${linkBase} ${linkInactive}`}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-sm px-4 py-2 rounded-full bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}

          {hasToken && (
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-2 rounded-full bg-zinc-200 text-black font-medium hover:bg-zinc-100 transition-colors"
            >
              Log out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}