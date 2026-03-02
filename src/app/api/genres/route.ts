import { NextResponse } from 'next/server';

// Static genres data (no database needed)
const movieGenres = [
  { id: '1', name: 'Action', type: 'movie' },
  { id: '2', name: 'Adventure', type: 'movie' },
  { id: '3', name: 'Animation', type: 'movie' },
  { id: '4', name: 'Comedy', type: 'movie' },
  { id: '5', name: 'Crime', type: 'movie' },
  { id: '6', name: 'Documentary', type: 'movie' },
  { id: '7', name: 'Drama', type: 'movie' },
  { id: '8', name: 'Family', type: 'movie' },
  { id: '9', name: 'Fantasy', type: 'movie' },
  { id: '10', name: 'Horror', type: 'movie' },
  { id: '11', name: 'Mystery', type: 'movie' },
  { id: '12', name: 'Romance', type: 'movie' },
  { id: '13', name: 'Science Fiction', type: 'movie' },
  { id: '14', name: 'Thriller', type: 'movie' },
  { id: '15', name: 'War', type: 'movie' },
  { id: '16', name: 'Western', type: 'movie' },
];

const seriesGenres = [
  { id: '17', name: 'Action', type: 'series' },
  { id: '18', name: 'Adventure', type: 'series' },
  { id: '19', name: 'Animation', type: 'series' },
  { id: '20', name: 'Comedy', type: 'series' },
  { id: '21', name: 'Crime', type: 'series' },
  { id: '22', name: 'Drama', type: 'series' },
  { id: '23', name: 'Fantasy', type: 'series' },
  { id: '24', name: 'Horror', type: 'series' },
  { id: '25', name: 'Mystery', type: 'series' },
  { id: '26', name: 'Sci-Fi & Fantasy', type: 'series' },
];

const movieCollections = [
  { id: '1', name: 'Marvel Cinematic Universe', type: 'movie' },
  { id: '2', name: 'DC Extended Universe', type: 'movie' },
  { id: '3', name: 'Harry Potter', type: 'movie' },
  { id: '4', name: 'The Lord of the Rings', type: 'movie' },
  { id: '5', name: 'Fast and Furious', type: 'movie' },
  { id: '6', name: 'John Wick', type: 'movie' },
  { id: '7', name: 'Mission Impossible', type: 'movie' },
  { id: '8', name: 'James Bond', type: 'movie' },
  { id: '9', name: 'Studio Ghibli', type: 'movie' },
  { id: '10', name: 'A24 Movies', type: 'movie' },
];

const seriesCollections = [
  { id: '11', name: 'Star Wars', type: 'series' },
  { id: '12', name: 'Star Trek', type: 'series' },
];

export async function GET() {
  try {
    return NextResponse.json({
      genres: {
        movies: movieGenres,
        series: seriesGenres,
      },
      collections: {
        movies: movieCollections,
        series: seriesCollections,
      },
      tags: {
        movies: [],
        series: [],
      },
    });
  } catch (error) {
    console.error('Error fetching genres:', error);
    return NextResponse.json({ error: 'Failed to fetch genres' }, { status: 500 });
  }
}
