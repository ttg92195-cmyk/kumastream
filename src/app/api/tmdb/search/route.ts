import { NextResponse } from 'next/server';

const TMDB_API_KEY = '2e928cd76f7f5ae46f6e022f5dcc2612';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'movie'; // movie or tv
    const year = searchParams.get('year');
    const genre = searchParams.get('genre');
    const count = searchParams.get('count') || '20';
    const query = searchParams.get('query');

    let url: string;
    let results: any[] = [];

    if (query) {
      // Search by query
      url = `${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`;
      const response = await fetch(url);
      const data = await response.json();
      results = data.results || [];
    } else {
      // Discover with filters
      url = `${TMDB_BASE_URL}/discover/${type}?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&page=1`;
      
      if (year) {
        url += `&primary_release_year=${year}`;
      }
      
      if (genre) {
        // Get genre ID from TMDB
        const genreUrl = `${TMDB_BASE_URL}/genre/${type}/list?api_key=${TMDB_API_KEY}`;
        const genreResponse = await fetch(genreUrl);
        const genreData = await genreResponse.json();
        const genreItem = genreData.genres?.find((g: any) => g.name.toLowerCase() === genre.toLowerCase());
        if (genreItem) {
          url += `&with_genres=${genreItem.id}`;
        }
      }

      // Calculate pages needed
      const limit = count === 'all' ? 100 : parseInt(count);
      const pagesNeeded = Math.ceil(limit / 20);
      
      for (let page = 1; page <= pagesNeeded; page++) {
        const pageUrl = `${url}&page=${page}`;
        const response = await fetch(pageUrl);
        const data = await response.json();
        results = [...results, ...(data.results || [])];
      }
      
      results = results.slice(0, limit);
    }

    // Fetch additional details for each result
    const detailedResults = await Promise.all(
      results.map(async (item: any) => {
        try {
          const detailUrl = `${TMDB_BASE_URL}/${type}/${item.id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos`;
          const response = await fetch(detailUrl);
          const details = await response.json();
          
          return {
            id: item.id,
            title: item.title || item.name,
            originalTitle: item.original_title || item.original_name,
            year: parseInt((item.release_date || item.first_air_date || '').split('-')[0]) || 0,
            poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
            backdrop: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : null,
            rating: item.vote_average || 0,
            overview: item.overview || '',
            genres: details.genres?.map((g: any) => g.name).join(', ') || '',
            type: type,
            // Movie specific
            duration: details.runtime || 0,
            // TV specific
            seasons: details.number_of_seasons || 0,
            totalEpisodes: details.number_of_episodes || 0,
            // Cast
            casts: details.credits?.cast?.slice(0, 10).map((c: any) => ({
              name: c.name,
              role: c.character,
            })) || [],
            // Director (for movies)
            director: details.credits?.crew?.find((c: any) => c.job === 'Director')?.name || '',
          };
        } catch (e) {
          return null;
        }
      })
    );

    const filteredResults = detailedResults.filter(Boolean);

    return NextResponse.json({
      results: filteredResults,
      total: filteredResults.length,
    });
  } catch (error) {
    console.error('TMDB search error:', error);
    return NextResponse.json({ error: 'Failed to fetch from TMDB' }, { status: 500 });
  }
}
