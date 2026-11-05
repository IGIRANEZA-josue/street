import { NextResponse } from "next/server";
import { db } from "@/db";
import { subscribers } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const { email, source } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    await db
      .insert(subscribers)
      .values({ email: email.toLowerCase().trim(), source: source || "footer" })
      .onConflictDoNothing();
    return NextResponse.json({ ok: true, message: "Thank you. You have consented to receive INKOTANYISINCE90 email marketing." });
  } catch {
    return NextResponse.json({ error: "Could not subscribe right now. Please try again." }, { status: 500 });
  }
}
