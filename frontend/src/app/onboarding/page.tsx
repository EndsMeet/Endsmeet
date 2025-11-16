"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";

type GoalType = "buffer" | "schuldenvrij" | "financiele_vrijheid";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // onboarding state
  const [naam, setNaam] = useState("");
  const [situatie, setSituatie] = useState("");
  const [inkomenNetto, setInkomenNetto] = useState("");
  const [uitgavenNetto, setUitgavenNetto] = useState("");
  const [goal, setGoal] = useState<GoalType | null>(null);
  const [tijdHorizon, setTijdHorizon] = useState("5 jaar");
  const [comfortLevel, setComfortLevel] = useState("rustig en stabiel");

  // ✅ check: ingelogd? anders terug naar login
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  // ✅ probeer eerder ingevulde onboarding te laden (optioneel)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem("onboarding_v1");
    if (!raw) return;
    try {
      const saved = JSON.parse(raw);
      setNaam(saved.naam || "");
      setSituatie(saved.situatie || "");
      setInkomenNetto(saved.inkomenNetto || "");
      setUitgavenNetto(saved.uitgavenNetto || "");
      setGoal(saved.goal || null);
      setTijdHorizon(saved.tijdHorizon || "5 jaar");
      setComfortLevel(saved.comfortLevel || "rustig en stabiel");
    } catch {
      // boeit niet; dan gewoon leeg beginnen
    }
  }, []);

  function nextStep() {
    setStep((s) => Math.min(s + 1, 2));
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleFinish() {
    if (typeof window !== "undefined") {
      const data = {
        naam,
        situatie,
        inkomenNetto,
        uitgavenNetto,
        goal,
        tijdHorizon,
        comfortLevel,
        completedAt: new Date().toISOString(),
      };
      window.localStorage.setItem("onboarding_v1", JSON.stringify(data));
      window.localStorage.setItem("onboarding_done", "1");
    }

    // later: hier ook naar backend posten (/api/profile/onboarding)
    router.replace("/dashboard");
  }

  // ✅ bepalen of je door mag naar volgende stap
  const canNext =
    (step === 0 && naam.trim().length > 1) ||
    (step === 1 && inkomenNetto.trim() !== "" && uitgavenNetto.trim() !== "") ||
    (step === 2 && goal !== null);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#22c55e33,_transparent_55%),radial-gradient(circle_at_bottom,_#0ea5e933,_transparent_55%)]" />

      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        {/* top */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold tracking-tight">Ends Meet</div>
            <div className="text-xs text-zinc-400">
              Onboarding · richting financiële vrijheid
            </div>
          </div>
          <button
            onClick={() => router.replace("/dashboard")}
            className="text-xs text-zinc-400 underline hover:text-zinc-200"
          >
            Overslaan
          </button>
        </header>

        {/* wizard card */}
        <div className="mx-auto w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl backdrop-blur">
          {/* progress */}
          <div className="mb-4 flex items-center justify-between text-xs text-zinc-400">
            <span>Stap {step + 1} van 3</span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 w-6 rounded-full ${
                    i <= step ? "bg-emerald-400" : "bg-zinc-700"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* content per stap */}
          {step === 0 && (
            <div>
              <h1 className="text-xl font-semibold">
                Laten we elkaar eerst even leren kennen
              </h1>
              <p className="mt-2 text-sm text-zinc-300">
                Een paar korte vragen zodat je coach straks beter kan inschatten
                wat bij jouw leven en doelen past.
              </p>

              <div className="mt-6 space-y-4 text-sm">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">
                    Hoe mogen we je noemen?
                  </label>
                  <input
                    className="w-full rounded-lg border border-zinc-700 bg-black/60 p-3 text-sm text-white outline-none focus:border-emerald-400"
                    placeholder="Bijvoorbeeld: Sam"
                    value={naam}
                    onChange={(e) => setNaam(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">
                    Hoe ziet je huidige situatie er ongeveer uit?
                  </label>
                  <textarea
                    className="min-h-[80px] w-full rounded-lg border border-zinc-700 bg-black/60 p-3 text-sm text-white outline-none focus:border-emerald-400"
                    placeholder="Bijvoorbeeld: fulltime baan, huurhuis, wat studieschuld, wil meer ruimte en minder stress."
                    value={situatie}
                    onChange={(e) => setSituatie(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h1 className="text-xl font-semibold">Grof plaatje van je geld</h1>
              <p className="mt-2 text-sm text-zinc-300">
                Het hoeft niet exact te zijn. We gebruiken dit om te zien hoeveel
                ruimte er nu al ongeveer in je maand zit.
              </p>

              <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">
                    Netto inkomen per maand (totaal)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg border border-zinc-700 bg-black/60 px-3 py-2 text-xs text-zinc-400">
                      €
                    </span>
                    <input
                      className="flex-1 rounded-lg border border-zinc-700 bg-black/60 p-3 text-sm text-white outline-none focus:border-emerald-400"
                      placeholder="bijv. 3200"
                      value={inkomenNetto}
                      onChange={(e) => setInkomenNetto(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">
                    Totale uitgaven per maand (inschatting)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg border border-zinc-700 bg-black/60 px-3 py-2 text-xs text-zinc-400">
                      €
                    </span>
                    <input
                      className="flex-1 rounded-lg border border-zinc-700 bg-black/60 p-3 text-sm text-white outline-none focus:border-emerald-400"
                      placeholder="bijv. 2600"
                      value={uitgavenNetto}
                      onChange={(e) => setUitgavenNetto(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-zinc-400">
                Later kan Ends Meet dit automatisch verfijnen met echte
                transacties. Voor nu is een grove schatting genoeg om mee te
                coachen.
              </p>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-xl font-semibold">
                Wat betekent financiële vrijheid voor jou?
              </h1>
              <p className="mt-2 text-sm text-zinc-300">
                Kies wat het meest resoneert. Je kunt dit later altijd nog
                bijstellen.
              </p>

              <div className="mt-5 grid gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => setGoal("buffer")}
                  className={`rounded-2xl border p-3 text-left ${
                    goal === "buffer"
                      ? "border-emerald-400 bg-emerald-500/10"
                      : "border-zinc-700 bg-black/60 hover:border-zinc-500"
                  }`}
                >
                  <div className="text-sm font-semibold">
                    Een stevige buffer opbouwen
                  </div>
                  <div className="mt-1 text-xs text-zinc-400">
                    3–6 maanden kosten op de bank zodat onverwachte dingen geen
                    paniek meer geven.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setGoal("schuldenvrij")}
                  className={`rounded-2xl border p-3 text-left ${
                    goal === "schuldenvrij"
                      ? "border-emerald-400 bg-emerald-500/10"
                      : "border-zinc-700 bg-black/60 hover:border-zinc-500"
                  }`}
                >
                  <div className="text-sm font-semibold">
                    Schuldenvrij en meer ademruimte
                  </div>
                  <div className="mt-1 text-xs text-zinc-400">
                    Eerst weg bij roodstand / leningen / creditcards, dan rustig
                    vermogen opbouwen.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setGoal("financiele_vrijheid")}
                  className={`rounded-2xl border p-3 text-left ${
                    goal === "financiele_vrijheid"
                      ? "border-emerald-400 bg-emerald-500/10"
                      : "border-zinc-700 bg-black/60 hover:border-zinc-500"
                  }`}
                >
                  <div className="text-sm font-semibold">
                    Serieus bouwen richting financiële vrijheid
                  </div>
                  <div className="mt-1 text-xs text-zinc-400">
                    Elke maand een bedrag aan het werk zetten richting een
                    toekomst waarin je werk een keuze is, geen verplichting.
                  </div>
                </button>
              </div>

              <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">
                    Tijdshorizon
                  </label>
                  <select
                    className="w-full rounded-lg border border-zinc-700 bg-black/60 p-3 text-sm text-white outline-none focus:border-emerald-400"
                    value={tijdHorizon}
                    onChange={(e) => setTijdHorizon(e.target.value)}
                  >
                    <option>3 jaar</option>
                    <option>5 jaar</option>
                    <option>10 jaar</option>
                    <option>15+ jaar</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-zinc-400">
                    Wat past bij jou?
                  </label>
                  <select
                    className="w-full rounded-lg border border-zinc-700 bg-black/60 p-3 text-sm text-white outline-none focus:border-emerald-400"
                    value={comfortLevel}
                    onChange={(e) => setComfortLevel(e.target.value)}
                  >
                    <option>Rustig en stabiel</option>
                    <option>Balans tussen zekerheid en groei</option>
                    <option>Maximale groei, ik kan schommelingen aan</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* knoppen */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              disabled={step === 0}
              onClick={prevStep}
              className="text-xs text-zinc-400 hover:text-zinc-200 disabled:opacity-40 disabled:hover:text-zinc-400"
            >
              ← Vorige
            </button>

            {step < 2 ? (
              <button
                type="button"
                disabled={!canNext}
                onClick={nextStep}
                className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-black disabled:opacity-50"
              >
                Volgende stap →
              </button>
            ) : (
              <button
                type="button"
                disabled={!canNext}
                onClick={handleFinish}
                className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-black disabled:opacity-50"
              >
                Opslaan & naar dashboard
              </button>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-zinc-500">
          Dit is geen financieel advies, maar een coach die je helpt betere
          keuzes te maken met je eigen cijfers.
        </p>
      </div>
    </main>
  );
}