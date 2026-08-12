import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ChatSession } from '@/lib/models/ChatSession';
import { ChatMessage } from '@/lib/models/ChatMessage';

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('sessionId');
    if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 });

    await connectDB();
    const session = await ChatSession.findOne({ visitorId: sessionId });
    if (!session) return NextResponse.json({ messages: [], adminTyping: false });

    const messages = await ChatMessage.find({ sessionId: session._id }).sort({ createdAt: 1 });
    
    // Check if admin is typing (typed within the last 3 seconds)
    const adminTyping = session.adminTypingAt && (new Date().getTime() - session.adminTypingAt.getTime() < 3500);

    return NextResponse.json({ messages, adminTyping: !!adminTyping });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { sessionId, text, name, email, sender } = await req.json();
    if (!sessionId || !text) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    let session = await ChatSession.findOne({ visitorId: sessionId });
    if (!session) {
      session = await ChatSession.create({ visitorId: sessionId, name: name || "Visitor", email: email || "" });
    } else {
      if (name) session.name = name;
      if (email) session.email = email;
      session.status = 'active'; // Re-activate if closed
      await session.save();
    }

    const msg = await ChatMessage.create({ sessionId: session._id, sender: sender || 'user', text });
    return NextResponse.json(msg);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { sessionId } = await req.json();
    if (!sessionId) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    await ChatSession.findOneAndUpdate(
      { visitorId: sessionId },
      { userTypingAt: new Date() }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
