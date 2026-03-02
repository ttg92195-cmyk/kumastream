import { NextResponse } from 'next/server';

const TMDB_API_KEY = '2e928cd76f7f5ae46f6e022f5dcc2612';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Items array is required' }, { status: 400 });
    }

    const importedItems = [];

    for (const item of items) {
      try {
        // Fetch detailed information from TMDB
        const type = item.type || 'movie';
        const detailUrl = `${TMDB_BASE_URL}/${type}/${item.id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,external_ids`;
        const response = await fetch(detailUrl);
        const details = await response.json();

        const importedItem = {
          id: `tmdb-${details.id}`,
          title: details.title || details.name,
          year: parseInt((details.release_date || details.first_air_date || '').split('-')[0]) || 0,
          rating: details.vote_average || 0,
          poster: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : null,
          backdrop: details.backdrop_path ? `https://image.tmdb.org/t/p/original${details.backdrop_path}` : null,
          description: details.overview || '',
          genres: details.genres?.map((g: any) => g.name).join(',') || '',
          quality4k: true,
          type: type,
          // Cast
          casts: details.credits?.cast?.slice(0, 10).map((c: any, index: number) => ({
            id: `cast-${details.id}-${index}`,
            name: c.name,
            role: c.character,
            photo: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : null,
          })) || [],
          // Common fields
          imdbRating: details.vote_average || 0,
          rtRating: 0,
          // Download info (to be filled manually)
          fileSize: '',
          quality: '1080p HEVC',
          format: 'MKV',
          subtitle: 'Myanmar Subtitle (Hardsub)',
          downloadLinks: [],
        };

        if (type === 'movie') {
          // Movie specific
          Object.assign(importedItem, {
            duration: details.runtime || 0,
            director: details.credits?.crew?.find((c: any) => c.job === 'Director')?.name || '',
          });
        } else {
          // TV Series specific
          Object.assign(importedItem, {
            seasons: details.number_of_seasons || 0,
            totalEpisodes: details.number_of_episodes || 0,
            episodes: [],
          });
        }

        importedItems.push(importedItem);
      } catch (e) {
        console.error(`Failed to import item ${item.id}:`, e);
      }
    }

    return NextResponse.json({
      success: true,
      imported: importedItems,
      count: importedItems.length,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Failed to import items' }, { status: 500 });
  }
}
