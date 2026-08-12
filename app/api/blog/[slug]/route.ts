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

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const post = await BlogPost.findOne({ slug });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (!post.published && !isAdmin(req)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const { slug } = await params;
    const data = await req.json();
    if (data.published && !data.publishedAt) data.publishedAt = new Date();
    const post = await BlogPost.findOneAndUpdate({ slug }, data, { new: true });
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/');
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const { slug } = await params;
    await BlogPost.findOneAndDelete({ slug });
    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
