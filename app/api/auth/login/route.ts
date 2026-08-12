import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import { Admin } from '@/lib/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    await connectDB();

    // Check env-based admin first (no DB needed for initial setup)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@prerit.dev';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    let isValid = false;
    let adminName = 'Admin';

    if (email === adminEmail) {
      isValid = password === adminPassword;
      adminName = 'Prerit';
    } else {
      // Check DB admin
      const admin = await Admin.findOne({ email });
      if (admin) {
        isValid = await bcrypt.compare(password, admin.password);
        adminName = admin.name;
      }
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ email, name: adminName }, JWT_SECRET, { expiresIn: '7d' });

    const response = NextResponse.json({ success: true, name: adminName });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
