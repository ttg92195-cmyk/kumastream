import { NextResponse } from 'next/server';
import { getTMDBMovieById, saveTMDBMovie, deleteTMDBMovie, updateMovieDownloadLinks } from '@/lib/data-store';

// Static movies data
const staticMovies = [
  {
    id: '1',
    title: 'Boyz n the Hood',
    year: 1991,
    rating: 7.6,
    duration: 112,
    poster: '/images/boyz-hood.jpg',
    backdrop: '/images/boyz-hood.jpg',
    description: 'A group of young men in South Central Los Angeles navigate life in a neighborhood plagued by violence and drugs.',
    review: 'Boyz n the Hood သည် 1991 ခုနှစ်တွင် ထွက်ရှိခဲ့သော American crime drama ဇာတ်ကားတစ်ကားဖြစ်ပြီး John Singleton မှ ရိုက်ကူးထားပါသည်။ ဤဇာတ်ကားတွင် Cuba Gooding Jr., Ice Cube, Laurence Fishburne နှင့် Morris Chestnut တို့ ပါဝင်သရုပ်ဆောင်ထားပါသည်။ တောင်ပိုင်း Los Angeles ရှိ Crenshaw ခရိုင်တွင် ကြီးပြင်းလာကြသော လူငယ်သုံးဦးဖြစ်သည့် Tre, Ricky နှင့် Doughboy တို့၏ ဘဝများကို ဖော်ပြထားသည်။',
    genres: 'Crime,Drama',
    quality4k: true,
    director: 'John Singleton',
    fileSize: '7.7 GB / 3.4 GB / 1.5 GB',
    quality: 'Blu-Ray 4K HEVC / 1080p HEVC / 720p',
    format: 'MKV / MP4',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 7.8,
    rtRating: 96,
    casts: [
      { id: '1', name: 'Cuba Gooding Jr.', role: 'Tre Styles', photo: null },
      { id: '2', name: 'Laurence Fishburne', role: 'Furious Styles', photo: null },
      { id: '3', name: 'Ice Cube', role: 'Doughboy', photo: null },
      { id: '4', name: 'Morris Chestnut', role: 'Ricky Baker', photo: null },
    ],
  },
  {
    id: '2',
    title: 'The Dark Knight',
    year: 2008,
    rating: 9.0,
    duration: 152,
    poster: '/images/dark-knight.jpg',
    backdrop: '/images/dark-knight.jpg',
    description: 'Batman faces the Joker, a criminal mastermind who wants to plunge Gotham City into anarchy.',
    review: 'The Dark Knight သည် 2008 ခုနှစ်တွင် ထွက်ရှိခဲ့သော superhero ဇာတ်ကားတစ်ကားဖြစ်ပြီး Christopher Nolan မှ ရိုက်ကူးထားပါသည်။ Christian Bale မှ Batman အဖြစ် သရုပ်ဆောင်ထားပြီး Heath Ledger မှ Joker အဖြစ် သရုပ်ဆောင်ထားသည်။ ဤဇာတ်ကားသည် သမိုင်းတွင် အကောင်းဆုံး superhero ဇာတ်ကားတစ်ကားအဖြစ် ယူဆကြသည်။',
    genres: 'Action,Crime,Drama',
    quality4k: true,
    director: 'Christopher Nolan',
    fileSize: '15.2 GB / 8.4 GB / 4.2 GB',
    quality: 'IMAX 4K HEVC / 1080p HEVC / 720p',
    format: 'MKV',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 9.0,
    rtRating: 94,
    casts: [
      { id: '5', name: 'Christian Bale', role: 'Bruce Wayne / Batman', photo: null },
      { id: '6', name: 'Heath Ledger', role: 'Joker', photo: null },
      { id: '7', name: 'Aaron Eckhart', role: 'Harvey Dent', photo: null },
      { id: '8', name: 'Michael Caine', role: 'Alfred Pennyworth', photo: null },
    ],
  },
  {
    id: '3',
    title: 'Inception',
    year: 2010,
    rating: 8.8,
    duration: 148,
    poster: '/images/inception.jpg',
    backdrop: '/images/inception.jpg',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea.',
    review: 'Inception သည် 2010 ခုနှစ်တွင် ထွက်ရှိခဲ့သော sci-fi action ဇာတ်ကားတစ်ကားဖြစ်ပြီး Christopher Nolan မှ ရိုက်ကူးထားပါသည်။ Leonardo DiCaprio မှ အဓိကဇာတ်ဆောင် Dom Cobb အဖြစ် သရုပ်ဆောင်ထားသည်။ ဤဇာတ်ကားသည် အိပ်မက်နှင့် ဆိုင်သော ဉာဏ်ပညာရပ်များကို အသေးစိတ် ဖော်ပြထားသည်။',
    genres: 'Action,Sci-Fi,Thriller',
    quality4k: true,
    director: 'Christopher Nolan',
    fileSize: '12.8 GB / 6.5 GB / 3.2 GB',
    quality: '4K UHD HEVC / 1080p HEVC / 720p',
    format: 'MKV / MP4',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 8.8,
    rtRating: 87,
    casts: [
      { id: '9', name: 'Leonardo DiCaprio', role: 'Dom Cobb', photo: null },
      { id: '10', name: 'Joseph Gordon-Levitt', role: 'Arthur', photo: null },
      { id: '11', name: 'Ellen Page', role: 'Ariadne', photo: null },
      { id: '12', name: 'Tom Hardy', role: 'Eames', photo: null },
    ],
  },
  {
    id: '4',
    title: 'Interstellar',
    year: 2014,
    rating: 8.7,
    duration: 169,
    poster: '/images/interstellar.jpg',
    backdrop: '/images/interstellar.jpg',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    review: 'Interstellar သည် 2014 ခုနှစ်တွင် ထွက်ရှိခဲ့သော sci-fi ဇာတ်ကားတစ်ကားဖြစ်ပြီး Christopher Nolan မှ ရိုက်ကူးထားပါသည်။ Matthew McConaughey မှ အဓိကဇာတ်ဆောင် Cooper အဖြစ် သရုပ်ဆောင်ထားသည်။ ဤဇာတ်ကားသည် အာကာသ၊ အချိန်နှင့် ချစ်ခြင်းတော်တို့ကို လှပစွာ ဖော်ပြထားသည်။',
    genres: 'Adventure,Drama,Sci-Fi',
    quality4k: true,
    director: 'Christopher Nolan',
    fileSize: '18.5 GB / 9.2 GB / 4.8 GB',
    quality: 'IMAX 4K HEVC / 1080p HEVC / 720p',
    format: 'MKV',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 8.7,
    rtRating: 73,
    casts: [
      { id: '13', name: 'Matthew McConaughey', role: 'Cooper', photo: null },
      { id: '14', name: 'Anne Hathaway', role: 'Dr. Amelia Brand', photo: null },
      { id: '15', name: 'Jessica Chastain', role: 'Murph', photo: null },
      { id: '16', name: 'Michael Caine', role: 'Professor Brand', photo: null },
    ],
  },
  {
    id: '5',
    title: 'John Wick',
    year: 2014,
    rating: 7.4,
    duration: 101,
    poster: '/images/john-wick.jpg',
    backdrop: '/images/john-wick.jpg',
    description: 'An ex-hit-man comes out of retirement to track down the gangsters that killed his dog.',
    review: 'John Wick သည် 2014 ခုနှစ်တွင် ထွက်ရှိခဲ့သော action thriller ဇာတ်ကားတစ်ကားဖြစ်ပြီး Chad Stahelski မှ ရိုက်ကူးထားပါသည်။ Keanu Reeves မှ John Wick အဖြစ် သရုပ်ဆောင်ထားသည်။ ဤဇာတ်ကားသည် လှုပ်ရှားမှုပြည့်ဝသော action ခက်ခဲသည့် ဇာတ်ကားတစ်ကားဖြစ်သည်။',
    genres: 'Action,Thriller',
    quality4k: true,
    director: 'Chad Stahelski',
    fileSize: '8.2 GB / 4.1 GB / 2.0 GB',
    quality: '4K HEVC / 1080p HEVC / 720p',
    format: 'MKV / MP4',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 7.4,
    rtRating: 86,
    casts: [
      { id: '17', name: 'Keanu Reeves', role: 'John Wick', photo: null },
      { id: '18', name: 'Michael Nyqvist', role: 'Viggo Tarasov', photo: null },
      { id: '19', name: 'Alfie Allen', role: 'Iosef Tarasov', photo: null },
      { id: '20', name: 'Willem Dafoe', role: 'Marcus', photo: null },
    ],
  },
  {
    id: '6',
    title: 'Avengers: Endgame',
    year: 2019,
    rating: 8.4,
    duration: 181,
    poster: '/images/avengers-endgame.jpg',
    backdrop: '/images/avengers-endgame.jpg',
    description: 'The Avengers assemble once more to reverse Thanos\' actions and restore balance to the universe.',
    review: 'Avengers: Endgame သည် 2019 ခုနှစ်တွင် ထွက်ရှိခဲ့သော superhero ဇာတ်ကားတစ်ကားဖြစ်ပြီး Russo Brothers မှ ရိုက်ကူးထားပါသည်။ Marvel Cinematic Universe ၏ Infinity Saga ကို ပိတ်သိမ်းသော ဇာတ်ကားဖြစ်သည်။ ဤဇာတ်ကားတွင် များစွာသော superhero များ ပါဝင်သရုပ်ဆောင်ထားသည်။',
    genres: 'Action,Adventure,Drama',
    quality4k: true,
    director: 'Anthony Russo, Joe Russo',
    fileSize: '22.5 GB / 11.2 GB / 5.5 GB',
    quality: 'IMAX 4K HEVC / 1080p HEVC / 720p',
    format: 'MKV',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 8.4,
    rtRating: 94,
    casts: [
      { id: '21', name: 'Robert Downey Jr.', role: 'Tony Stark / Iron Man', photo: null },
      { id: '22', name: 'Chris Evans', role: 'Steve Rogers / Captain America', photo: null },
      { id: '23', name: 'Scarlett Johansson', role: 'Natasha Romanoff', photo: null },
      { id: '24', name: 'Chris Hemsworth', role: 'Thor', photo: null },
    ],
  },
  {
    id: '7',
    title: 'Parasite',
    year: 2019,
    rating: 8.5,
    duration: 132,
    poster: '/images/parasite.jpg',
    backdrop: '/images/parasite.jpg',
    description: 'A poor family schemes to become employed by a wealthy family and infiltrate their household.',
    review: 'Parasite သည် 2019 ခုနှစ်တွင် ထွက်ရှိခဲ့သော South Korean black comedy thriller ဇာတ်ကားတစ်ကားဖြစ်ပြီး Bong Joon-ho မှ ရိုက်ကူးထားပါသည်။ ဤဇာတ်ကားသည် Academy Award မှ Best Picture ဆုရရှိခဲ့သော ပထမဆုံး non-English ဇာတ်ကားဖြစ်သည်။',
    genres: 'Comedy,Drama,Thriller',
    quality4k: true,
    director: 'Bong Joon-ho',
    fileSize: '9.8 GB / 4.9 GB / 2.4 GB',
    quality: '4K HEVC / 1080p HEVC / 720p',
    format: 'MKV / MP4',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 8.5,
    rtRating: 99,
    casts: [
      { id: '25', name: 'Song Kang-ho', role: 'Kim Ki-taek', photo: null },
      { id: '26', name: 'Lee Sun-kyun', role: 'Park Dong-ik', photo: null },
      { id: '27', name: 'Cho Yeo-jeong', role: 'Yeon-gyo', photo: null },
      { id: '28', name: 'Choi Woo-shik', role: 'Kim Ki-woo', photo: null },
    ],
  },
  {
    id: '8',
    title: 'The Shawshank Redemption',
    year: 1994,
    rating: 9.3,
    duration: 142,
    poster: '/images/shawshank.jpg',
    backdrop: '/images/shawshank.jpg',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption.',
    review: 'The Shawshank Redemption သည် 1994 ခုနှစ်တွင် ထွက်ရှိခဲ့သော drama ဇာတ်ကားတစ်ကားဖြစ်ပြီး Frank Darabont မှ ရိုက်ကူးထားပါသည်။ Stephen King ၏ ဝတ္ထုတိုကို အခြေခံထားသည်။ IMDb တွင် အဆင့် ၁ ဖြင့် အမြဲတမ်း တည်ရှိနေသော ဇာတ်ကားဖြစ်သည်။',
    genres: 'Drama',
    quality4k: true,
    director: 'Frank Darabont',
    fileSize: '10.5 GB / 5.2 GB / 2.6 GB',
    quality: '4K HEVC / 1080p HEVC / 720p',
    format: 'MKV',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 9.3,
    rtRating: 91,
    casts: [
      { id: '29', name: 'Tim Robbins', role: 'Andy Dufresne', photo: null },
      { id: '30', name: 'Morgan Freeman', role: 'Ellis Boyd Red Redding', photo: null },
      { id: '31', name: 'Bob Gunton', role: 'Warden Norton', photo: null },
      { id: '32', name: 'William Sadler', role: 'Heywood', photo: null },
    ],
  },
  {
    id: '9',
    title: 'Spider-Man: No Way Home',
    year: 2021,
    rating: 8.2,
    duration: 148,
    poster: '/images/spiderman.jpg',
    backdrop: '/images/spiderman.jpg',
    description: 'Spider-Man seeks help from Doctor Strange to make the world forget his identity, leading to multiverse chaos.',
    review: 'Spider-Man: No Way Home သည် 2021 ခုနှစ်တွင် ထွက်ရှိခဲ့သော superhero ဇာတ်ကားတစ်ကားဖြစ်ပြီး Jon Watts မှ ရိုက်ကူးထားပါသည်။ ဤဇာတ်ကားတွင် တိုင်မယ် Spider-Man များဖြစ်သည့် Tobey Maguire, Andrew Garfield နှင့် Tom Holland တို့ ပါဝင်သရုပ်ဆောင်ထားသည်။',
    genres: 'Action,Adventure,Fantasy',
    quality4k: true,
    director: 'Jon Watts',
    fileSize: '16.2 GB / 8.1 GB / 4.0 GB',
    quality: 'IMAX 4K HEVC / 1080p HEVC / 720p',
    format: 'MKV / MP4',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 8.2,
    rtRating: 93,
    casts: [
      { id: '33', name: 'Tom Holland', role: 'Peter Parker / Spider-Man', photo: null },
      { id: '34', name: 'Zendaya', role: 'MJ', photo: null },
      { id: '35', name: 'Benedict Cumberbatch', role: 'Dr. Stephen Strange', photo: null },
      { id: '36', name: 'Jacob Batalon', role: 'Ned Leeds', photo: null },
    ],
  },
  {
    id: '10',
    title: 'Dune',
    year: 2021,
    rating: 8.0,
    duration: 155,
    poster: '/images/dune.jpg',
    backdrop: '/images/dune.jpg',
    description: 'Paul Atreides, a brilliant and gifted young man born into a great destiny, must travel to the most dangerous planet.',
    review: 'Dune သည် 2021 ခုနှစ်တွင် ထွက်ရှိခဲ့သော sci-fi ဇာတ်ကားတစ်ကားဖြစ်ပြီး Denis Villeneuve မှ ရိုက်ကူးထားပါသည်။ Frank Herbert ၏ ဝတ္ထုကို အခြေခံထားသည်။ ဤဇာတ်ကားသည် အသံ၊ ရုပ်ရှင်ရိုက်ကူးမှုနှင့် အထူးeffect များအတွက် ဆုများစွာ ရရှိခဲ့သည်။',
    genres: 'Action,Adventure,Sci-Fi',
    quality4k: true,
    director: 'Denis Villeneuve',
    fileSize: '18.8 GB / 9.4 GB / 4.7 GB',
    quality: 'IMAX 4K HEVC / 1080p HEVC / 720p',
    format: 'MKV',
    subtitle: 'Myanmar Subtitle (Hardsub)',
    imdbRating: 8.0,
    rtRating: 83,
    casts: [
      { id: '37', name: 'Timothée Chalamet', role: 'Paul Atreides', photo: null },
      { id: '38', name: 'Rebecca Ferguson', role: 'Lady Jessica', photo: null },
      { id: '39', name: 'Oscar Isaac', role: 'Duke Leto Atreides', photo: null },
      { id: '40', name: 'Zendaya', role: 'Chani', photo: null },
    ],
  },
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // First check static movies
    let movie = staticMovies.find((m) => m.id === id);

    // If not found, check TMDB imported movies
    if (!movie && id.startsWith('tmdb-')) {
      movie = getTMDBMovieById(id);
    }

    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    // Combine static movies with TMDB movies for similar movies
    const { getTMDBMovies } = await import('@/lib/data-store');
    const tmdbMovies = getTMDBMovies();
    const allMovies = [...staticMovies, ...tmdbMovies];

    // Get similar movies based on genres
    const genres = movie.genres.split(',');
    const similarMovies = allMovies
      .filter((m) => m.id !== id && genres.some((g) => m.genres.includes(g.trim())))
      .slice(0, 6);

    return NextResponse.json({
      movie,
      similarMovies,
    });
  } catch (error) {
    console.error('Error fetching movie:', error);
    return NextResponse.json({ error: 'Failed to fetch movie' }, { status: 500 });
  }
}

// PUT - Update movie
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Only allow editing TMDB imported movies (not static ones)
    if (!id.startsWith('tmdb-')) {
      return NextResponse.json({ 
        error: 'Cannot edit static movies. Only TMDB imported movies can be edited.' 
      }, { status: 400 });
    }

    const existingMovie = getTMDBMovieById(id);
    if (!existingMovie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }

    // Update the movie with new data
    const updatedMovie = {
      ...existingMovie,
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    const success = saveTMDBMovie(updatedMovie);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        movie: updatedMovie,
        message: 'Movie updated successfully' 
      });
    } else {
      return NextResponse.json({ error: 'Failed to update movie' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating movie:', error);
    return NextResponse.json({ error: 'Failed to update movie' }, { status: 500 });
  }
}

// DELETE - Delete movie
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Only allow deleting TMDB imported movies (not static ones)
    if (!id.startsWith('tmdb-')) {
      return NextResponse.json({ 
        error: 'Cannot delete static movies. Only TMDB imported movies can be deleted.' 
      }, { status: 400 });
    }

    const success = deleteTMDBMovie(id);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Movie deleted successfully' 
      });
    } else {
      return NextResponse.json({ error: 'Movie not found or could not be deleted' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting movie:', error);
    return NextResponse.json({ error: 'Failed to delete movie' }, { status: 500 });
  }
}

// PATCH - Update download links only
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { downloadLinks } = body;

    // Only allow editing TMDB imported movies
    if (!id.startsWith('tmdb-')) {
      return NextResponse.json({ 
        error: 'Cannot edit static movies. Only TMDB imported movies can be edited.' 
      }, { status: 400 });
    }

    if (!downloadLinks || !Array.isArray(downloadLinks)) {
      return NextResponse.json({ error: 'downloadLinks array is required' }, { status: 400 });
    }

    const success = updateMovieDownloadLinks(id, downloadLinks);
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Download links updated successfully' 
      });
    } else {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating download links:', error);
    return NextResponse.json({ error: 'Failed to update download links' }, { status: 500 });
  }
}
