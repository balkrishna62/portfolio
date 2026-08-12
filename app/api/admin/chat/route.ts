import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ChatSession } from '@/lib/models/ChatSession';
import { ChatMessage } from '@/lib/models/ChatMessage';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return false;
  try { jwt.verify(token, JWT_SECRET); return true; } catch { return false; }
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const sessions = await ChatSession.find().sort({ updatedAt: -1 });
    
    // Optionally fetch messages for all sessions if needed, or just return sessions
    // For a robust system, we return the sessions and let the UI fetch messages for the active one.
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const { dbSessionId, text } = await req.json();
    if (!dbSessionId || !text) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    const msg = await ChatMessage.create({ sessionId: dbSessionId, sender: 'admin', text });
    await ChatSession.findByIdAndUpdate(dbSessionId, { updatedAt: new Date() });
    
    return NextResponse.json(msg);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const { dbSessionId, status } = await req.json();
    if (!dbSessionId) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    if (status) {
      await ChatSession.findByIdAndUpdate(dbSessionId, { status });
    } else {
      await ChatSession.findByIdAndUpdate(dbSessionId, { adminTypingAt: new Date() });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
