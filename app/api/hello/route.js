import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: "¡Hola desde Next.js API!" });
} 