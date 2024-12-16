import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const { longUrl, expiration } = await req.json();
  const shortSlug = Math.random().toString(36).substr(2, 8);

  const expirationTime = new Date(Date.now() + parseInt(expiration) * 60000);
  
  const newLink = await prisma.link.create({
    data: { longUrl, shortSlug },
  });
  
  return NextResponse.json({
    shortUrl: `http://localhost:3000/${newLink.shortSlug}`,
    longUrl: newLink.longUrl,
    visits: newLink.visits,
  });
}
