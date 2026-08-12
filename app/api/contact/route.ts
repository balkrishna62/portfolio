import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Contact } from '@/lib/models/Contact';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return false;
  try { jwt.verify(token, JWT_SECRET); return true; } catch { return false; }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 });
    }
    const contact = await Contact.create({ name, email, subject, message });
    return NextResponse.json({ success: true, id: contact._id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const messages = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
