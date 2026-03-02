import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const genres = await db.genre.findMany({
      orderBy: { name: 'asc' },
    });

    const collections = await db.collection.findMany({
      orderBy: { name: 'asc' },
    });

    const tags = await db.tag.findMany({
      orderBy: { name: 'asc' },
    });

    // Group by type
    const movieGenres = genres.filter((g) => g.type === 'movie');
    const seriesGenres = genres.filter((g) => g.type === 'series');
    const movieCollections = collections.filter((c) => c.type === 'movie');
    const seriesCollections = collections.filter((c) => c.type === 'series');

    return NextResponse.json({
      genres: {
        movies: movieGenres,
        series: seriesGenres,
      },
      collections: {
        movies: movieCollections,
        series: seriesCollections,
      },
      tags: {
        movies: tags.filter((t) => t.type === 'movie'),
        series: tags.filter((t) => t.type === 'series'),
      },
    });
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json({ error: 'Failed to fetch genres' }, { status: 500 });
  }
}
