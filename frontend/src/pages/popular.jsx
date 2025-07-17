import AppLayout from '@/components/Layouts/AppLayout';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function PopularPage() {
  const [popularMovies, setPopularMovies] = useState([]);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const res = await fetch('/api/getPopularMovies');
        const data = await res.json();
        setPopularMovies(data);
      } catch (err) {
        console.error('人気映画の取得に失敗:', err);
      }
    };
    fetchPopularMovies();
  }, []);

  return (
    <AppLayout
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">人気な映画</h2>}
    >
      <Head>
        <title>人気な映画 - CinemaLoveReview</title>
      </Head>

      <div className="py-12 px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {popularMovies
            .filter((movie) => movie.poster_path)
            .map((movie) => (
              <div key={movie.id} className="text-center">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="rounded-lg shadow-md"
                />
                <p className="mt-2 text-sm">{movie.title}</p>
              </div>
            ))}
        </div>
      </div>
    </AppLayout>
  );
}
