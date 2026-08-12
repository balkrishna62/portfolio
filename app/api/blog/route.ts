import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { BlogPost } from '@/lib/models/BlogPost';
import jwt from 'jsonwebtoken';
import { revalidatePath } from 'next/cache';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';

function isAdmin(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!token) return false;
  try { jwt.verify(token, JWT_SECRET); return true; } catch { return false; }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const admin = isAdmin(req);
    const query = admin ? {} : { published: true };
    const posts = await BlogPost.find(query).sort({ publishedAt: -1, createdAt: -1 }).select('-content');
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const data = await req.json();
    const words = data.content?.split(' ').length || 0;
    data.readingTime = Math.ceil(words / 200);
    if (data.published && !data.publishedAt) data.publishedAt = new Date();
    const post = await BlogPost.create(data);
    revalidatePath('/blog');
    revalidatePath('/');
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
