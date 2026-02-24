import { NextResponse } from "next/server"

export async function readJson<T = unknown>(
  req: Request
): Promise<
  | { ok: true; body: T }
  | { ok: false; response: ReturnType<typeof NextResponse.json> }
> {
  try {
    const body = (await req.json()) as T
    return { ok: true, body }
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: "invalid_json" },
        { status: 400 }
      ),
    }
  }
}

export function jsonError(message: string, status = 500) {
  return NextResponse.json({ success: false, error: message }, { status })
}
