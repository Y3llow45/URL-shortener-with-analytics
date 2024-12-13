import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, context: { params: { slug: string } }) {
  const { params } = context;
  const slug = await params.slug; 

  if (!slug) {
    return new Response('Slug not provided', { status: 400 });
  }

  const link = await prisma.link.findUnique({
    where: { shortSlug: slug },
  });

  if (!link) {
    return NextResponse.json({ message: 'Short URL not found' }, { status: 404 });
  }

  await prisma.link.update({
    where: { shortSlug: slug },
    data: { visits: link.visits + 1 },
  });

  return NextResponse.redirect(link.longUrl);
}
