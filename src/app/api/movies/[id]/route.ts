import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const movie = await db.movie.findUnique({
      where: { id },
      include: {
        casts: true,
      },
    });

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    // Get similar movies based on genres
    const genres = movie.genres.split(',');
    const similarMovies = await db.movie.findMany({
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
      movie,
      similarMovies,
    });
  } catch (error) {
    console.error('Error fetching movie:', error);
    return NextResponse.json({ error: 'Failed to fetch movie' }, { status: 500 });
  }
}
