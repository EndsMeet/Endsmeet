import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_#22c55e33,_transparent_55%),radial-gradient(circle_at_bottom,_#0ea5e933,_transparent_55%)]" />

      {/* Page wrapper */}
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        {/* Top nav */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-sm font-bold text-black">
              €
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight">
                Ends Meet
              </div>
              <div className="text-xs text-zinc-400">
                AI money coach om slimmer met je geld om te gaan
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-zinc-300 sm:flex">
            <a href="#how" className="hover:text-white">
              Hoe het werkt
            </a>
            <a href="#features" className="hover:text-white">
              Functionaliteiten
            </a>
            <a href="#testers" className="hover:text-white">
              Testprogramma
            </a>
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full px-3 py-1 text-xs font-medium text-zinc-300 hover:text-white"
              >
                Inloggen
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold text-black shadow-sm hover:bg-emerald-300"
              >
                Start gratis als tester
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero */}
        <section className="mb-16 grid flex-1 gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Limited beta – 100 testers gezocht
            </div>

            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Je persoonlijke{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                AI money coach
              </span>{" "}
              om slimmer met je geld om te gaan.
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
              Ends Meet helpt je snappen waar je geld naartoe gaat, waar je
              zonder pijn kunt snijden en hoe je het vrijgespeelde geld inzet
              voor dingen die jij belangrijk vindt: rust, buffers en opbouw op
              de lange termijn. Geen spreadsheets. Geen verkooppraatjes. Wel
              concrete, haalbare stappen.
            </p>

            {/* Hero CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-black shadow-lg shadow-emerald-500/30 hover:bg-emerald-300"
              >
                Word early tester
                <span className="ml-2 text-lg">🚀</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-500"
              >
                Ik heb al een account
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="h-6 w-6 rounded-full border border-black bg-zinc-700" />
                  <div className="h-6 w-6 rounded-full border border-black bg-zinc-700" />
                  <div className="h-6 w-6 rounded-full border border-black bg-zinc-700" />
                </div>
                <span>De eerste testers besparen gemiddeld €150 p/m</span>
              </div>
              <span className="hidden h-1 w-1 rounded-full bg-zinc-600 sm:inline-block" />
              <span className="hidden sm:inline">
                Focus op: overzicht, rust & grip op je geld.
              </span>
            </div>
          </div>

          {/* Right: “app card” */}
          <div className="relative">
            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute -bottom-10 -left-6 h-24 w-24 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5 shadow-2xl backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-xs font-medium text-zinc-300">
                  Maandprognose
                </div>
                <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] text-emerald-300">
                  Doel: €300 p/m bewust opzijzetten
                </div>
              </div>

              <div className="mb-5 grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-2xl bg-zinc-900 px-3 py-3">
                  <div className="text-[11px] text-zinc-400">Inkomen</div>
                  <div className="mt-1 text-sm font-semibold">€3.200</div>
                </div>
                <div className="rounded-2xl bg-zinc-900 px-3 py-3">
                  <div className="text-[11px] text-zinc-400">Uitgaven</div>
                  <div className="mt-1 text-sm font-semibold text-red-400">
                    €2.650
                  </div>
                </div>
                <div className="rounded-2xl bg-zinc-900 px-3 py-3">
                  <div className="text-[11px] text-zinc-400">Vrij te spelen</div>
                  <div className="mt-1 text-sm font-semibold text-emerald-400">
                    €550
                  </div>
                </div>
              </div>

              <div className="mb-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-emerald-400/10 px-4 py-3 text-xs">
                <div className="mb-1 text-[11px] uppercase tracking-wide text-emerald-300">
                  Coaching suggestie
                </div>
                <p className="text-zinc-200">
                  Als je <span className="font-semibold">€250 p/m</span> uit
                  vaste lasten haalt en{" "}
                  <span className="font-semibold">€300 p/m</span> automatisch
                  opzijzet en belegt met 5% rendement, heb je over 10 jaar ±{" "}
                  <span className="font-semibold">€46.000</span> opgebouwd.
                </p>
              </div>

              <div className="space-y-2 text-[11px] text-zinc-400">
                <div className="flex items-center justify-between">
                  <span>“Avondeten buiten de deur”</span>
                  <span className="text-zinc-300">€180 p/m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>“Abonnementen & memberships”</span>
                  <span className="text-zinc-300">€95 p/m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>“Impulsaankopen”</span>
                  <span className="text-zinc-300">€120 p/m</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3 text-[11px]">
                <span className="text-zinc-400">
                  Kleine keuzes nu → meer ruimte en opties later.
                </span>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-300">
                  Slimmer-met-je-geld modus
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mb-16">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-300">
            Hoe Ends Meet werkt
          </h2>
          <p className="mb-6 max-w-2xl text-sm text-zinc-300">
            Niet alleen “besparen om het besparen”, maar bewust kiezen: welke
            uitgaven geven je echt iets, en welke niet? Ends Meet helpt je om
            elke euro die je vrijspeelt een taak te geven: schulden afbouwen,
            buffer opbouwen of investeren voor later.
          </p>

          <div className="grid gap-4 md:grid-cols-4 text-sm">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="mb-2 text-xs font-medium text-zinc-400">
                Stap 1
              </div>
              <h3 className="text-sm font-semibold">Koppel je bank of upload</h3>
              <p className="mt-2 text-zinc-400">
                Importeer transacties via een export van je bank. Geen
                boekhoudtaal, wél helder overzicht in gewone mensentaal.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="mb-2 text-xs font-medium text-zinc-400">
                Stap 2
              </div>
              <h3 className="text-sm font-semibold">
                Slimme categorieën & vaste lasten
              </h3>
              <p className="mt-2 text-zinc-400">
                De AI helpt je terugkerende patronen, vaste kosten en “lekkages”
                in je uitgaven te spotten, zonder schuldgevoel.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="mb-2 text-xs font-medium text-zinc-400">
                Stap 3
              </div>
              <h3 className="text-sm font-semibold">Vrijspeel-maandbedrag</h3>
              <p className="mt-2 text-zinc-400">
                Je ziet concreet hoeveel je elke maand kunt vrijmaken zónder dat
                je leven voelt als één groot “nee”. Rust in je hoofd, ruimte in
                je budget.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="mb-2 text-xs font-medium text-zinc-400">
                Stap 4
              </div>
              <h3 className="text-sm font-semibold">Plan voor je geld</h3>
              <p className="mt-2 text-zinc-400">
                Simpele scenario’s: wat gebeurt er als je X per maand inlegt
                tegen Y% rendement? Jij kiest, Ends Meet rekent en houdt het
                begrijpelijk.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mb-16">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-300">
            Wat je nu al krijgt in de beta
          </h2>
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
              <h3 className="text-sm font-semibold">Uitgaven-radar</h3>
              <p className="mt-2 text-zinc-400">
                Automatische categorisatie en inzicht per thema: wonen, vervoer,
                fun, impulsen. Geen saaie export, maar begrijpelijke blokken.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
              <h3 className="text-sm font-semibold">Vaste-lasten scanner</h3>
              <p className="mt-2 text-zinc-400">
                Herkent terugkerende afschrijvingen en laat zien waar je kunt
                onderhandelen, schrappen of downgraden om ruimte te maken.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
              <h3 className="text-sm font-semibold">
                Coach-modus “slimmer met je geld”
              </h3>
              <p className="mt-2 text-zinc-400">
                Simpele, eerlijke vragen: wat wil jij dat je geld voor je doet?
                Ends Meet vertaalt dat naar maandbedragen en concrete acties,
                zonder gouden bergen te beloven.
              </p>
            </div>
          </div>
        </section>

        {/* Testers section */}
        <section
          id="testers"
          className="mb-12 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 px-6 py-6 sm:px-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-base font-semibold text-emerald-300">
                Beta-programma: 100 mensen naar meer rust & grip op hun geld
              </h2>
              <p className="mt-2 max-w-xl text-sm text-emerald-100/90">
                We zoeken 100 mensen die minder geldstress willen en meer
                controle over hun maand. In ruil voor feedback krijg je{" "}
                <span className="font-semibold">1 jaar gratis toegang</span> tot
                Ends Meet.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 md:items-end">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-black shadow-md hover:bg-emerald-300"
              >
                Meld je aan als tester
              </Link>
              <span className="text-xs text-emerald-100/80">
                Geen creditcard. Wel commitment om feedback te geven.
              </span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto flex flex-col justify-between gap-3 border-t border-zinc-900 pt-4 text-xs text-zinc-500 sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} Ends Meet · In beta</div>
          <div className="flex flex-wrap gap-3">
            <span>
              Gemaakt voor mensen die minder geldstress willen en hun geld
              bewuster willen inzetten.
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}