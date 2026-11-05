import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { customers, orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const hash = (pw: string) => crypto.createHash("sha256").update(`is90::${pw}`).digest("hex");

export async function POST(req: Request) {
  try {
    const { action, email, password, name } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    if (!password || password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });

    if (action === "register") {
      if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
      const existing = await db.select().from(customers).where(eq(customers.email, email.toLowerCase()));
      if (existing.length) return NextResponse.json({ error: "An account with this email already exists. Sign in instead." }, { status: 409 });
      const [c] = await db.insert(customers).values({ email: email.toLowerCase(), name, passwordHash: hash(password) }).returning();
      return NextResponse.json({ ok: true, customer: { id: c.id, email: c.email, name: c.name } });
    }

    // login
    const rows = await db.select().from(customers).where(eq(customers.email, email.toLowerCase()));
    const c = rows[0];
    if (!c || c.passwordHash !== hash(password)) return NextResponse.json({ error: "Email or password is incorrect." }, { status: 401 });
    const myOrders = await db.select().from(orders).where(eq(orders.email, c.email)).orderBy(desc(orders.createdAt)).limit(10);
    return NextResponse.json({
      ok: true,
      customer: { id: c.id, email: c.email, name: c.name },
      orders: myOrders.map((o) => ({ orderNumber: o.orderNumber, totalCents: o.totalCents, status: o.status, createdAt: o.createdAt })),
    });
  } catch {
    return NextResponse.json({ error: "Account service unavailable. Try again shortly." }, { status: 500 });
  }
}
