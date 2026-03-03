import { NextResponse } from 'next/server';
import { getTMDBSeriesById, saveTMDBSeries, deleteTMDBSeries, updateEpisodeDownloadLinks } from '@/lib/data-store';

// Static series data with episodes
const staticSeriesData = [
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
    episodes: [
      { id: 'e1', season: 1, episode: 1, title: 'Pilot', duration: 58, fileSize: '1.8 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e2', season: 1, episode: 2, title: 'Cat\'s in the Bag...', duration: 48, fileSize: '1.5 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e3', season: 1, episode: 3, title: '...And the Bag\'s in the River', duration: 48, fileSize: '1.5 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e4', season: 1, episode: 4, title: 'Cancer Man', duration: 48, fileSize: '1.5 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e5', season: 1, episode: 5, title: 'Gray Matter', duration: 48, fileSize: '1.5 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e6', season: 1, episode: 6, title: 'Crazy Handful of Nothin\'', duration: 47, fileSize: '1.4 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e7', season: 1, episode: 7, title: 'A No-Rough-Stuff-Type Deal', duration: 47, fileSize: '1.4 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e8', season: 2, episode: 1, title: 'Seven Thirty-Seven', duration: 47, fileSize: '1.4 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e9', season: 2, episode: 2, title: 'Grilled', duration: 47, fileSize: '1.4 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e10', season: 2, episode: 3, title: 'Bit by a Dead Bee', duration: 47, fileSize: '1.4 GB', quality: '1080p HEVC', format: 'MKV' },
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
    episodes: [
      { id: 'e11', season: 1, episode: 1, title: 'Winter Is Coming', duration: 62, fileSize: '2.1 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e12', season: 1, episode: 2, title: 'The Kingsroad', duration: 56, fileSize: '1.9 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e13', season: 1, episode: 3, title: 'Lord Snow', duration: 58, fileSize: '1.9 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e14', season: 1, episode: 4, title: 'Cripples, Bastards, and Broken Things', duration: 56, fileSize: '1.8 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e15', season: 1, episode: 5, title: 'The Wolf and the Lion', duration: 55, fileSize: '1.8 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e16', season: 2, episode: 1, title: 'The North Remembers', duration: 52, fileSize: '1.7 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e17', season: 2, episode: 2, title: 'The Night Lands', duration: 53, fileSize: '1.7 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e18', season: 2, episode: 3, title: 'What Is Dead May Never Die', duration: 52, fileSize: '1.7 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e19', season: 2, episode: 4, title: 'Garden of Bones', duration: 52, fileSize: '1.7 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e20', season: 2, episode: 5, title: 'The Ghost of Harrenhal', duration: 54, fileSize: '1.8 GB', quality: '1080p HEVC', format: 'MKV' },
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
    episodes: [
      { id: 'e21', season: 1, episode: 1, title: 'Chapter One: The Vanishing of Will Byers', duration: 47, fileSize: '1.5 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e22', season: 1, episode: 2, title: 'Chapter Two: The Weirdo on Maple Street', duration: 55, fileSize: '1.7 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e23', season: 1, episode: 3, title: 'Chapter Three: Holly, Jolly', duration: 51, fileSize: '1.6 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e24', season: 1, episode: 4, title: 'Chapter Four: The Body', duration: 51, fileSize: '1.6 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e25', season: 2, episode: 1, title: 'Chapter One: MADMAX', duration: 48, fileSize: '1.5 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e26', season: 2, episode: 2, title: 'Chapter Two: Trick or Treat, Freak', duration: 56, fileSize: '1.8 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e27', season: 2, episode: 3, title: 'Chapter Three: The Pollywog', duration: 45, fileSize: '1.4 GB', quality: '1080p HEVC', format: 'MKV' },
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
    ],
    episodes: [
      { id: 'e28', season: 1, episode: 1, title: 'The End\'s Beginning', duration: 61, fileSize: '2.0 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e29', season: 1, episode: 2, title: 'Four Marks', duration: 61, fileSize: '2.0 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e30', season: 1, episode: 3, title: 'Betrayer Moon', duration: 60, fileSize: '1.9 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e31', season: 1, episode: 4, title: 'Of Banquets, Bastards and Burials', duration: 52, fileSize: '1.7 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e32', season: 2, episode: 1, title: 'A Grain of Truth', duration: 60, fileSize: '1.9 GB', quality: '1080p HEVC', format: 'MKV' },
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
    ],
    episodes: [
      { id: 'e33', season: 1, episode: 1, title: 'Episode 1', duration: 47, fileSize: '1.5 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e34', season: 1, episode: 2, title: 'Episode 2', duration: 42, fileSize: '1.3 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e35', season: 1, episode: 3, title: 'Episode 3', duration: 50, fileSize: '1.6 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e36', season: 2, episode: 1, title: 'Episode 1', duration: 52, fileSize: '1.7 GB', quality: '1080p HEVC', format: 'MKV' },
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
    episodes: [
      { id: 'e37', season: 1, episode: 1, title: 'When You\'re Lost in the Darkness', duration: 81, fileSize: '2.6 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e38', season: 1, episode: 2, title: 'Infected', duration: 53, fileSize: '1.7 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e39', season: 1, episode: 3, title: 'Long, Long Time', duration: 76, fileSize: '2.4 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e40', season: 1, episode: 4, title: 'Please Hold to My Hand', duration: 45, fileSize: '1.4 GB', quality: '1080p HEVC', format: 'MKV' },
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
    episodes: [
      { id: 'e41', season: 1, episode: 1, title: 'Wednesday\'s Child Is Full of Woe', duration: 50, fileSize: '1.6 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e42', season: 1, episode: 2, title: 'Woe Is the Loneliest Number', duration: 47, fileSize: '1.5 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e43', season: 1, episode: 3, title: 'Friend or Woe', duration: 48, fileSize: '1.5 GB', quality: '1080p HEVC', format: 'MKV' },
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
    episodes: [
      { id: 'e44', season: 1, episode: 1, title: 'Episode 1', duration: 57, fileSize: '1.8 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e45', season: 1, episode: 2, title: 'Episode 2', duration: 57, fileSize: '1.8 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e46', season: 1, episode: 3, title: 'Episode 3', duration: 57, fileSize: '1.8 GB', quality: '1080p HEVC', format: 'MKV' },
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
    episodes: [
      { id: 'e47', season: 1, episode: 1, title: 'Red Light, Green Light', duration: 60, fileSize: '1.9 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e48', season: 1, episode: 2, title: 'Hell', duration: 62, fileSize: '2.0 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e49', season: 1, episode: 3, title: 'The Man with the Umbrella', duration: 54, fileSize: '1.7 GB', quality: '1080p HEVC', format: 'MKV' },
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
    episodes: [
      { id: 'e50', season: 1, episode: 1, title: 'The Heirs of the Dragon', duration: 66, fileSize: '2.1 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e51', season: 1, episode: 2, title: 'The Rogue Prince', duration: 54, fileSize: '1.7 GB', quality: '1080p HEVC', format: 'MKV' },
      { id: 'e52', season: 1, episode: 3, title: 'Second of His Name', duration: 61, fileSize: '1.9 GB', quality: '1080p HEVC', format: 'MKV' },
    ],
  },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // First check static series
    let series = staticSeriesData.find((s) => s.id === id);

    // If not found, check TMDB imported series
    if (!series && id.startsWith('tmdb-')) {
      series = getTMDBSeriesById(id);
    }

    if (!series) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 });
    }

    // Group episodes by season
    const episodesBySeason = (series.episodes || []).reduce((acc, ep) => {
      if (!acc[ep.season]) {
        acc[ep.season] = [];
      }
      acc[ep.season].push(ep);
      return acc;
    }, {} as Record<number, typeof series.episodes>);

    // Combine static series with TMDB series for similar series
    const { getTMDBSeries } = await import('@/lib/data-store');
    const tmdbSeries = getTMDBSeries();
    const allSeries = [...staticSeriesData, ...tmdbSeries];

    // Get similar series based on genres
    const genres = series.genres.split(',');
    const similarSeries = allSeries
      .filter((s) => s.id !== id && genres.some((g) => s.genres.includes(g.trim())))
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

// PUT - Update series
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Only allow editing TMDB imported series (not static ones)
    if (!id.startsWith('tmdb-')) {
      return NextResponse.json({ 
        error: 'Cannot edit static series. Only TMDB imported series can be edited.' 
      }, { status: 400 });
    }

    const existingSeries = getTMDBSeriesById(id);
    if (!existingSeries) {
      return NextResponse.json({ error: 'Series not found' }, { status: 404 });
    }

    // Update the series with new data
    const updatedSeries = {
      ...existingSeries,
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    const success = saveTMDBSeries(updatedSeries);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        series: updatedSeries,
        message: 'Series updated successfully' 
      });
    } else {
      return NextResponse.json({ error: 'Failed to update series' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating series:', error);
    return NextResponse.json({ error: 'Failed to update series' }, { status: 500 });
  }
}

// DELETE - Delete series
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Only allow deleting TMDB imported series (not static ones)
    if (!id.startsWith('tmdb-')) {
      return NextResponse.json({ 
        error: 'Cannot delete static series. Only TMDB imported series can be deleted.' 
      }, { status: 400 });
    }

    const success = deleteTMDBSeries(id);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Series deleted successfully' 
      });
    } else {
      return NextResponse.json({ error: 'Series not found or could not be deleted' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting series:', error);
    return NextResponse.json({ error: 'Failed to delete series' }, { status: 500 });
  }
}

// PATCH - Update episode download links
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { episodeId, downloadLinks } = body;

    // Only allow editing TMDB imported series
    if (!id.startsWith('tmdb-')) {
      return NextResponse.json({ 
        error: 'Cannot edit static series. Only TMDB imported series can be edited.' 
      }, { status: 400 });
    }

    if (!episodeId || !downloadLinks || !Array.isArray(downloadLinks)) {
      return NextResponse.json({ error: 'episodeId and downloadLinks array are required' }, { status: 400 });
    }

    const success = updateEpisodeDownloadLinks(id, episodeId, downloadLinks);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Episode download links updated successfully' 
      });
    } else {
      return NextResponse.json({ error: 'Series or episode not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating episode download links:', error);
    return NextResponse.json({ error: 'Failed to update episode download links' }, { status: 500 });
  }
}
