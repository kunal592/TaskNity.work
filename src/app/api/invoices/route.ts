import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/roleCheck";

// GET: Return all invoices.
export async function GET(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const invoices = await prisma.invoice.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
    return NextResponse.json(invoices);
  } catch (error) {
    if (error instanceof Error && error.message === "Access denied") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}

// POST: Create invoice entry with client, amount, status.
export async function POST(request: Request) {
  try {
    await requireRole(["ADMIN"]);
    const body = await request.json();
    const { client, amount, status } = body;

    const newInvoice = await prisma.invoice.create({
      data: {
        client,
        amount,
        status,
      },
    });

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "Access denied") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 });
  }
}
