// Data store using Prisma with Neon PostgreSQL
import { db } from './db';

// TMDB Movie type for import
export interface TMDBMovieInput {
  tmdbId: number;
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
    name: string;
    role: string;
    photo: string | null;
  }>;
  downloadLinks: Array<{ quality: string; url: string; size?: string }>;
}

// TMDB Series type for import
export interface TMDBSeriesInput {
  tmdbId: number;
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
    name: string;
    role: string;
    photo: string | null;
  }>;
  episodes: Array<{
    tmdbId?: number;
    season: number;
    episode: number;
    title: string;
    duration: number;
    fileSize: string;
    quality: string;
    format: string;
    downloadLinks?: Array<{ quality: string; url: string; size?: string }>;
  }>;
  downloadLinks?: Array<{ quality: string; url: string; size?: string }>;
}

// Save TMDB movie to database
export async function saveTMDBMovieToDb(input: TMDBMovieInput): Promise<string> {
  const movie = await db.movie.create({
    data: {
      tmdbId: input.tmdbId,
      title: input.title,
      year: input.year,
      rating: input.rating,
      duration: input.duration,
      poster: input.poster,
      backdrop: input.backdrop,
      description: input.description,
      genres: input.genres,
      quality4k: input.quality4k,
      director: input.director,
      fileSize: input.fileSize,
      quality: input.quality,
      format: input.format,
      subtitle: input.subtitle,
      imdbRating: input.imdbRating,
      rtRating: input.rtRating,
      casts: {
        create: input.casts.map((c) => ({
          name: c.name,
          role: c.role,
          photo: c.photo,
        })),
      },
      downloadLinks: {
        create: input.downloadLinks.map((d) => ({
          quality: d.quality,
          url: d.url,
          size: d.size,
        })),
      },
    },
    include: {
      casts: true,
      downloadLinks: true,
    },
  });

  return movie.id;
}

// Save TMDB series to database
export async function saveTMDBSeriesToDb(input: TMDBSeriesInput): Promise<string> {
  const series = await db.series.create({
    data: {
      tmdbId: input.tmdbId,
      title: input.title,
      year: input.year,
      rating: input.rating,
      poster: input.poster,
      backdrop: input.backdrop,
      description: input.description,
      genres: input.genres,
      quality4k: input.quality4k,
      seasons: input.seasons,
      totalEpisodes: input.totalEpisodes,
      casts: {
        create: input.casts.map((c) => ({
          name: c.name,
          role: c.role,
          photo: c.photo,
        })),
      },
      episodes: {
        create: input.episodes.map((ep) => ({
          tmdbId: ep.tmdbId,
          season: ep.season,
          episode: ep.episode,
          title: ep.title,
          duration: ep.duration,
          fileSize: ep.fileSize,
          quality: ep.quality,
          format: ep.format,
          downloadLinks: ep.downloadLinks
            ? {
                create: ep.downloadLinks.map((d) => ({
                  quality: d.quality,
                  url: d.url,
                  size: d.size,
                })),
              }
            : undefined,
        })),
      },
      downloadLinks: input.downloadLinks
        ? {
            create: input.downloadLinks.map((d) => ({
              quality: d.quality,
              url: d.url,
              size: d.size,
            })),
          }
        : undefined,
    },
    include: {
      casts: true,
      episodes: true,
      downloadLinks: true,
    },
  });

  return series.id;
}

// Check if TMDB movie already exists
export async function tmdbMovieExists(tmdbId: number): Promise<boolean> {
  const count = await db.movie.count({
    where: { tmdbId },
  });
  return count > 0;
}

// Check if TMDB series already exists
export async function tmdbSeriesExists(tmdbId: number): Promise<boolean> {
  const count = await db.series.count({
    where: { tmdbId },
  });
  return count > 0;
}

// Get all TMDB movies
export async function getTMDBMovies(limit = 50, offset = 0) {
  return db.movie.findMany({
    where: {
      tmdbId: { not: null },
    },
    include: {
      casts: true,
      downloadLinks: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

// Get all TMDB series
export async function getTMDBSeries(limit = 50, offset = 0) {
  return db.series.findMany({
    where: {
      tmdbId: { not: null },
    },
    include: {
      casts: true,
      episodes: {
        orderBy: [{ season: 'asc' }, { episode: 'asc' }],
        include: {
          downloadLinks: true,
        },
      },
      downloadLinks: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: offset,
  });
}

// Get TMDB movie by internal ID
export async function getTMDBMovieById(id: string) {
  return db.movie.findUnique({
    where: { id },
    include: {
      casts: true,
      downloadLinks: true,
    },
  });
}

// Get TMDB series by internal ID
export async function getTMDBSeriesById(id: string) {
  return db.series.findUnique({
    where: { id },
    include: {
      casts: true,
      episodes: {
        orderBy: [{ season: 'asc' }, { episode: 'asc' }],
        include: {
          downloadLinks: true,
        },
      },
      downloadLinks: true,
    },
  });
}

// Count TMDB movies
export async function countTMDBMovies(): Promise<number> {
  return db.movie.count({
    where: { tmdbId: { not: null } },
  });
}

// Count TMDB series
export async function countTMDBSeries(): Promise<number> {
  return db.series.count({
    where: { tmdbId: { not: null } },
  });
}

// Delete TMDB movie
export async function deleteTMDBMovie(id: string): Promise<boolean> {
  try {
    await db.movie.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}

// Delete TMDB series
export async function deleteTMDBSeries(id: string): Promise<boolean> {
  try {
    await db.series.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}
