import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ChatSession } from '@/lib/models/ChatSession';
import { ChatMessage } from '@/lib/models/ChatMessage';
import { sendEmailNotification } from '@/lib/mailer';

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('sessionId');
    if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 });

    try {
      await connectDB();
      const session = await ChatSession.findOne({ visitorId: sessionId });
      if (!session) return NextResponse.json({ messages: [], adminTyping: false });

      const messages = await ChatMessage.find({ sessionId: session._id }).sort({ createdAt: 1 });
      const adminTyping = session.adminTypingAt && (new Date().getTime() - session.adminTypingAt.getTime() < 3500);

      return NextResponse.json({ messages, adminTyping: !!adminTyping });
    } catch (dbError) {
      console.warn("DB unavailable for chat GET");
      return NextResponse.json({ messages: [], adminTyping: false });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId, text, name, email, sender } = await req.json();
    if (!sessionId || !text) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    let isNewSession = false;
    let msg = null;

    try {
      await connectDB();
      let session = await ChatSession.findOne({ visitorId: sessionId });
      if (!session) {
        isNewSession = true;
        session = await ChatSession.create({ visitorId: sessionId, name: name || "Visitor", email: email || "" });
      } else {
        if (name) session.name = name;
        if (email) session.email = email;
        session.status = 'active';
        await session.save();
      }
      msg = await ChatMessage.create({ sessionId: session._id, sender: sender || 'user', text });
    } catch (dbError) {
      console.warn("DB unavailable for chat POST");
      isNewSession = true; // Assume new session if DB fails so we send email
      msg = { _id: Date.now().toString(), sender: sender || 'user', text };
    }

    // Send email via Nodemailer SMTP if new session or email provided
    if (isNewSession || email) {
      try {
        await sendEmailNotification(
          `New Live Chat Started on Portfolio`,
          `A new visitor has started a live chat.\n\nName: ${name || "Visitor"}\nEmail: ${email || "Not provided"}\n\nInitial Message:\n${text}`
        );
      } catch (err) {
        console.error("SMTP chat error:", err);
      }
    }

    return NextResponse.json(msg);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    if (!sessionId) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    try {
      await connectDB();
      await ChatSession.findOneAndUpdate(
        { visitorId: sessionId },
        { userTypingAt: new Date() }
      );
    } catch (dbError) {
      // Ignore DB errors for typing indicator
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
