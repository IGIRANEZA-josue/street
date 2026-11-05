import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { PRODUCTS } from "@/lib/catalog";

type ItemIn = { slug: string; size: string; color: string; qty: number };

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, address, city, country, phone, notes, items } = body as {
      email: string; name: string; address: string; city: string; country: string; phone?: string; notes?: string; items: ItemIn[];
    };
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Valid email required." }, { status: 400 });
    if (!name || !address || !city || !country) return NextResponse.json({ error: "Name, address, city and country are required." }, { status: 400 });
    if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: "Your bag is empty." }, { status: 400 });

    // Prices are re-computed server-side from the catalogue — never trusted from the client.
    let subtotal = 0;
    const lines: { slug: string; name: string; sku: string; size: string; color: string; qty: number; priceCents: number }[] = [];
    for (const it of items) {
      const p = PRODUCTS.find((x) => x.slug === it.slug);
      if (!p) return NextResponse.json({ error: `Unknown product: ${it.slug}` }, { status: 400 });
      const qty = Math.max(1, Math.min(9, Number(it.qty) || 1));
      subtotal += p.priceCents * qty;
      lines.push({ slug: p.slug, name: p.name, sku: p.sku, size: it.size || "OS", color: it.color || "", qty, priceCents: p.priceCents });
    }
    // INKOTANYISINCE90 calculates shipping and taxes at checkout confirmation.
    // The stored order total therefore contains the product subtotal only.
    const shipping = 0;
    const total = subtotal;
    const orderNumber = `IS90-${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 90 + 10)}`;

    const [order] = await db
      .insert(orders)
      .values({ orderNumber, email, name, address, city, country, phone: phone || "", notes: notes || "", subtotalCents: subtotal, shippingCents: shipping, totalCents: total })
      .returning();
    await db.insert(orderItems).values(lines.map((l) => ({ ...l, orderId: order.id })));

    return NextResponse.json({ ok: true, orderNumber, subtotalCents: subtotal, shippingCents: shipping, totalCents: total });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not place the order. Please try again." }, { status: 500 });
  }
}
