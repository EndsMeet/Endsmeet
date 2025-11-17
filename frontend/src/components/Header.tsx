"use client";

import { useEffect, useState } from "react";
import {
  getToken,
  askCoach,
  previewImport,
} from "@/lib/api";

export default function DashboardPage() {
  const [displayName, setDisplayName] = useState<string | null>(null);

  const [coachInput, setCoachInput] = useState("");
  const [coachResponse, setCoachResponse] = useState<string | null>(null);
  const [coachLoading, setCoachLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // ------------------------------------------------------------
  // FETCH USER NAME (DISPLAY)
  // ------------------------------------------------------------
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setDisplayName(payload?.email ?? null);
    } catch (_) {
      setDisplayName(null);
    }
  }, []);

  // ------------------------------------------------------------
  // AI COACH REQUEST
  // ------------------------------------------------------------
  async function handleCoachAsk() {
    if (!coachInput.trim()) return;
    setCoachLoading(true);
    setCoachResponse(null);

    try {
      const res = await askCoach(coachInput);
      setCoachResponse(res?.reply ?? "Geen antwoord ontvangen.");
    } catch (e: any) {
      setCoachResponse("De AI-coach is op dit moment niet beschikbaar.");
    } finally {
      setCoachLoading(false);
    }
  }

  // ------------------------------------------------------------
  // FILE PREVIEW
  // ------------------------------------------------------------
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(null);
    setPreviewError(null);
  }

  async function handleAnalyzeFile() {
    if (!file) return;

    setPreviewLoading(true);
    setPreview(null);
    setPreviewError(null);

    try {
      const result = await previewImport(file);
      setPreview(result);
    } catch (e: any) {
      setPreviewError(e?.message ?? "Fout bij het analyseren van het bestand.");
    } finally {
      setPreviewLoading(false);
    }
  }

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------
  return (
    <main className="min-h-screen bg-[#050505] text-zinc-100 pt-6">
      <div className="max-w-5xl mx-auto px-4 pb-20">
        {/* --------------------------------------------------------
            PAGE TITLE
        --------------------------------------------------------- */}
        <h1 className="text-3xl font-semibold mb-6">
          Dashboard{" "}
          {displayName && (
            <span className="text-zinc-500 text-lg font-normal">
              – welkom terug, {displayName}
            </span>
          )}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* --------------------------------------------------------
              AI COACH
          --------------------------------------------------------- */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-medium mb-4">AI Assistent</h2>
            <p className="text-sm text-zinc-400 mb-4">
              Stel een vraag aan je persoonlijke coach.
            </p>

            <textarea
              value={coachInput}
              onChange={(e) => setCoachInput(e.target.value)}
              placeholder="Bijv. hoe kan ik 200 euro per maand besparen?"
              className="w-full h-28 p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-sm"
            />

            <button
              onClick={handleCoachAsk}
              disabled={coachLoading}
              className="mt-3 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
            >
              {coachLoading ? "Bezig…" : "Vraag advies"}
            </button>

            {coachResponse && (
              <div className="mt-4 p-4 rounded-lg bg-zinc-800 border border-zinc-700 text-sm whitespace-pre-line">
                {coachResponse}
              </div>
            )}
          </section>

          {/* --------------------------------------------------------
              TRANSACTION UPLOAD
          --------------------------------------------------------- */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h2 className="text-xl font-medium mb-4">Uitgaven-radar</h2>
            <p className="text-sm text-zinc-400 mb-4">
              Upload een CSV of Excel-bestand om snel inzicht te krijgen in je uitgaven.
            </p>

            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="block w-full mb-3 text-sm text-zinc-300"
            />

            <button
              onClick={handleAnalyzeFile}
              disabled={!file || previewLoading}
              className="mt-1 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
            >
              {previewLoading ? "Analyseren…" : "Analyseer bestand"}
            </button>

            {previewError && (
              <div className="mt-3 p-3 bg-red-900/40 border border-red-800 rounded-md text-sm text-red-300">
                {previewError}
              </div>
            )}

            {preview && (
              <div className="mt-4 p-4 bg-zinc-800 border border-zinc-700 rounded-xl text-sm">
                <h3 className="text-lg font-semibold mb-2">Samenvatting</h3>

                <p>Rijen: {preview.rows}</p>
                <p>Inkomen: €{preview.income}</p>
                <p>Uitgaven: €{preview.expenses}</p>
                <p className="font-semibold mt-2">
                  Netto: €{preview.net}
                </p>

                {preview.chartData && (
                  <pre className="mt-4 text-xs text-zinc-400 overflow-auto">
                    {JSON.stringify(preview.chartData, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}