import { NextResponse } from 'next/server';
import {
  saveTMDBMovieToDb,
  saveTMDBSeriesToDb,
  tmdbMovieExists,
  tmdbSeriesExists,
  getTMDBMovies,
  getTMDBSeries,
  countTMDBMovies,
  countTMDBSeries,
  deleteTMDBMovie,
  deleteTMDBSeries,
  type TMDBMovieInput,
  type TMDBSeriesInput,
} from '@/lib/data-store';

const TMDB_API_KEY = '2e928cd76f7f5ae46f6e022f5dcc2612';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Items array is required' }, { status: 400 });
    }

    const importedItems: any[] = [];
    const errors: any[] = [];
    const duplicates: any[] = [];

    for (const item of items) {
      try {
        const type = item.type || 'movie';

        // Check if already imported
        if (type === 'movie') {
          const exists = await tmdbMovieExists(item.id);
          if (exists) {
            duplicates.push({ id: item.id, type, reason: 'Already imported' });
            continue;
          }
        } else {
          const exists = await tmdbSeriesExists(item.id);
          if (exists) {
            duplicates.push({ id: item.id, type, reason: 'Already imported' });
            continue;
          }
        }

        // Fetch detailed information from TMDB
        const detailUrl = `${TMDB_BASE_URL}/${type}/${item.id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,external_ids`;
        const response = await fetch(detailUrl);
        const details = await response.json();

        if (details.success === false) {
          errors.push({ id: item.id, error: details.status_message || 'Not found' });
          continue;
        }

        if (type === 'movie') {
          const movieInput: TMDBMovieInput = {
            tmdbId: details.id,
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
                (c: { name: string; character: string; profile_path: string | null }) => ({
                  name: c.name,
                  role: c.character,
                  photo: c.profile_path
                    ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
                    : null,
                })
              ) || [],
            downloadLinks: [],
          };

          const id = await saveTMDBMovieToDb(movieInput);
          importedItems.push({ id, tmdbId: details.id, title: movieInput.title, type: 'movie' });
        } else {
          // TV Series
          const seriesInput: TMDBSeriesInput = {
            tmdbId: details.id,
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
                (c: { name: string; character: string; profile_path: string | null }) => ({
                  name: c.name,
                  role: c.character,
                  photo: c.profile_path
                    ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
                    : null,
                })
              ) || [],
            episodes: [],
            downloadLinks: [],
          };

          // Fetch episode details for each season
          try {
            const seasonPromises = [];
            for (let s = 1; s <= (details.number_of_seasons || 1); s++) {
              const seasonUrl = `${TMDB_BASE_URL}/tv/${details.id}/season/${s}?api_key=${TMDB_API_KEY}`;
              seasonPromises.push(fetch(seasonUrl).then((res) => res.json()));
            }
            const seasonData = await Promise.all(seasonPromises);

            for (const season of seasonData) {
              if (season.episodes) {
                for (const ep of season.episodes) {
                  seriesInput.episodes.push({
                    tmdbId: ep.id,
                    season: ep.season_number,
                    episode: ep.episode_number,
                    title: ep.name || `Episode ${ep.episode_number}`,
                    duration: ep.runtime || 45,
                    fileSize: '',
                    quality: '1080p HEVC',
                    format: 'MKV',
                  });
                }
              }
            }
          } catch (e) {
            console.error('Failed to fetch episodes:', e);
          }

          const id = await saveTMDBSeriesToDb(seriesInput);
          importedItems.push({ id, tmdbId: details.id, title: seriesInput.title, type: 'tv' });
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
      duplicates: duplicates.length > 0 ? duplicates : undefined,
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
    const movies = await getTMDBMovies(100, 0);
    const series = await getTMDBSeries(100, 0);
    const totalMovies = await countTMDBMovies();
    const totalSeries = await countTMDBSeries();

    return NextResponse.json({
      movies,
      series,
      totalMovies,
      totalSeries,
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

    if (type === 'movie') {
      const success = await deleteTMDBMovie(id);
      return NextResponse.json({ success });
    } else {
      const success = await deleteTMDBSeries(id);
      return NextResponse.json({ success });
    }
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
