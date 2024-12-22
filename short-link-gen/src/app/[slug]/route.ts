import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest, {params}: { params: { slug: string } }) {
  const slug = params.slug; 

  if (!slug) {
    return new Response('Slug not provided', { status: 400 });
  }

  const link = await prisma.link.findUnique({
    where: { shortSlug: slug },
  });

  if (!link) {
    return NextResponse.json({ message: 'Short URL not found' }, { status: 404 });
  }

  if (link.expiration && link.expiration < new Date()) {
    await prisma.link.delete({
      where: { shortSlug: slug },
    });
    return NextResponse.json({ error: 'Link expired' }, { status: 410 });
  }

  await prisma.link.update({
    where: { shortSlug: slug },
    data: { visits: link.visits + 1 },
  });

  return NextResponse.redirect(link.longUrl);
}
