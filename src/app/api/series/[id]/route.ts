import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Static series data with episodes
const staticSeriesData = [
  {
    id: 'static-1',
    title: 'Breaking Bad',
    year: 2008,
    rating: 9.5,
    poster: '/images/breaking-bad.jpg',
    backdrop: '/images/breaking-bad.jpg',
    description: 'A high school chemistry teacher turned methamphetamine manufacturer partners with a former student.',
    genres: 'Crime,Drama,Thriller',
    quality4k: true,
    seasons: 5,
    totalEpisodes: 62,
    casts: [
      { id: '1', name: 'Bryan Cranston', role: 'Walter White', photo: null },
      { id: '2', name: 'Aaron Paul', role: 'Jesse Pinkman', photo: null },
      { id: '3', name: 'Anna Gunn', role: 'Skyler White', photo: null },
      { id: '4', name: 'Dean Norris', role: 'Hank Schrader', photo: null },
    ],
    episodes: [
      { id: 'e1', season: 1, episode: 1, title: 'Pilot', duration: 58, fileSize: '1.8 GB', quality: '1080p HEVC', format: 'MKV', downloadLinks: [] },
      { id: 'e2', season: 1, episode: 2, title: 'Cat\'s in the Bag...', duration: 48, fileSize: '1.5 GB', quality: '1080p HEVC', format: 'MKV', downloadLinks: [] },
    ],
    downloadLinks: [],
  },
  {
    id: 'static-2',
    title: 'Game of Thrones',
    year: 2011,
    rating: 9.2,
    poster: '/images/got.jpg',
    backdrop: '/images/got.jpg',
    description: 'Nine noble families fight for control of the mythical lands of Westeros.',
    genres: 'Action,Adventure,Drama',
    quality4k: true,
    seasons: 8,
    totalEpisodes: 73,
    casts: [
      { id: '5', name: 'Emilia Clarke', role: 'Daenerys Targaryen', photo: null },
      { id: '6', name: 'Kit Harington', role: 'Jon Snow', photo: null },
      { id: '7', name: 'Peter Dinklage', role: 'Tyrion Lannister', photo: null },
      { id: '8', name: 'Lena Headey', role: 'Cersei Lannister', photo: null },
    ],
    episodes: [
      { id: 'e11', season: 1, episode: 1, title: 'Winter Is Coming', duration: 62, fileSize: '2.1 GB', quality: '1080p HEVC', format: 'MKV', downloadLinks: [] },
      { id: 'e12', season: 1, episode: 2, title: 'The Kingsroad', duration: 56, fileSize: '1.9 GB', quality: '1080p HEVC', format: 'MKV', downloadLinks: [] },
    ],
    downloadLinks: [],
  },
  {
    id: 'static-3',
    title: 'Stranger Things',
    year: 2016,
    rating: 8.7,
    poster: '/images/stranger-things.jpg',
    backdrop: '/images/stranger-things.jpg',
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments and supernatural forces.',
    genres: 'Drama,Fantasy,Horror',
    quality4k: true,
    seasons: 4,
    totalEpisodes: 34,
    casts: [
      { id: '9', name: 'Millie Bobby Brown', role: 'Eleven', photo: null },
      { id: '10', name: 'Finn Wolfhard', role: 'Mike Wheeler', photo: null },
      { id: '11', name: 'Winona Ryder', role: 'Joyce Byers', photo: null },
      { id: '12', name: 'David Harbour', role: 'Jim Hopper', photo: null },
    ],
    episodes: [],
    downloadLinks: [],
  },
  {
    id: 'static-4',
    title: 'The Witcher',
    year: 2019,
    rating: 8.2,
    poster: '/images/witcher.jpg',
    backdrop: '/images/witcher.jpg',
    description: 'Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.',
    genres: 'Action,Adventure,Fantasy',
    quality4k: true,
    seasons: 3,
    totalEpisodes: 24,
    casts: [
      { id: '13', name: 'Henry Cavill', role: 'Geralt of Rivia', photo: null },
      { id: '14', name: 'Anya Chalotra', role: 'Yennefer', photo: null },
      { id: '15', name: 'Freya Allan', role: 'Ciri', photo: null },
    ],
    episodes: [],
    downloadLinks: [],
  },
  {
    id: 'static-5',
    title: 'Money Heist',
    year: 2017,
    rating: 8.2,
    poster: '/images/money-heist.jpg',
    backdrop: '/images/money-heist.jpg',
    description: 'An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history.',
    genres: 'Action,Crime,Drama',
    quality4k: true,
    seasons: 5,
    totalEpisodes: 48,
    casts: [
      { id: '17', name: 'Úrsula Corberó', role: 'Tokyo', photo: null },
      { id: '18', name: 'Álvaro Morte', role: 'The Professor', photo: null },
    ],
    episodes: [],
    downloadLinks: [],
  },
  {
    id: 'static-6',
    title: 'The Last of Us',
    year: 2023,
    rating: 8.8,
    poster: '/images/breaking-bad.jpg',
    backdrop: '/images/breaking-bad.jpg',
    description: 'After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl.',
    genres: 'Action,Adventure,Drama',
    quality4k: true,
    seasons: 1,
    totalEpisodes: 9,
    casts: [
      { id: '21', name: 'Pedro Pascal', role: 'Joel', photo: null },
      { id: '22', name: 'Bella Ramsey', role: 'Ellie', photo: null },
    ],
    episodes: [],
    downloadLinks: [],
  },
  {
    id: 'static-7',
    title: 'Wednesday',
    year: 2022,
    rating: 8.1,
    poster: '/images/stranger-things.jpg',
    backdrop: '/images/stranger-things.jpg',
    description: 'Wednesday Addams investigates a murder spree while making new friends at Nevermore Academy.',
    genres: 'Comedy,Crime,Fantasy',
    quality4k: true,
    seasons: 1,
    totalEpisodes: 8,
    casts: [
      { id: '23', name: 'Jenna Ortega', role: 'Wednesday Addams', photo: null },
    ],
    episodes: [],
    downloadLinks: [],
  },
  {
    id: 'static-8',
    title: 'Peaky Blinders',
    year: 2013,
    rating: 8.8,
    poster: '/images/got.jpg',
    backdrop: '/images/got.jpg',
    description: 'A gangster family epic set in 1900s England, centered on a gang who sew razor blades in the peaks of their caps.',
    genres: 'Crime,Drama',
    quality4k: true,
    seasons: 6,
    totalEpisodes: 36,
    casts: [
      { id: '24', name: 'Cillian Murphy', role: 'Thomas Shelby', photo: null },
    ],
    episodes: [],
    downloadLinks: [],
  },
  {
    id: 'static-9',
    title: 'Squid Game',
    year: 2021,
    rating: 8.0,
    poster: '/images/money-heist.jpg',
    backdrop: '/images/money-heist.jpg',
    description: 'Hundreds of cash-strapped players accept a strange invitation to compete in children games for a tempting prize.',
    genres: 'Action,Drama,Mystery',
    quality4k: true,
    seasons: 1,
    totalEpisodes: 9,
    casts: [
      { id: '25', name: 'Lee Jung-jae', role: 'Seong Gi-hun', photo: null },
    ],
    episodes: [],
    downloadLinks: [],
  },
  {
    id: 'static-10',
    title: 'House of the Dragon',
    year: 2022,
    rating: 8.4,
    poster: '/images/got.jpg',
    backdrop: '/images/got.jpg',
    description: 'The prequel series finds the Targaryen dynasty at the absolute apex of its power.',
    genres: 'Action,Adventure,Drama',
    quality4k: true,
    seasons: 1,
    totalEpisodes: 10,
    casts: [
      { id: '26', name: 'Matt Smith', role: 'Prince Daemon Targaryen', photo: null },
    ],
    episodes: [],
    downloadLinks: [],
  },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let series: any = null;
    let allSeries: any[] = [];

    // Try to fetch from database
    try {
      const dbSeries = await db.series.findUnique({
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

      if (dbSeries) {
        series = {
          ...dbSeries,
          poster: dbSeries.poster || undefined,
          backdrop: dbSeries.backdrop || undefined,
          episodes: dbSeries.episodes.map((ep) => ({
            ...ep,
            downloadLinks: ep.downloadLinks.map((d) => ({
              quality: d.quality,
              url: d.url,
              size: d.size,
            })),
          })),
          downloadLinks: dbSeries.downloadLinks.map((d) => ({
            quality: d.quality,
            url: d.url,
            size: d.size,
          })),
        };
      }

      // Get all series for similar series calculation
      const dbAllSeries = await db.series.findMany({
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

      allSeries = [
        ...dbAllSeries.map((s) => ({
          ...s,
          poster: s.poster || undefined,
          backdrop: s.backdrop || undefined,
          episodes: s.episodes.map((ep) => ({
            ...ep,
            downloadLinks: ep.downloadLinks.map((d) => ({
              quality: d.quality,
              url: d.url,
              size: d.size,
            })),
          })),
          downloadLinks: s.downloadLinks.map((d) => ({
            quality: d.quality,
            url: d.url,
            size: d.size,
          })),
        })),
        ...staticSeriesData,
      ];
    } catch (dbError) {
      console.log('Database not available, using static data');
    }

    // If not found in database, check static series
    if (!series) {
      series = staticSeriesData.find((s) => s.id === id);
    }

    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 });
    }

    // Combine static series with database series for similar series
    if (allSeries.length === 0) {
      allSeries = staticSeriesData;
    }

    // Group episodes by season
    const episodesBySeason = (series.episodes || []).reduce((acc: Record<number, any[]>, ep: any) => {
      if (!acc[ep.season]) {
        acc[ep.season] = [];
      }
      acc[ep.season].push(ep);
      return acc;
    }, {} as Record<number, typeof series.episodes>);

    // Get similar series based on genres
    const genres = series.genres.split(',');
    const similarSeries = allSeries
      .filter((s: any) => s.id !== id && genres.some((g: string) => s.genres.includes(g.trim())))
      .slice(0, 6);

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
