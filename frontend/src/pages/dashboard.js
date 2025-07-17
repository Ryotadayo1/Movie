import AppLayout from '@/components/Layouts/AppLayout'
import MovieList from '@/components/MovieList'
import Search from '@/components/Search'
import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function Dashboard() {
    const [movies, setMovies] = useState([])
    const [trendingMovies, setTrendingMovies] = useState([])

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch('/api/getNowPlayingMovies')
                if (!response.ok) throw new Error('Network response was not ok')
                const data = await response.json()

                // 🔽 公開日（降順）でソート
                const sorted = data.results.sort((a, b) =>
                    new Date(b.release_date) - new Date(a.release_date)
                )

                setMovies(sorted)
            } catch (error) {
                console.error('映画の取得に失敗しました:', error)
            }
        }

        const fetchTrending = async () => {
            try {
                const response = await fetch('/api/getTrendingMovies')
                if (!response.ok) throw new Error('Trending fetch failed')
                const data = await response.json()
                setTrendingMovies(data.results)
            } catch (error) {
                console.error('人気映画の取得に失敗しました:', error)
            }
        }

        fetchMovies()
        fetchTrending()
    }, [])

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head>
                <title>Dashboard - CinemaLoveReview</title>
            </Head>

            <Search onSearch={(query) => {}} />
            <MovieList title="上映中の映画" movies={movies} />
            <MovieList title="今週の人気映画" movies={trendingMovies} />
        </AppLayout>
    )
}
