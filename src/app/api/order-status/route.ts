import { NextResponse } from "next/server";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { and, eq } from "drizzle-orm";

const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

export async function POST(req: Request) {
  try {
    const { email, orderNumber, address } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter the email address used for the order." }, { status: 400 });
    }
    if (!orderNumber || !address) {
      return NextResponse.json({ error: "Order number and shipping address are required." }, { status: 400 });
    }

    const rows = await db
      .select()
      .from(orders)
      .where(and(eq(orders.email, email.toLowerCase().trim()), eq(orders.orderNumber, orderNumber.trim().toUpperCase())))
      .limit(1);
    const order = rows[0];

    if (!order || !normalize(order.address).includes(normalize(address))) {
      return NextResponse.json({ error: "We could not find an order matching those details." }, { status: 404 });
    }

    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    return NextResponse.json({
      ok: true,
      order: {
        orderNumber: order.orderNumber,
        status: order.status,
        createdAt: order.createdAt,
        totalCents: order.totalCents,
        items: items.map((item) => ({ name: item.name, sku: item.sku, size: item.size, qty: item.qty, priceCents: item.priceCents })),
      },
    });
  } catch {
    return NextResponse.json({ error: "Order status is unavailable right now. Email contact@inkotanyisince90.com for help." }, { status: 500 });
  }
}
