import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import laravelApiClient from '@/lib/laravelApiClient'

export default function LikePage() {
  const fetcher = url => laravelApiClient.get(url).then(res => res.data)
  const { data: likeItems, error } = useSWR('/api/likes', fetcher)
  const [movies, setMovies] = useState([])

  useEffect(() => {
    if (likeItems && likeItems.length > 0) {
      const fetchMovies = async () => {
        const moviePromises = likeItems.map(item =>
          fetch(
            `https://api.themoviedb.org/3/movie/${item.movie_id}?api_key=0bfa16ec6491365f790b701d6fb8d73f&language=ja-JP`
          ).then(res => res.json())
        )
        const moviesData = await Promise.all(moviePromises)
        setMovies(moviesData)
      }
      fetchMovies()
    }
  }, [likeItems])

  return (
    <AppLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          いいねした映画
        </h2>
      }>
      <Head>
        <title>いいね一覧 - CinemaLoveReview</title>
      </Head>

      <div className="p-4 space-y-4">
        {error && <div>エラーが発生しました</div>}
        {!likeItems || movies.length === 0 ? (
          <div>読み込み中...</div>
        ) : (
          movies.map(movie => (
            <div
              key={movie.id}
              className="border rounded-lg p-4 shadow hover:bg-gray-50 flex gap-4 items-start">
              {/* 映画ポスター画像を追加 */}
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  className="w-32 rounded"
                />
              )}

              {/* 映画のテキスト情報 */}
              <div>
                <h3 className="text-lg font-bold">{movie.title}</h3>
                <p className="text-sm text-gray-700">{movie.overview}</p>
                <p className="text-xs text-gray-500">
                  公開日: {movie.release_date}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </AppLayout>
  )
}
