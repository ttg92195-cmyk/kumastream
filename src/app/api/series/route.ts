import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let where: any = {};

    if (genre) {
      where.genres = { contains: genre };
    }

    if (search) {
      where.title = { contains: search };
    }

    const series = await db.series.findMany({
      where,
      include: {
        casts: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const total = await db.series.count({ where });

    return NextResponse.json({
      series,
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json({ error: 'Failed to fetch series' }, { status: 500 });
  }
}
