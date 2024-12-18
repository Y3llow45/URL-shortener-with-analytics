import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const { longUrl, time } = await req.json();

  if (!longUrl || !time) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const parsedTime = parseInt(time, 10);
  if (isNaN(parsedTime) || parsedTime <= 0) {
    return NextResponse.json({ error: 'Invalid expiration time' }, { status: 400 });
  }

  const shortSlug = Math.random().toString(36).substr(2, 8);

  const expiration = new Date(Date.now() + parseInt(time) * 60000);
  
  const newLink = await prisma.link.create({
    data: { longUrl, shortSlug, expiration },
  });
  
  return NextResponse.json({
    shortUrl: `http://localhost:3000/${newLink.shortSlug}`,
    longUrl: newLink.longUrl,
    visits: newLink.visits,
  });
}
