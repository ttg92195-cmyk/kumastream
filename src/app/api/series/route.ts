import { NextResponse } from 'next/server';
import { getTMDBSeries } from '@/lib/data-store';

// Static series data
const staticSeries = [
  {
    id: '1',
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
  },
  {
    id: '2',
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
  },
  {
    id: '3',
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
  },
  {
    id: '4',
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
      { id: '16', name: 'Joey Batey', role: 'Jaskier', photo: null },
    ],
  },
  {
    id: '5',
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
      { id: '19', name: 'Itziar Ituño', role: 'Raquel Murillo', photo: null },
      { id: '20', name: 'Pedro Alonso', role: 'Berlin', photo: null },
    ],
  },
  {
    id: '6',
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
  },
  {
    id: '7',
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
  },
  {
    id: '8',
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
  },
  {
    id: '9',
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
  },
  {
    id: '10',
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
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const tmdbOnly = searchParams.get('tmdbOnly') === 'true';

    // Combine static series with TMDB imported series
    const tmdbSeries = getTMDBSeries();
    let allSeries = tmdbOnly ? [...tmdbSeries] : [...staticSeries, ...tmdbSeries];

    if (genre) {
      allSeries = allSeries.filter((s) => s.genres.includes(genre));
    }

    if (search) {
      allSeries = allSeries.filter((s) =>
        s.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = allSeries.length;
    const paginatedSeries = allSeries.slice(offset, offset + limit);

    return NextResponse.json({
      series: paginatedSeries,
      total,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error('Error fetching series:', error);
    return NextResponse.json({ error: 'Failed to fetch series' }, { status: 500 });
  }
}
