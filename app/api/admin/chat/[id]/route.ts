import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ChatMessage } from '@/lib/models/ChatMessage';
import { ChatSession } from '@/lib/models/ChatSession';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return false;
  try { jwt.verify(token, JWT_SECRET); return true; } catch { return false; }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const { id } = await params;
    
    const messages = await ChatMessage.find({ sessionId: id }).sort({ createdAt: 1 });
    const session = await ChatSession.findById(id);
    
    const userTyping = session?.userTypingAt && (new Date().getTime() - session.userTypingAt.getTime() < 3500);

    return NextResponse.json({ messages, userTyping: !!userTyping });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
