import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(req: Request) {
  try {
    const { shortUrl } = await req.json();

    if (!shortUrl) {
      return NextResponse.json(
        { error: 'shortUrl is required' },
        { status: 400 }
      );
    }

    const shortSlug = shortUrl.split('/').pop();

    const existingLink = await prisma.link.findUnique({
      where: { shortSlug },
    });

    if (!existingLink) {
      return NextResponse.json({ message: 'URL deleted successfully' });
    }

    await prisma.link.delete({
      where: { shortSlug },
    });

    return NextResponse.json({ message: 'URL deleted successfully' });
  } catch (error) {
    console.error('Error deleting URL:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the URL' },
      { status: 500 }
    );
  }
}
