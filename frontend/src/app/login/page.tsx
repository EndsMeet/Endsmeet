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

      // ✅ token netjes opslaan via helper
      setToken(data.access_token);

      // ✅ na inloggen altijd naar onboarding
      router.replace("/onboarding");
    } catch (e: any) {
      setErr(e?.message || "Inloggen mislukt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50">
      <form
        onSubmit={onSubmit}
        className="p-8 rounded-2xl border shadow-sm w-[420px] bg-white"
      >
        <h1 className="text-2xl font-semibold mb-6">Log in</h1>

        <label className="block text-sm font-medium mb-1">E-mail</label>
        <input
          type="email"
          className="w-full mb-4 p-3 rounded-lg border bg-white"
          placeholder="jij@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block text-sm font-medium mb-1">Wachtwoord</label>
        <input
          type="password"
          className="w-full mb-4 p-3 rounded-lg border bg-white"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {err && <div className="mb-4 text-sm text-red-600">{err}</div>}

        <button
          disabled={loading}
          className="w-full py-3 rounded-lg bg-black text-white font-medium disabled:opacity-60"
        >
          {loading ? "Bezig…" : "Inloggen"}
        </button>

        <p className="text-sm text-zinc-600 mt-4">
          Nog geen account?{" "}
          <a className="underline" href="/signup">
            Maak een account
          </a>
        </p>
      </form>
    </main>
  );
}