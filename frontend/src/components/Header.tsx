"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getToken, logout } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [tokenPresent, setTokenPresent] = useState(false);

  useEffect(() => {
    const token = getToken();
    setTokenPresent(!!token);
  }, []);

  function handleLogout() {
    logout();
    setTokenPresent(false);
    router.push("/login");
  }

  return (
    <header className="w-full border-b bg-white/70 backdrop-blur-lg sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between py-4 px-4">

        {/* LOGO */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          EndsMeet
        </Link>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-zinc-700 hover:text-black">
            Home
          </Link>

          <Link href="/dashboard" className="text-zinc-700 hover:text-black">
            Dashboard
          </Link>

          <Link href="/testers" className="text-zinc-700 hover:text-black">
            Testpanel
          </Link>

          {!tokenPresent && (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg border hover:bg-zinc-100"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg bg-black text-white"
              >
                Sign up
              </Link>
            </>
          )}

          {tokenPresent && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-white"
            >
              Log out
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}