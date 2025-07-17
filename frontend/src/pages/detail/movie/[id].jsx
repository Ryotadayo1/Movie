import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'
import MovieReviews from '@/components/MovieReviews' // ✅ 差し替え

export default function MovieDetail() {
  const router = useRouter()
  const { id } = router.query
  const [movie, setMovie] = useState(null)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    if (!id) return

    const fetchMovie = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=0bfa16ec6491365f790b701d6fb8d73f&language=ja-JP`
      )
      const data = await res.json()
      setMovie(data)
    }

    const checkLiked = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/likes', {
          withCredentials: true,
        })
        const likedMovies = res.data.map(item => String(item.movie_id))
        setLiked(likedMovies.includes(String(id)))
      } catch (err) {
        console.error('いいね取得失敗:', err)
      }
    }

    fetchMovie()
    checkLiked()
  }, [id])

  const toggleLike = async () => {
    try {
      if (liked) {
        await axios.delete(`http://localhost:8000/api/likes/${id}`, {
          withCredentials: true,
        })
        setLiked(false)
      } else {
        await axios.post(
          `http://localhost:8000/api/likes`,
          { movie_id: id },
          { withCredentials: true }
        )
        setLiked(true)
      }
    } catch (err) {
      console.error('いいね操作失敗:', err)
    }
  }

  if (!movie) return <div>読み込み中...</div>

  return (
    <AppLayout
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          {movie.title}
        </h2>
      }
    >
      <Head>
        <title>{movie.title} - CinemaLoveReview</title>
      </Head>

      <div className="p-4 space-y-6">
        {movie.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{ width: '300px', borderRadius: '10px' }}
          />
        )}

        <p>{movie.overview}</p>
        <p>公開日: {movie.release_date}</p>
        <p>評価: {movie.vote_average}</p>

        {/* いいねボタン */}
        <button
          onClick={toggleLike}
          className={`px-6 py-3 rounded-lg font-bold text-lg text-white transition duration-200 ${
            liked ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {liked ? '❤️ いいね解除' : '🤍 いいね'}
        </button>

        {/* ✅ ここを MovieReviews コンポーネントに差し替え */}
        <MovieReviews movieId={id} />
      </div>
    </AppLayout>
  )
}
