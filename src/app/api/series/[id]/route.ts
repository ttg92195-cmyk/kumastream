import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const series = await db.series.findUnique({
      where: { id },
      include: {
        casts: true,
        episodes: {
          orderBy: [{ season: 'asc' }, { episode: 'asc' }],
        },
      },
    });

    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 });
    }

    // Group episodes by season
    const episodesBySeason = series.episodes.reduce((acc, ep) => {
      if (!acc[ep.season]) {
        acc[ep.season] = [];
      }
      acc[ep.season].push(ep);
      return acc;
    }, {} as Record<number, typeof series.episodes>);

    // Get similar series based on genres
    const genres = series.genres.split(',');
    const similarSeries = await db.series.findMany({
      where: {
        AND: [
          { id: { not: id } },
          {
            OR: genres.map((g) => ({
              genres: { contains: g.trim() },
            })),
          },
        ],
      },
      take: 6,
    });

    return NextResponse.json({
      series,
      episodesBySeason,
      similarSeries,
    });
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json({ error: 'Failed to fetch series' }, { status: 500 });
  }
}
