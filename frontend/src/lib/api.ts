// src/lib/api.ts

// Eén centrale API-base. Hij kijkt eerst naar NEXT_PUBLIC_API_URL,
// dan naar NEXT_PUBLIC_API_BASE_URL, dan naar NEXT_PUBLIC_API_BASE,
// en valt anders terug op localhost.
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE ??
  "http://127.0.0.1:8020/api";

/**
 * Haal de token uit localStorage
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

/**
 * Zet / verwijder token in localStorage
 */
export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("access_token", token);
  } else {
    localStorage.removeItem("access_token");
  }
}

/**
 * Uitloggen: token weggooien
 */
export function logout() {
  setToken(null);
}

/**
 * Helper voor POST-requests met JSON body
 */
export async function postJson<T = any>(
  path: string,
  body: any,
  opts?: { auth?: boolean },
): Promise<T> {
  const token = opts?.auth ? getToken() : null;

  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  let data: any = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // laat data dan gewoon string zijn
      data = text;
    }
  }

  if (!res.ok) {
    const msg =
      (data && (data.detail || data.message)) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}

/**
 * Helper voor GET-requests (JSON response)
 */
export async function getJson<T = any>(
  path: string,
  opts?: { auth?: boolean },
): Promise<T> {
  const token = opts?.auth ? getToken() : null;

  const res = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  let data: any = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const msg =
      (data && (data.detail || data.message)) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}

/**
 * AI-coach endpoint
 */
export async function askCoach(
  question: string,
  onboarding?: any,
): Promise<string> {
  const res = await fetch(`${API_BASE}/coach/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      onboarding: onboarding ?? null,
    }),
  });

  if (!res.ok) {
    console.error("Coach API error:", res.status, await res.text());
    throw new Error("Coach request failed");
  }

  const data = await res.json();
  return data.answer as string;
}

/**
 * Preview van een CSV/Excel import met transacties
 */
export async function previewImport(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/transactions/import/preview`, {
    method: "POST",
    body: formData,
    // headers: { Authorization: `Bearer ${getToken()}` }, // later voor auth
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Import mislukte (${res.status}): ${text || res.statusText}`,
    );
  }

  return (await res.json()) as {
    row_count: number;
    total_income: number;
    total_expense: number;
    net: number;
    currency: string;
    by_category: { category: string; total: number }[];
    by_month: { month: string; total: number }[];
  };
}