// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, logout, askCoach, previewImport } from "@/lib/api";

type OnboardingData = {
  name?: string;
  goal?: string;
  timeframe?: string;
  situation?: string;
  priority?: string;
};

function loadOnboardingFromLocalStorage(): OnboardingData | null {
  if (typeof window === "undefined") return null;

  const possibleKeys = ["endsmeet_onboarding", "onboarding", "onboarding_v1"];

  for (const key of possibleKeys) {
    const raw = window.localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed as OnboardingData;
      }
    } catch {
      // volgende key proberen
    }
  }

  return null;
}

type ImportPreview = {
  row_count: number;
  total_income: number;
  total_expense: number;
  net: number;
  currency: string;
  by_category: { category: string; total: number }[];
  by_month: { month: string; total: number }[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [showRawToken, setShowRawToken] = useState(false);
  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);

  // Coach state
  const [coachQuestion, setCoachQuestion] = useState("");
  const [coachAnswer, setCoachAnswer] = useState<string | null>(null);
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState<string | null>(null);

  // Import/preview state
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setHasToken(false);
      router.replace("/login");
      return;
    }

    setHasToken(true);
    const ob = loadOnboardingFromLocalStorage();
    setOnboarding(ob || null);
  }, [router]);

  if (hasToken === false) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-zinc-200">
        <p className="text-zinc-500">
          Je wordt doorgestuurd naar de login…
        </p>
      </main>
    );
  }

  if (hasToken === null) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-zinc-200">
        <p className="text-zinc-500">Laden…</p>
      </main>
    );
  }

  const displayName =
    onboarding?.name && onboarding.name.trim().length > 0
      ? onboarding.name.trim()
      : null;

  const displayGoal =
    onboarding?.goal && onboarding.goal.trim().length > 0
      ? onboarding.goal.trim()
      : null;

  const displayTimeframe =
    onboarding?.timeframe && onboarding.timeframe.trim().length > 0
      ? onboarding.timeframe.trim()
      : null;

  const displayPriority =
    onboarding?.priority && onboarding.priority.trim().length > 0
      ? onboarding.priority.trim()
      : null;

  async function handleAskCoach() {
    setCoachError(null);
    setCoachAnswer(null);

    if (!coachQuestion.trim()) {
      setCoachError("Stel eerst een vraag aan je coach.");
      return;
    }

    try {
      setCoachLoading(true);
      const answer = await askCoach(coachQuestion.trim(), onboarding ?? undefined);
      setCoachAnswer(answer);
    } catch (err: any) {
      console.error(err);
      setCoachError(err.message || "Er ging iets mis bij het ophalen van het antwoord.");
    } finally {
      setCoachLoading(false);
    }
  }

  async function handlePreviewImport() {
    setImportError(null);
    setImportPreview(null);

    if (!importFile) {
      setImportError("Kies eerst een bestand (CSV of Excel).");
      return;
    }

    try {
      setImportLoading(true);
      const preview = await previewImport(importFile);
      setImportPreview(preview);
    } catch (err: any) {
      console.error(err);
      setImportError(
        err.message || "Kon de preview van de import niet ophalen.",
      );
    } finally {
      setImportLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100">
      {/* Top bar */}
      <header className="border-b border-zinc-800 bg-[#050505]/90 backdrop-blur">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-zinc-100 text-black flex items-center justify-center text-sm font-semibold">
              EM
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">EndsMeet</div>
              <div className="text-xs text-zinc-500">
                Eerste versie – persoonlijke money coach
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              router.replace("/login");
            }}
            className="text-xs border border-zinc-700 px-3 py-1.5 rounded-full hover:bg-zinc-900 transition"
          >
            Log uit
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6">
          Dashboard
          {displayName ? (
            <span className="text-zinc-500 text-lg font-normal">
              {" "}
              – welkom terug, {displayName}
            </span>
          ) : null}
        </h1>

        <div className="grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-5 mb-6">
          {/* AI Assistent / persoonlijke coach */}
          <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-lg shadow-black/40">
            <h2 className="text-lg font-semibold mb-1">AI Assistent</h2>
            <p className="text-xs text-zinc-500 mb-4">
              Persoonlijke coach op basis van wat je in de onboarding hebt
              ingevuld.
            </p>

            {displayGoal ? (
              <div className="mb-3">
                <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
                  Jouw focus
                </div>
                <p className="text-sm">
                  Doel:{" "}
                  <span className="font-medium text-zinc-100">
                    {displayGoal}
                    {displayTimeframe ? ` (${displayTimeframe})` : ""}
                  </span>
                  .
                </p>
              </div>
            ) : (
              <p className="text-sm mb-3 text-zinc-300">
                We gebruiken jouw antwoorden om je te coachen richting
                financiële vrijheid. Hoe meer je invult, hoe slimmer de
                aanbevelingen worden.
              </p>
            )}

            {displayPriority ? (
              <div className="mb-3">
                <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
                  Waar letten we extra op?
                </div>
                <p className="text-sm text-zinc-200">{displayPriority}</p>
              </div>
            ) : null}

            {onboarding ? (
              <p className="text-xs text-emerald-500 mt-2 mb-4">
                ✅ Onboarding is opgeslagen. Je coach gebruikt dit als startpunt.
              </p>
            ) : (
              <p className="text-xs text-amber-500 mt-2 mb-4">
                ℹ️ Nog geen onboarding-data gevonden. Je kunt de onboarding
                opnieuw doorlopen via de homepage.
              </p>
            )}

            {/* Coach vraagveld */}
            <div className="mt-4">
              <div className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
                Stel een vraag aan je coach
              </div>
              <textarea
                className="w-full rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 min-h-[60px]"
                placeholder="Bijvoorbeeld: Hoe kan ik de komende 6 maanden €200 per maand vrijmaken?"
                value={coachQuestion}
                onChange={(e) => setCoachQuestion(e.target.value)}
              />

              {coachError && (
                <p className="text-xs text-rose-400 mt-2">{coachError}</p>
              )}

              <div className="flex items-center justify-between mt-3">
                <button
                  onClick={handleAskCoach}
                  disabled={coachLoading}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 text-xs font-medium text-black hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {coachLoading ? "Coach denkt na…" : "Vraag je coach"}
                </button>
                <p className="text-[11px] text-zinc-500">
                  De coach geeft geen beleggings- of fiscaal advies.
                </p>
              </div>
            </div>

            {/* Coach antwoord */}
            <div className="mt-5 border-t border-zinc-800 pt-4">
              <div className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
                Antwoord van je coach
              </div>
              {coachAnswer ? (
                <div className="text-sm text-zinc-100 whitespace-pre-line leading-relaxed">
                  {coachAnswer}
                </div>
              ) : (
                <p className="text-sm text-zinc-500">
                  Stel een vraag hierboven om een persoonlijk antwoord te krijgen.
                </p>
              )}
            </div>
          </section>

          {/* Technische info */}
          <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-lg shadow-black/40">
            <h2 className="text-lg font-semibold mb-1">Technische info</h2>
            <p className="text-sm text-zinc-400 mb-3">
              Je bent ingelogd met een geldige access token.
            </p>
            <button
              onClick={() => setShowRawToken((v) => !v)}
              className="text-xs text-emerald-400 hover:text-emerald-300 underline"
            >
              {showRawToken ? "Verberg access token" : "Toon ruwe access token"}
            </button>
            {showRawToken && (
              <pre className="mt-3 p-3 rounded-lg bg-zinc-900 text-[10px] text-zinc-100 overflow-x-auto border border-zinc-800">
                {getToken() ?? "Geen token gevonden"}
              </pre>
            )}
          </section>
        </div>

        {/* Onderste rij cards */}
        <div className="grid md:grid-cols-3 gap-5">
          <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-lg shadow-black/40">
            <h3 className="text-sm font-semibold mb-1">Bekijk transacties</h3>
            <p className="text-sm text-zinc-400">
              Later: bankkoppeling & categorieën. Voor nu focussen we op je
              verhaal en doelen.
            </p>
          </section>

          <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-lg shadow-black/40">
            <h3 className="text-sm font-semibold mb-1">Inzichten</h3>
            <p className="text-sm text-zinc-400">
              Straks zie je hier inzichten op basis van je vaste lasten,
              uitgavenpatronen en de doelen uit je onboarding.
            </p>
          </section>

          <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-lg shadow-black/40">
            <h3 className="text-sm font-semibold mb-2">Testpanel</h3>
            <p className="text-sm text-zinc-400 mb-2">
              Deze versie is alleen voor testers. Jouw feedback bepaalt hoe
              EndsMeet verder wordt gebouwd.
            </p>
            <a
              href="/testers"
              className="text-xs text-emerald-400 hover:text-emerald-300 underline"
            >
              Geef feedback &amp; word mede-bouwer
            </a>
          </section>
        </div>

        {/* Upload & preview kaart */}
        <div className="mt-8">
          <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-lg shadow-black/40">
            <h2 className="text-lg font-semibold mb-1">
              Upload je transacties (experiment)
            </h2>
            <p className="text-sm text-zinc-400 mb-3">
              Laad een CSV of Excel met minimaal een kolom <code>amount</code>.
              Optioneel: <code>date</code> en <code>category</code>.
            </p>

            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
              <input
                type="file"
                accept=".csv,.xls,.xlsx"
                onChange={(e) => {
                  setImportError(null);
                  setImportPreview(null);
                  setImportFile(e.target.files?.[0] ?? null);
                }}
                className="text-sm text-zinc-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-zinc-800 file:text-xs file:text-zinc-100 hover:file:bg-zinc-700"
              />
              <button
                onClick={handlePreviewImport}
                disabled={importLoading || !importFile}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-xs font-medium text-black hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {importLoading ? "Analyseren…" : "Analyseer bestand"}
              </button>
            </div>

            {importError && (
              <p className="text-xs text-rose-400 mb-3">{importError}</p>
            )}

            {importPreview && (
              <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
                    Samenvatting
                  </div>
                  <p className="text-zinc-200">
                    Rijen:{" "}
                    <span className="font-semibold">
                      {importPreview.row_count}
                    </span>
                  </p>
                  <p className="text-emerald-400">
                    Inkomens:{" "}
                    <span className="font-semibold">
                      {importPreview.total_income.toFixed(2)}{" "}
                      {importPreview.currency}
                    </span>
                  </p>
                  <p className="text-rose-400">
                    Uitgaven:{" "}
                    <span className="font-semibold">
                      {importPreview.total_expense.toFixed(2)}{" "}
                      {importPreview.currency}
                    </span>
                  </p>
                  <p className="text-zinc-200 mt-1">
                    Netto:{" "}
                    <span
                      className={
                        importPreview.net >= 0
                          ? "text-emerald-400 font-semibold"
                          : "text-rose-400 font-semibold"
                      }
                    >
                      {importPreview.net.toFixed(2)} {importPreview.currency}
                    </span>
                  </p>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
                    Per categorie
                  </div>
                  {importPreview.by_category.length === 0 ? (
                    <p className="text-xs text-zinc-500">
                      Geen categorieën in het bestand gevonden.
                    </p>
                  ) : (
                    <ul className="space-y-1 text-xs text-zinc-200">
                      {importPreview.by_category.map((c) => (
                        <li key={c.category} className="flex justify-between">
                          <span>{c.category}</span>
                          <span
                            className={
                              c.total >= 0 ? "text-emerald-400" : "text-rose-400"
                            }
                          >
                            {c.total.toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
                    Per maand
                  </div>
                  {importPreview.by_month.length === 0 ? (
                    <p className="text-xs text-zinc-500">
                      Geen datumkolom herkend.
                    </p>
                  ) : (
                    <ul className="space-y-1 text-xs text-zinc-200">
                      {importPreview.by_month.map((m) => (
                        <li key={m.month} className="flex justify-between">
                          <span>{m.month}</span>
                          <span
                            className={
                              m.total >= 0 ? "text-emerald-400" : "text-rose-400"
                            }
                          >
                            {m.total.toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}