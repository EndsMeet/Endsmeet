import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Hier kun je beveiliging toevoegen voor specifieke routes
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    // Later gebruiken we hier cookies of headers.
    // Nu doet de client-side check het werk.
  }
  return NextResponse.next();
}

// Optioneel: geef aan op welke routes dit actief is
export const config = {
  matcher: ["/dashboard"],
};