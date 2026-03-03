import { NextResponse } from 'next/server';

const TMDB_API_KEY = '2e928cd76f7f5ae46f6e022f5dcc2612';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'movie';

    const url = `${TMDB_BASE_URL}/genre/${type}/list?api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json({
      genres: data.genres || [],
    });
  } catch (error) {
    console.error('TMDB genre error:', error);
    return NextResponse.json({ error: 'Failed to fetch genres' }, { status: 500 });
  }
}
