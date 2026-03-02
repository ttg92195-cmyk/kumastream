import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Sample movie data
const sampleMovies = [
  {
    title: 'Boyz n the Hood',
    year: 1991,
    rating: 7.6,
    duration: 112,
    poster: '/images/boyz-hood.jpg',
    backdrop: '/images/boyz-hood.jpg',
    description: 'A group of young men in South Central Los Angeles navigate life in a neighborhood plagued by violence and drugs.',
    review: 'Boyz n the Hood သည် 1991 ခုနှစ်တွင် ထွက်ရှိခဲ့သော American crime drama ဇာတ်ကားတစ်ကားဖြစ်ပြီး John Singleton မှ ရိုက်ကူးထားပါသည်။ ဤဇာတ်ကားတွင် Cuba Gooding Jr., Ice Cube, Laurence Fishburne နှင့် Morris Chestnut တို့ ပါဝင်သရုပ်ဆောင်ထားပါသည်။',
    genres: 'Crime,Drama',
    quality4k: true,
    director: 'John Singleton',
    fileSize: '7.7 GB / 3.4 GB / 1.5 GB',
    quality: 'Blu-Ray 4K HEVC / 1080p HEVC / 720p',
    format: 'MKV / MP4',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 7.8,
    rtRating: 96,
  },
  {
    title: 'The Dark Knight',
    year: 2008,
    rating: 9.0,
    duration: 152,
    poster: '/images/dark-knight.jpg',
    backdrop: '/images/dark-knight.jpg',
    description: 'Batman faces the Joker, a criminal mastermind who wants to plunge Gotham City into anarchy.',
    review: 'The Dark Knight သည် 2008 ခုနှစ်တွင် ထွက်ရှိခဲ့သော superhero ဇာတ်ကားတစ်ကားဖြစ်ပြီး Christopher Nolan မှ ရိုက်ကူးထားပါသည်။ Christian Bale မှ Batman အဖြစ် သရုပ်ဆောင်ထားပြီး Heath Ledger မှ Joker အဖြစ် သရုပ်ဆောင်ထားသည်။',
    genres: 'Action,Crime,Drama',
    quality4k: true,
    director: 'Christopher Nolan',
    fileSize: '15.2 GB / 8.4 GB / 4.2 GB',
    quality: 'IMAX 4K HEVC / 1080p HEVC / 720p',
    format: 'MKV',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 9.0,
    rtRating: 94,
  },
  {
    title: 'Inception',
    year: 2010,
    rating: 8.8,
    duration: 148,
    poster: '/images/inception.jpg',
    backdrop: '/images/inception.jpg',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea.',
    review: 'Inception သည် 2010 ခုနှစ်တွင် ထွက်ရှိခဲ့သော sci-fi action ဇာတ်ကားတစ်ကားဖြစ်ပြီး Christopher Nolan မှ ရိုက်ကူးထားပါသည်။ Leonardo DiCaprio မှ အဓိကဇာတ်ဆောင် Dom Cobb အဖြစ် သရုပ်ဆောင်ထားသည်။',
    genres: 'Action,Sci-Fi,Thriller',
    quality4k: true,
    director: 'Christopher Nolan',
    fileSize: '12.8 GB / 6.5 GB / 3.2 GB',
    quality: '4K UHD HEVC / 1080p HEVC / 720p',
    format: 'MKV / MP4',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 8.8,
    rtRating: 87,
  },
  {
    title: 'Interstellar',
    year: 2014,
    rating: 8.7,
    duration: 169,
    poster: '/images/interstellar.jpg',
    backdrop: '/images/interstellar.jpg',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    review: 'Interstellar သည် 2014 ခုနှစ်တွင် ထွက်ရှိခဲ့သော sci-fi ဇာတ်ကားတစ်ကားဖြစ်ပြီး Christopher Nolan မှ ရိုက်ကူးထားပါသည်။ Matthew McConaughey မှ အဓိကဇာတ်ဆောင် Cooper အဖြစ် သရုပ်ဆောင်ထားသည်။',
    genres: 'Adventure,Drama,Sci-Fi',
    quality4k: true,
    director: 'Christopher Nolan',
    fileSize: '18.5 GB / 9.2 GB / 4.8 GB',
    quality: 'IMAX 4K HEVC / 1080p HEVC / 720p',
    format: 'MKV',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 8.7,
    rtRating: 73,
  },
  {
    title: 'John Wick',
    year: 2014,
    rating: 7.4,
    duration: 101,
    poster: '/images/john-wick.jpg',
    backdrop: '/images/john-wick.jpg',
    description: 'An ex-hit-man comes out of retirement to track down the gangsters that killed his dog.',
    review: 'John Wick သည် 2014 ခုနှစ်တွင် ထွက်ရှိခဲ့သော action thriller ဇာတ်ကားတစ်ကားဖြစ်ပြီး Chad Stahelski မှ ရိုက်ကူးထားပါသည်။ Keanu Reeves မှ John Wick အဖြစ် သရုပ်ဆောင်ထားသည်။',
    genres: 'Action,Thriller',
    quality4k: true,
    director: 'Chad Stahelski',
    fileSize: '8.2 GB / 4.1 GB / 2.0 GB',
    quality: '4K HEVC / 1080p HEVC / 720p',
    format: 'MKV / MP4',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 7.4,
    rtRating: 86,
  },
  {
    title: 'Avengers: Endgame',
    year: 2019,
    rating: 8.4,
    duration: 181,
    poster: '/images/avengers-endgame.jpg',
    backdrop: '/images/avengers-endgame.jpg',
    description: 'The Avengers assemble once more to reverse Thanos\' actions and restore balance to the universe.',
    review: 'Avengers: Endgame သည် 2019 ခုနှစ်တွင် ထွက်ရှိခဲ့သော superhero ဇာတ်ကားတစ်ကားဖြစ်ပြီး Russo Brothers မှ ရိုက်ကူးထားပါသည်။ Marvel Cinematic Universe ၏ Infinity Saga ကို ပိတ်သိမ်းသော ဇာတ်ကားဖြစ်သည်။',
    genres: 'Action,Adventure,Drama',
    quality4k: true,
    director: 'Anthony Russo, Joe Russo',
    fileSize: '22.5 GB / 11.2 GB / 5.5 GB',
    quality: 'IMAX 4K HEVC / 1080p HEVC / 720p',
    format: 'MKV',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 8.4,
    rtRating: 94,
  },
  {
    title: 'Parasite',
    year: 2019,
    rating: 8.5,
    duration: 132,
    poster: '/images/parasite.jpg',
    backdrop: '/images/parasite.jpg',
    description: 'A poor family schemes to become employed by a wealthy family and infiltrate their household.',
    review: 'Parasite သည် 2019 ခုနှစ်တွင် ထွက်ရှိခဲ့သော South Korean black comedy thriller ဇာတ်ကားတစ်ကားဖြစ်ပြီး Bong Joon-ho မှ ရိုက်ကူးထားပါသည်။',
    genres: 'Comedy,Drama,Thriller',
    quality4k: true,
    director: 'Bong Joon-ho',
    fileSize: '9.8 GB / 4.9 GB / 2.4 GB',
    quality: '4K HEVC / 1080p HEVC / 720p',
    format: 'MKV / MP4',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 8.5,
    rtRating: 99,
  },
  {
    title: 'The Shawshank Redemption',
    year: 1994,
    rating: 9.3,
    duration: 142,
    poster: '/images/shawshank.jpg',
    backdrop: '/images/shawshank.jpg',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption.',
    review: 'The Shawshank Redemption သည် 1994 ခုနှစ်တွင် ထွက်ရှိခဲ့သော drama ဇာတ်ကားတစ်ကားဖြစ်ပြီး Frank Darabont မှ ရိုက်ကူးထားပါသည်။ IMDb တွင် အဆင့် ၁ ဖြင့် အမြဲတမ်း တည်ရှိနေသော ဇာတ်ကားဖြစ်သည်။',
    genres: 'Drama',
    quality4k: true,
    director: 'Frank Darabont',
    fileSize: '10.5 GB / 5.2 GB / 2.6 GB',
    quality: '4K HEVC / 1080p HEVC / 720p',
    format: 'MKV',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 9.3,
    rtRating: 91,
  },
  {
    title: 'Spider-Man: No Way Home',
    year: 2021,
    rating: 8.2,
    duration: 148,
    poster: '/images/spiderman.jpg',
    backdrop: '/images/spiderman.jpg',
    description: 'Spider-Man seeks help from Doctor Strange to make the world forget his identity, leading to multiverse chaos.',
    review: 'Spider-Man: No Way Home သည် 2021 ခုနှစ်တွင် ထွက်ရှိခဲ့သော superhero ဇာတ်ကားတစ်ကားဖြစ်ပြီး Jon Watts မှ ရိုက်ကူးထားပါသည်။',
    genres: 'Action,Adventure,Fantasy',
    quality4k: true,
    director: 'Jon Watts',
    fileSize: '16.2 GB / 8.1 GB / 4.0 GB',
    quality: 'IMAX 4K HEVC / 1080p HEVC / 720p',
    format: 'MKV / MP4',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 8.2,
    rtRating: 93,
  },
  {
    title: 'Dune',
    year: 2021,
    rating: 8.0,
    duration: 155,
    poster: '/images/dune.jpg',
    backdrop: '/images/dune.jpg',
    description: 'Paul Atreides, a brilliant and gifted young man born into a great destiny, must travel to the most dangerous planet.',
    review: 'Dune သည် 2021 ခုနှစ်တွင် ထွက်ရှိခဲ့သော sci-fi ဇာတ်ကားတစ်ကားဖြစ်ပြီး Denis Villeneuve မှ ရိုက်ကူးထားပါသည်။',
    genres: 'Action,Adventure,Sci-Fi',
    quality4k: true,
    director: 'Denis Villeneuve',
    fileSize: '18.8 GB / 9.4 GB / 4.7 GB',
    quality: 'IMAX 4K HEVC / 1080p HEVC / 720p',
    format: 'MKV',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 8.0,
    rtRating: 83,
  },
];

// Sample series data
const sampleSeries = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
];

// Cast data
const castData: Record<string, Array<{ name: string; role: string }>> = {
  'Boyz n the Hood': [
    { name: 'Cuba Gooding Jr.', role: 'Tre Styles' },
    { name: 'Laurence Fishburne', role: 'Furious Styles' },
    { name: 'Ice Cube', role: 'Doughboy' },
    { name: 'Morris Chestnut', role: 'Ricky Baker' },
  ],
  'The Dark Knight': [
    { name: 'Christian Bale', role: 'Bruce Wayne / Batman' },
    { name: 'Heath Ledger', role: 'Joker' },
    { name: 'Aaron Eckhart', role: 'Harvey Dent' },
    { name: 'Michael Caine', role: 'Alfred Pennyworth' },
  ],
  'Inception': [
    { name: 'Leonardo DiCaprio', role: 'Dom Cobb' },
    { name: 'Joseph Gordon-Levitt', role: 'Arthur' },
    { name: 'Ellen Page', role: 'Ariadne' },
    { name: 'Tom Hardy', role: 'Eames' },
  ],
};

export async function GET() {
  try {
    // Check if admin user exists, if not create one
    const existingAdmin = await db.user.findFirst({
      where: { username: 'Admin8676' },
    });

    if (!existingAdmin) {
      await db.user.create({
        data: {
          username: 'Admin8676',
          password: 'Admin8676',
          isAdmin: true,
        },
      });
      console.log('Admin user created');
    }

    // Check if movies already exist
    const existingMovies = await db.movie.count();

    if (existingMovies === 0) {
      // Create genres
      const genres = [
        { name: 'Action', type: 'movie' },
        { name: 'Adventure', type: 'movie' },
        { name: 'Animation', type: 'movie' },
        { name: 'Comedy', type: 'movie' },
        { name: 'Crime', type: 'movie' },
        { name: 'Documentary', type: 'movie' },
        { name: 'Drama', type: 'movie' },
        { name: 'Family', type: 'movie' },
        { name: 'Fantasy', type: 'movie' },
        { name: 'Horror', type: 'movie' },
        { name: 'Mystery', type: 'movie' },
        { name: 'Romance', type: 'movie' },
        { name: 'Science Fiction', type: 'movie' },
        { name: 'Thriller', type: 'movie' },
        { name: 'Action', type: 'series' },
        { name: 'Adventure', type: 'series' },
        { name: 'Comedy', type: 'series' },
        { name: 'Crime', type: 'series' },
        { name: 'Drama', type: 'series' },
        { name: 'Fantasy', type: 'series' },
        { name: 'Horror', type: 'series' },
      ];

      for (const genre of genres) {
        await db.genre.upsert({
          where: { name_type: { name: genre.name, type: genre.type } },
          create: genre,
          update: {},
        });
      }

      // Create collections
      const collections = [
        { name: 'Marvel Cinematic Universe', type: 'movie' },
        { name: 'DC Extended Universe', type: 'movie' },
        { name: 'Harry Potter', type: 'movie' },
        { name: 'The Lord of the Rings', type: 'movie' },
        { name: 'Fast and Furious', type: 'movie' },
        { name: 'John Wick', type: 'movie' },
        { name: 'Mission Impossible', type: 'movie' },
        { name: 'James Bond', type: 'movie' },
        { name: 'Studio Ghibli', type: 'movie' },
        { name: 'A24 Movies', type: 'movie' },
      ];

      for (const collection of collections) {
        await db.collection.upsert({
          where: { name_type: { name: collection.name, type: collection.type } },
          create: collection,
          update: {},
        });
      }

      // Create movies
      for (const movie of sampleMovies) {
        const createdMovie = await db.movie.create({
          data: {
            title: movie.title,
            year: movie.year,
            rating: movie.rating,
            duration: movie.duration,
            poster: movie.poster,
            backdrop: movie.backdrop,
            description: movie.description,
            review: movie.review,
            genres: movie.genres,
            quality4k: movie.quality4k,
            director: movie.director,
            fileSize: movie.fileSize,
            quality: movie.quality,
            format: movie.format,
            subtitle: movie.subtitle,
            imdbRating: movie.imdbRating,
            rtRating: movie.rtRating,
          },
        });

        // Create casts for the movie
        const movieCasts = castData[movie.title] || [];
        for (const cast of movieCasts) {
          await db.cast.create({
            data: {
              name: cast.name,
              role: cast.role,
              movieId: createdMovie.id,
            },
          });
        }
      }

      // Create series
      for (const series of sampleSeries) {
        const createdSeries = await db.series.create({
          data: {
            title: series.title,
            year: series.year,
            rating: series.rating,
            poster: series.poster,
            backdrop: series.backdrop,
            description: series.description,
            genres: series.genres,
            quality4k: series.quality4k,
            seasons: series.seasons,
            totalEpisodes: series.totalEpisodes,
          },
        });

        // Create sample episodes for each season
        for (let season = 1; season <= Math.min(series.seasons, 2); season++) {
          const episodesPerSeason = Math.min(10, Math.ceil(series.totalEpisodes / series.seasons));
          for (let ep = 1; ep <= episodesPerSeason; ep++) {
            await db.episode.create({
              data: {
                seriesId: createdSeries.id,
                season,
                episode: ep,
                title: `Episode ${ep}`,
                duration: 45,
                fileSize: '1.2 GB',
                quality: '1080p HEVC',
                format: 'MKV',
              },
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: existingMovies === 0 ? 'Database seeded successfully' : 'Data already exists',
      adminCreated: !existingAdmin,
      moviesCount: existingMovies || sampleMovies.length,
      seriesCount: sampleSeries.length,
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to seed database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
