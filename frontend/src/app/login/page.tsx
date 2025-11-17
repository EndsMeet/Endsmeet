"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postJson, setToken } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    try {
      const data = await postJson<{ access_token: string }>("/auth/login", {
        email,
        password,
      });

      setToken(data.access_token);
      router.replace("/onboarding");
    } catch (e: any) {
      setErr(e?.message || "Inloggen mislukt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="w-full max-w-md px-4">
        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-zinc-200 bg-white px-8 py-7 shadow-sm"
        >
          <h1 className="text-2xl font-semibold text-zinc-900 mb-1">Log in</h1>
          <p className="text-sm text-zinc-500 mb-6">
            Log in om verder te gaan met je EndsMeet dashboard.
          </p>

          {/* E-mail */}
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-800 mb-1.5"
          >
            E-mail
          </label>
          <input
            id="email"
            type="email"
            className="
              w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5
              text-sm text-zinc-900 placeholder:text-zinc-500
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
              mb-4
            "
            placeholder="jij@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          {/* Wachtwoord */}
          <label
            htmlFor="password"
            className="block text-sm font-medium text-zinc-800 mb-1.5"
          >
            Wachtwoord
          </label>
          <input
            id="password"
            type="password"
            className="
              w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5
              text-sm text-zinc-900 placeholder:text-zinc-500
              focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
              mb-2
            "
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {/* Foutmelding */}
          {err && (
            <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 border border-red-200">
              {err}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              mt-2 w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium
              text-white shadow-sm
              hover:bg-zinc-900
              disabled:opacity-60 disabled:cursor-not-allowed
              transition-colors
            "
          >
            {loading ? "Bezig…" : "Inloggen"}
          </button>

          {/* Ondertekst */}
          <p className="mt-4 text-sm text-zinc-600">
            Nog geen account?{" "}
            <a
              className="font-medium text-emerald-600 hover:text-emerald-500 underline-offset-2 hover:underline"
              href="/signup"
            >
              Maak een account
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}