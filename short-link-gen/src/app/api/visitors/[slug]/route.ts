import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  const link = await prisma.link.findUnique({
    where: { shortSlug: slug },
  });

  if (!link) {
    return NextResponse.json({ message: 'Short URL not found' }, { status: 404 });
  }

  return NextResponse.json({ visits: link.visits });
}
