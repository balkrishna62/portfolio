import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return false;
  try { jwt.verify(token, JWT_SECRET); return true; } catch { return false; }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { type, base64 } = await req.json(); // type: 'logo' or 'favicon'
    if (!type || !base64) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

    const matches = base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: 'Invalid base64 string' }, { status: 400 });
    }

    const buffer = Buffer.from(matches[2], 'base64');
    const publicDir = path.join(process.cwd(), 'public');

    if (type === 'favicon') {
      fs.writeFileSync(path.join(publicDir, 'favicon.ico'), buffer);
    } else if (type === 'logo') {
      // Assuming we save it as logo.png (we can enforce png on frontend)
      fs.writeFileSync(path.join(publicDir, 'logo.png'), buffer);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to upload' }, { status: 500 });
  }
}
