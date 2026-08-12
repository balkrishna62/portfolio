import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ valid: false }, { status: 401 });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ valid: true, payload });
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
