import { NextResponse } from 'next/server';
import {
  saveTMDBMovie,
  saveTMDBSeries,
  getTMDBMovies,
  getTMDBSeries,
  type TMDBMovie,
  type TMDBSeries,
} from '@/lib/data-store';

const TMDB_API_KEY = '2e928cd76f7f5ae46f6e022f5dcc2612';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Items array is required' }, { status: 400 });
    }

    const importedItems = [];
    const errors = [];

    for (const item of items) {
      try {
        // Fetch detailed information from TMDB
        const type = item.type || 'movie';
        const detailUrl = `${TMDB_BASE_URL}/${type}/${item.id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,external_ids`;
        const response = await fetch(detailUrl);
        const details = await response.json();

        if (details.success === false) {
          errors.push({ id: item.id, error: details.status_message || 'Not found' });
          continue;
        }

        if (type === 'movie') {
          const movie: TMDBMovie = {
            id: `tmdb-${details.id}`,
            title: details.title || '',
            year: parseInt((details.release_date || '').split('-')[0]) || 0,
            rating: details.vote_average || 0,
            duration: details.runtime || 0,
            poster: details.poster_path
              ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
              : null,
            backdrop: details.backdrop_path
              ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
              : null,
            description: details.overview || '',
            genres: details.genres?.map((g: { name: string }) => g.name).join(',') || '',
            quality4k: true,
            director:
              details.credits?.crew?.find((c: { job: string }) => c.job === 'Director')?.name ||
              '',
            fileSize: '',
            quality: '1080p HEVC',
            format: 'MKV',
            subtitle: 'Myanmar Subtitle (Hardsub)',
            imdbRating: details.vote_average || 0,
            rtRating: 0,
            casts:
              details.credits?.cast?.slice(0, 10).map(
                (
                  c: { name: string; character: string; profile_path: string | null },
                  index: number
                ) => ({
                  id: `cast-${details.id}-${index}`,
                  name: c.name,
                  role: c.character,
                  photo: c.profile_path
                    ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
                    : null,
                })
              ) || [],
            type: 'movie',
            createdAt: new Date().toISOString(),
            downloadLinks: [],
          };

          saveTMDBMovie(movie);
          importedItems.push(movie);
        } else {
          // TV Series
          const series: TMDBSeries = {
            id: `tmdb-${details.id}`,
            title: details.name || '',
            year: parseInt((details.first_air_date || '').split('-')[0]) || 0,
            rating: details.vote_average || 0,
            poster: details.poster_path
              ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
              : null,
            backdrop: details.backdrop_path
              ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
              : null,
            description: details.overview || '',
            genres: details.genres?.map((g: { name: string }) => g.name).join(',') || '',
            quality4k: true,
            seasons: details.number_of_seasons || 0,
            totalEpisodes: details.number_of_episodes || 0,
            casts:
              details.credits?.cast?.slice(0, 10).map(
                (
                  c: { name: string; character: string; profile_path: string | null },
                  index: number
                ) => ({
                  id: `cast-${details.id}-${index}`,
                  name: c.name,
                  role: c.character,
                  photo: c.profile_path
                    ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
                    : null,
                })
              ) || [],
            episodes: [],
            type: 'tv',
            createdAt: new Date().toISOString(),
          };

          // Fetch episode details for each season
          try {
            const seasonPromises = [];
            for (let s = 1; s <= (details.number_of_seasons || 1); s++) {
              const seasonUrl = `${TMDB_BASE_URL}/tv/${details.id}/season/${s}?api_key=${TMDB_API_KEY}`;
              seasonPromises.push(fetch(seasonUrl).then((res) => res.json()));
            }
            const seasonData = await Promise.all(seasonPromises);

            let episodeIndex = 0;
            for (const season of seasonData) {
              if (season.episodes) {
                for (const ep of season.episodes) {
                  series.episodes.push({
                    id: `ep-${details.id}-${ep.season_number}-${ep.episode_number}`,
                    season: ep.season_number,
                    episode: ep.episode_number,
                    title: ep.name || `Episode ${ep.episode_number}`,
                    duration: ep.runtime || 45,
                    fileSize: '',
                    quality: '1080p HEVC',
                    format: 'MKV',
                    downloadLinks: [],
                  });
                  episodeIndex++;
                }
              }
            }
          } catch (e) {
            console.error('Failed to fetch episodes:', e);
          }

          saveTMDBSeries(series);
          importedItems.push(series);
        }
      } catch (e) {
        console.error(`Failed to import item ${item.id}:`, e);
        errors.push({ id: item.id, error: 'Import failed' });
      }
    }

    return NextResponse.json({
      success: true,
      imported: importedItems,
      count: importedItems.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json({ error: 'Failed to import items' }, { status: 500 });
  }
}

// GET all TMDB imported items
export async function GET() {
  try {
    const movies = getTMDBMovies();
    const series = getTMDBSeries();

    return NextResponse.json({
      movies,
      series,
      totalMovies: movies.length,
      totalSeries: series.length,
    });
  } catch (error) {
    console.error('Error fetching TMDB items:', error);
    return NextResponse.json({ error: 'Failed to fetch TMDB items' }, { status: 500 });
  }
}

// DELETE an item
export async function DELETE(request: Request) {
  try {
    const { id, type } = await request.json();

    if (!id || !type) {
      return NextResponse.json({ error: 'ID and type are required' }, { status: 400 });
    }

    // Import delete functions
    const { deleteTMDBMovie, deleteTMDBSeries } = await import('@/lib/data-store');

    if (type === 'movie') {
      const success = deleteTMDBMovie(id);
      return NextResponse.json({ success });
    } else {
      const success = deleteTMDBSeries(id);
      return NextResponse.json({ success });
    }
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
