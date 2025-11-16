export default function TestersPage() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Titel + intro */}
        <section className="mb-10">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
            Testfase · Exclusief voor early users
          </span>

          <h1 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight text-zinc-900">
            Word onderdeel van het EndsMeet testpanel
          </h1>

          <p className="mt-3 text-zinc-600 text-base md:text-lg max-w-2xl">
            Help ons een slimme, coachende money buddy bouwen die je richting{" "}
            <span className="font-semibold">financiële vrijheid</span> brengt. 
            In ruil voor je feedback krijg je een jaar gratis toegang tot de eerste versie.
          </p>
        </section>

        {/* Hoe werkt het blok */}
        <section className="grid gap-6 md:grid-cols-3 mb-10">
          <div className="bg-white border rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold mb-2">1. Maak een account aan</h2>
            <p className="text-sm text-zinc-600">
              Ga naar <span className="font-medium">Sign up</span>, maak een account aan en log in.
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold mb-2">2. Doorloop de onboarding</h2>
            <p className="text-sm text-zinc-600">
              Beantwoord een paar vragen over jouw situatie, doelen en waar je nu staat.
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold mb-2">3. Test & geef feedback</h2>
            <p className="text-sm text-zinc-600">
              Speel met het dashboard en vul daarna het feedbackformulier in.
            </p>
          </div>
        </section>

        {/* Call to action blok */}
        <section className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm mb-10">
          <h2 className="text-xl font-semibold mb-2">
            Wat we van je vragen
          </h2>
          <p className="text-sm text-zinc-600 mb-4">
            We zoeken mensen die eerlijk willen delen:
          </p>
          <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1 mb-4">
            <li>Waar je nu tegenaan loopt met geld en plannen maken</li>
            <li>Wat je mist in bestaande apps van banken en budgeting tools</li>
            <li>Hoe duidelijk ons dashboard en onboarding voor je zijn</li>
            <li>Wat je nodig hebt om echt in actie te komen</li>
          </ul>
          <p className="text-sm text-zinc-600 mb-6">
            Je hoeft geen cijfers te delen als je dat niet wilt; het gaat ons om 
            <span className="font-semibold"> gedrag, keuzes en gevoel</span> rondom geld.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/signup"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-black text-white text-sm font-medium hover:bg-zinc-900"
            >
              Start als tester
            </a>
            <a
  href="https://docs.google.com/forms/d/e/1FAIpQLScLWPbCc8o3va9o1YZKBH9-0inx_WnJ3GK-8LxrpyPFzzZpuQ/viewform?usp=header"
  target="_blank"
  rel="noreferrer"
  className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-zinc-900"
>
  Open aanmeldformulier
</a>
          </div>

          <p className="mt-3 text-xs text-zinc-500">
            🔐 Jouw data blijft in deze testfase lokaal en in onze beveiligde testomgeving. 
            Niks wordt commercieel gebruikt.
          </p>
        </section>

        {/* Kleine FAQ / verwachtingen */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="bg-white border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-2">Wat krijg jij terug?</h3>
            <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1">
              <li>Een jaar gratis toegang tot de eerste versie</li>
              <li>Invloed op hoe de app werkt en eruitziet</li>
              <li>Een tool die jou helpt richting financiële vrijheid</li>
            </ul>
          </div>

          <div className="bg-white border rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold mb-2">Hoeveel tijd kost het?</h3>
            <ul className="list-disc list-inside text-sm text-zinc-700 space-y-1">
              <li>± 5–10 minuten voor account + onboarding</li>
              <li>± 15–20 minuten om het dashboard te verkennen</li>
              <li>± 5–10 minuten om feedback te geven</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}