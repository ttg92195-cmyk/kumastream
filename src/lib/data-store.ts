// Data store for TMDB imported content
// Uses a global variable for serverless environments

export interface TMDBMovie {
  id: string;
  title: string;
  year: number;
  rating: number;
  duration: number;
  poster: string | null;
  backdrop: string | null;
  description: string;
  genres: string;
  quality4k: boolean;
  director: string;
  fileSize: string;
  quality: string;
  format: string;
  subtitle: string;
  imdbRating: number;
  rtRating: number;
  casts: Array<{
    id: string;
    name: string;
    role: string;
    photo: string | null;
  }>;
  type: string;
  createdAt: string;
  downloadLinks: Array<{ quality: string; link: string }>;
}

export interface TMDBSeries {
  id: string;
  title: string;
  year: number;
  rating: number;
  poster: string | null;
  backdrop: string | null;
  description: string;
  genres: string;
  quality4k: boolean;
  seasons: number;
  totalEpisodes: number;
  casts: Array<{
    id: string;
    name: string;
    role: string;
    photo: string | null;
  }>;
  episodes: Array<{
    id: string;
    season: number;
    episode: number;
    title: string;
    duration: number;
    fileSize: string;
    quality: string;
    format: string;
    downloadLinks?: Array<{ quality: string; link: string }>;
  }>;
  type: string;
  createdAt: string;
}

// Global storage for TMDB content (persists across serverless invocations in the same instance)
declare global {
  var tmdbMovies: TMDBMovie[] | undefined;
  var tmdbSeries: TMDBSeries[] | undefined;
}

// Initialize global storage if not exists
if (!global.tmdbMovies) {
  global.tmdbMovies = [];
}
if (!global.tmdbSeries) {
  global.tmdbSeries = [];
}

// Get all TMDB movies
export function getTMDBMovies(): TMDBMovie[] {
  return global.tmdbMovies || [];
}

// Get all TMDB series
export function getTMDBSeries(): TMDBSeries[] {
  return global.tmdbSeries || [];
}

// Get a single TMDB movie by ID
export function getTMDBMovieById(id: string): TMDBMovie | undefined {
  return global.tmdbMovies?.find((m) => m.id === id);
}

// Get a single TMDB series by ID
export function getTMDBSeriesById(id: string): TMDBSeries | undefined {
  return global.tmdbSeries?.find((s) => s.id === id);
}

// Save a TMDB movie
export function saveTMDBMovie(movie: TMDBMovie): boolean {
  try {
    // Check if already exists
    const existingIndex = global.tmdbMovies?.findIndex((m) => m.id === movie.id) ?? -1;
    if (existingIndex >= 0 && global.tmdbMovies) {
      // Update existing
      global.tmdbMovies[existingIndex] = movie;
    } else {
      // Add new
      global.tmdbMovies?.push(movie);
    }
    return true;
  } catch (e) {
    console.error('Failed to save TMDB movie:', e);
    return false;
  }
}

// Save a TMDB series
export function saveTMDBSeries(series: TMDBSeries): boolean {
  try {
    // Check if already exists
    const existingIndex = global.tmdbSeries?.findIndex((s) => s.id === series.id) ?? -1;
    if (existingIndex >= 0 && global.tmdbSeries) {
      // Update existing
      global.tmdbSeries[existingIndex] = series;
    } else {
      // Add new
      global.tmdbSeries?.push(series);
    }
    return true;
  } catch (e) {
    console.error('Failed to save TMDB series:', e);
    return false;
  }
}

// Delete a TMDB movie
export function deleteTMDBMovie(id: string): boolean {
  try {
    const index = global.tmdbMovies?.findIndex((m) => m.id === id) ?? -1;
    if (index >= 0 && global.tmdbMovies) {
      global.tmdbMovies.splice(index, 1);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to delete TMDB movie:', e);
    return false;
  }
}

// Delete a TMDB series
export function deleteTMDBSeries(id: string): boolean {
  try {
    const index = global.tmdbSeries?.findIndex((s) => s.id === id) ?? -1;
    if (index >= 0 && global.tmdbSeries) {
      global.tmdbSeries.splice(index, 1);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to delete TMDB series:', e);
    return false;
  }
}

// Update movie download links
export function updateMovieDownloadLinks(
  id: string,
  downloadLinks: Array<{ quality: string; link: string }>
): boolean {
  try {
    const movie = global.tmdbMovies?.find((m) => m.id === id);
    if (movie) {
      movie.downloadLinks = downloadLinks;
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to update movie download links:', e);
    return false;
  }
}

// Update series episode download links
export function updateEpisodeDownloadLinks(
  seriesId: string,
  episodeId: string,
  downloadLinks: Array<{ quality: string; link: string }>
): boolean {
  try {
    const series = global.tmdbSeries?.find((s) => s.id === seriesId);
    if (series) {
      const episode = series.episodes.find((e) => e.id === episodeId);
      if (episode) {
        episode.downloadLinks = downloadLinks;
        return true;
      }
    }
    return false;
  } catch (e) {
    console.error('Failed to update episode download links:', e);
    return false;
  }
}

// Add episode to series
export function addEpisodeToSeries(
  seriesId: string,
  episode: TMDBSeries['episodes'][0]
): boolean {
  try {
    const series = global.tmdbSeries?.find((s) => s.id === seriesId);
    if (series) {
      series.episodes.push(episode);
      return true;
    }
    return false;
  } catch (e) {
    console.error('Failed to add episode to series:', e);
    return false;
  }
}
