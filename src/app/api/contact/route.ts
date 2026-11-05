import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message)
      return NextResponse.json({ error: "Name, valid email and message are required." }, { status: 400 });
    await db.insert(contactMessages).values({ name, email: email.toLowerCase(), subject: subject || "General", message });
    return NextResponse.json({ ok: true, message: "Message received. The studio replies within 2 business days." });
  } catch {
    return NextResponse.json({ error: "Could not send your message. Email contact@inkotanyisince90.com instead." }, { status: 500 });
  }
}
