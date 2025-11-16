"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postJson } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);

    if (password1 !== password2) {
      setErr("Wachtwoorden komen niet overeen.");
      return;
    }

    setLoading(true);
    try {
      await postJson("/auth/signup", { email, password: password1 });
      setOk("Account aangemaakt! Je wordt doorgestuurd…");
      setTimeout(() => router.replace("/login"), 800);
    } catch (e: any) {
      setErr(e?.message || "Registratie mislukt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={onSubmit}
        className="p-8 rounded-2xl border shadow-sm w-[420px] bg-white"
      >
        <h1 className="text-2xl font-semibold mb-1">Word tester van Ends Meet</h1>
<p className="text-sm text-zinc-600 mb-4">
  Je krijgt gratis toegang tot de testversie. In ruil vragen we je af en toe om feedback.
</p>

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
          placeholder="Min. 8 tekens"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          required
        />

        <label className="block text-sm font-medium mb-1">Herhaal wachtwoord</label>
        <input
          type="password"
          className="w-full mb-4 p-3 rounded-lg border bg-white"
          placeholder="Nogmaals"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />

        {err && <div className="mb-4 text-sm text-red-600">{err}</div>}
        {ok && <div className="mb-4 text-sm text-green-600">{ok}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-black text-white font-medium disabled:opacity-60"
        >
          {loading ? "Aanmaken…" : "Account aanmaken"}
        </button>

        <p className="text-sm text-zinc-600 mt-4">
          Heb je al een account?{" "}
          <a className="underline" href="/login">
            Log in
          </a>
        </p>
      </form>
    </main>
  );
}