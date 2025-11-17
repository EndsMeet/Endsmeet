// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, askCoach, previewImport } from "@/lib/api";

type OnboardingData = {
  name?: string;
  goal?: string;
  timeframe?: string;
  situation?: string;
  priority?: string;
  // Optioneel – als je later bedragen toevoegt aan onboarding
  income?: number;
  expenses?: number;
  free_to_play?: number;
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

  // Coach – vrije vraag
  const [coachQuestion, setCoachQuestion] = useState("");
  const [coachAnswer, setCoachAnswer] = useState<string | null>(null);
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachError, setCoachError] = useState<string | null>(null);

  // Upload / preview
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<ImportPreview | null>(null);

  // Coach-advies op basis van import-data
  const [adviceFromImport, setAdviceFromImport] = useState<string | null>(null);
  const [adviceFromImportLoading, setAdviceFromImportLoading] = useState(false);
  const [adviceFromImportError, setAdviceFromImportError] =
    useState<string | null>(null);

  // ----------------- INIT -----------------
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
        <p className="text-zinc-500">Je wordt doorgestuurd naar de login…</p>
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

  // Handige display-waarden
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

  // ----------------- COACH: VRIJE VRAAG -----------------
  async function handleAskCoach() {
    setCoachError(null);
    setCoachAnswer(null);

    if (!coachQuestion.trim()) {
      setCoachError("Stel eerst een vraag aan je coach.");
      return;
    }

    try {
      setCoachLoading(true);
      const answer = await askCoach(
        coachQuestion.trim(),
        onboarding ?? undefined,
      );
      setCoachAnswer(answer);
    } catch (err: any) {
      console.error(err);
      setCoachError(
        err?.message || "Er ging iets mis bij het ophalen van het antwoord.",
      );
    } finally {
      setCoachLoading(false);
    }
  }

  // ----------------- UPLOAD / PREVIEW -----------------
  async function handlePreviewImport() {
    setImportError(null);
    setImportPreview(null);
    setAdviceFromImport(null);
    setAdviceFromImportError(null);

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
        err?.message || "Kon de preview van de import niet ophalen.",
      );
    } finally {
      setImportLoading(false);
    }
  }

  // ----------------- COACH: OP BASIS VAN IMPORT -----------------
  async function handleAskCoachFromImport() {
    if (!importPreview) {
      setAdviceFromImportError(
        "Upload en analyseer eerst een bestand voordat je advies vraagt.",
      );
      return;
    }

    try {
      setAdviceFromImportError(null);
      setAdviceFromImport(null);
      setAdviceFromImportLoading(true);

      const topCats = importPreview.by_category
        .slice()
        .sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
        .slice(0, 5);

      const question = `
Je bent een nuchtere Nederlandse geldcoach.
De gebruiker heeft net een bankbestand geüpload. Hier is een samenvatting:

- Totaal inkomen per periode: ${importPreview.total_income.toFixed(
        0,
      )} ${importPreview.currency}
- Totaal uitgaven per periode: ${importPreview.total_expense.toFixed(
        0,
      )} ${importPreview.currency}
- Netto resultaat: ${importPreview.net.toFixed(0)} ${importPreview.currency}

Top categorieën (bedragen kunnen negatief zijn bij uitgaven):
${topCats
  .map(
    (c) =>
      `- ${c.category}: ${c.total.toFixed(0)} ${importPreview.currency}`,
  )
  .join("\n")}

Geef in maximaal 5 concrete bullets:
- waar iemand waarschijnlijk het makkelijkst kan snijden zonder dat het leven "kut" wordt
- wat een realistisch maandelijks vrij te spelen bedrag is op basis van dit patroon
- en 1 suggestie wat iemand met dat vrijgespeelde bedrag kan doen (buffer, schulden aflossen, simpel beleggen).

Gebruik "je"-vorm, vriendelijk en praktisch. Geen disclaimers, geen ingewikkelde beleggingsproducten, geen beloften over rijk worden.
`.trim();

      const onboardingData = onboarding ?? null;
      const answer = await askCoach(question, onboardingData);
      setAdviceFromImport(answer);
    } catch (err: any) {
      console.error(err);
      setAdviceFromImportError(
        err?.message ?? "Kon geen advies ophalen van de coach.",
      );
    } finally {
      setAdviceFromImportLoading(false);
    }
  }

  // Kleine helper: simpele horizontale bar (voor “grafieken”)
  function Bar({
    value,
    max,
    positive,
  }: {
    value: number;
    max: number;
    positive?: boolean;
  }) {
    const pct = max > 0 ? (Math.abs(value) / max) * 100 : 0;
    return (
      <div className="flex-1 h-2 rounded-full bg-zinc-900 overflow-hidden">
        <div
          className={`h-full ${
            positive ?? value >= 0 ? "bg-emerald-500" : "bg-rose-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    );
  }

  // ----------------- RENDER -----------------
  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100">
      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Titel */}
        <h1 className="text-3xl font-semibold">
          Dashboard
          {displayName ? (
            <span className="text-zinc-500 text-lg font-normal">
              {" "}
              – welkom terug, {displayName}
            </span>
          ) : null}
        </h1>

        {/* BOVENSTE RIJ: COACH + TECH INFO */}
        <div className="grid md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-5">
          {/* AI Assistent */}
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
                We gebruiken jouw antwoorden om je te coachen richting meer
                grip op je geld. Hoe meer je invult, hoe slimmer de
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
                  Stel een vraag hierboven om een persoonlijk antwoord te
                  krijgen.
                </p>
              )}
            </div>
          </section>

          {/* Technische info + mini-grafieken */}
          <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-lg shadow-black/40">
            <h2 className="text-lg font-semibold mb-1">Technische info</h2>
            <p className="text-xs text-zinc-500 mb-4">
              Een snelle indruk van inkomen, uitgaven en de speelruimte die je
              (straks) vrijspeelt.
            </p>

            <div className="space-y-4 text-sm">
              {/* Tegel 1: inkomen vs uitgaven */}
              <div className="rounded-xl bg-zinc-900 p-3 border border-zinc-800">
                <div className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
                  Inkomen vs uitgaven (onboarding / upload)
                </div>
                {importPreview ? (
                  <>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-20 text-xs text-zinc-400">
                        Inkomen
                      </span>
                      <Bar
                        value={importPreview.total_income}
                        max={Math.max(
                          Math.abs(importPreview.total_income),
                          Math.abs(importPreview.total_expense),
                        )}
                        positive
                      />
                      <span className="w-16 text-right text-xs">
                        {importPreview.total_income.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-xs text-zinc-400">
                        Uitgaven
                      </span>
                      <Bar
                        value={importPreview.total_expense}
                        max={Math.max(
                          Math.abs(importPreview.total_income),
                          Math.abs(importPreview.total_expense),
                        )}
                      />
                      <span className="w-16 text-right text-xs">
                        {importPreview.total_expense.toFixed(0)}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-zinc-500">
                    Upload een bestand hieronder om een eerste vergelijking te
                    zien.
                  </p>
                )}
              </div>

              {/* Tegel 2: vrij te spelen */}
              <div className="rounded-xl bg-zinc-900 p-3 border border-zinc-800">
                <div className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
                  Vrij te spelen bedrag (schatting)
                </div>
                {importPreview ? (
                  <>
                    <p className="text-xs text-zinc-400 mb-1">
                      Netto per periode op basis van je upload:
                    </p>
                    <div className="flex items-center gap-2">
                      <Bar
                        value={importPreview.net}
                        max={Math.max(
                          Math.abs(importPreview.net),
                          Math.abs(importPreview.total_income),
                          Math.abs(importPreview.total_expense),
                        )}
                        positive={importPreview.net >= 0}
                      />
                      <span
                        className={`w-20 text-right text-xs font-semibold ${
                          importPreview.net >= 0
                            ? "text-emerald-400"
                            : "text-rose-400"
                        }`}
                      >
                        {importPreview.net.toFixed(0)}{" "}
                        {importPreview.currency}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-zinc-500">
                    Na een eerste upload laten we hier zien hoeveel er grofweg
                    overblijft.
                  </p>
                )}
              </div>

              {/* Tegel 3: maandoverzicht */}
              <div className="rounded-xl bg-zinc-900 p-3 border border-zinc-800">
                <div className="text-xs uppercase tracking-wide text-zinc-500 mb-2">
                  Maandoverzicht
                </div>
                {importPreview && importPreview.by_month.length > 0 ? (
                  <div className="space-y-1.5 text-xs text-zinc-200 max-h-40 overflow-y-auto pr-1">
                    {(() => {
                      const maxAbs =
                        Math.max(
                          ...importPreview.by_month.map((m) =>
                            Math.abs(m.total || 0),
                          ),
                        ) || 1;

                      return importPreview.by_month.map((m) => (
                        <div key={m.month} className="flex items-center gap-2">
                          <span className="w-16 text-zinc-400">
                            {m.month}
                          </span>
                          <Bar value={m.total} max={maxAbs} />
                          <span className="w-16 text-right">
                            {m.total.toFixed(0)}
                          </span>
                        </div>
                      ));
                    })()}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">
                    Zodra we genoeg maanden herkennen in je bestand, verschijnt
                    hier een simpel verloop.
                  </p>
                )}
              </div>
            </div>

            {/* Token-info */}
            <div className="mt-4 pt-3 border-t border-zinc-800">
              <p className="text-xs text-zinc-500 mb-2">
                Je bent ingelogd met een geldige access token.
              </p>
              <button
                onClick={() => setShowRawToken((v) => !v)}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 underline"
              >
                {showRawToken
                  ? "Verberg ruwe access token"
                  : "Toon ruwe access token"}
              </button>
              {showRawToken && (
                <pre className="mt-2 p-2 rounded-lg bg-zinc-900 text-[10px] text-zinc-100 overflow-x-auto border border-zinc-800">
                  {getToken() ?? "Geen token gevonden"}
                </pre>
              )}
            </div>
          </section>
        </div>

        {/* ONDERSTE RIJ CARDS */}
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

        {/* UITGAVEN-RADAR + COACH OP BASIS VAN DATA */}
        <section className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-lg shadow-black/40">
          <h2 className="text-lg font-semibold mb-1">
            Uitgaven-radar (upload je transacties)
          </h2>
          <p className="text-sm text-zinc-400 mb-3">
            Laad een CSV of Excel met minimaal een kolom <code>amount</code>.
            Optioneel: <code>date</code> en <code>category</code>. We maken een
            snelle scan van je inkomsten en uitgaven.
          </p>

          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
            <input
              type="file"
              accept=".csv,.xls,.xlsx"
              onChange={(e) => {
                setImportError(null);
                setImportPreview(null);
                setAdviceFromImport(null);
                setAdviceFromImportError(null);
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
            <div className="mt-4 space-y-5 text-sm">
              {/* Samenvatting */}
              <div className="grid md:grid-cols-3 gap-4">
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

                {/* Per categorie – diagram */}
                <div>
                  <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
                    Per categorie (diagram)
                  </div>
                  {importPreview.by_category.length === 0 ? (
                    <p className="text-xs text-zinc-500">
                      Geen categorieën in het bestand gevonden.
                    </p>
                  ) : (
                    <div className="space-y-1.5 text-xs text-zinc-200">
                      {(() => {
                        const maxAbs =
                          Math.max(
                            ...importPreview.by_category.map((c) =>
                              Math.abs(c.total || 0),
                            ),
                          ) || 1;

                        return importPreview.by_category.map((c) => (
                          <div
                            key={c.category}
                            className="flex items-center gap-2"
                          >
                            <span className="w-24 truncate text-[11px] text-zinc-400">
                              {c.category}
                            </span>
                            <Bar value={c.total} max={maxAbs} />
                            <span className="w-16 text-right text-[11px]">
                              {c.total.toFixed(0)}
                            </span>
                          </div>
                        ));
                      })()}
                    </div>
                  )}
                </div>

                {/* Per maand – diagram */}
                <div>
                  <div className="text-xs uppercase tracking-wide text-zinc-500 mb-1">
                    Per maand (diagram)
                  </div>
                  {importPreview.by_month.length === 0 ? (
                    <p className="text-xs text-zinc-500">
                      Geen datumkolom herkend.
                    </p>
                  ) : (
                    <div className="space-y-1.5 text-xs text-zinc-200">
                      {(() => {
                        const maxAbs =
                          Math.max(
                            ...importPreview.by_month.map((m) =>
                              Math.abs(m.total || 0),
                            ),
                          ) || 1;

                        return importPreview.by_month.map((m) => (
                          <div
                            key={m.month}
                            className="flex items-center gap-2"
                          >
                            <span className="w-20 text-[11px] text-zinc-400">
                              {m.month}
                            </span>
                              <Bar value={m.total} max={maxAbs} />
                            <span className="w-16 text-right text-[11px]">
                              {m.total.toFixed(0)}
                            </span>
                          </div>
                        ));
                      })()}
                    </div>
                  )}
                </div>
              </div>

              {/* Coach-advies op basis van data */}
              <div className="border-t border-zinc-800 pt-4 mt-2">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="text-xs text-zinc-400">
                    Laat de coach meekijken naar deze cijfers en krijg concrete
                    bespaar- en herverdeel-ideeën.
                  </div>
                  <button
                    type="button"
                    disabled={adviceFromImportLoading}
                    onClick={handleAskCoachFromImport}
                    className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-black hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {adviceFromImportLoading
                      ? "Coach kijkt naar je data…"
                      : "Vraag advies op basis van deze data"}
                  </button>
                </div>

                {adviceFromImportError && (
                  <p className="mt-2 text-xs text-rose-400">
                    {adviceFromImportError}
                  </p>
                )}

                {adviceFromImport && (
                  <div className="mt-3 rounded-xl bg-emerald-50/5 border border-emerald-500/30 p-3 text-xs text-emerald-100 whitespace-pre-line">
                    {adviceFromImport}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}