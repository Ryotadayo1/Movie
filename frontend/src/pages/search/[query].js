import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, CircularProgress, Grid, Typography } from '@mui/material'
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import Search from '@/components/Search'
import Link from 'next/link'

export default function SearchResults() {
    const router = useRouter()
    const { query } = router.query
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(
                    `/api/getSearchResults?query=${query}`
                )
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                const data = await response.json()
                setMovies(data.results)
            } catch (error) {
                console.error('Error fetching movies:', error)
            } finally {
                setLoading(false)
            }
        }

        if (query) {
            fetchMovies()
        }
    }, [query])

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <CircularProgress />
            </Box>
        )
    }

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    検索結果
                </h2>
            }
        >
            <Head>
                <title>検索結果 - CinemaLoveReview</title>
            </Head>

            <Search onSearch={() => {}} />

            <Box py={3} px={5}>
                <Box maxWidth="lg" mx="auto">
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
                        「{query}」の検索結果
                    </Typography>
                    <Grid container spacing={3}>
                        {movies.map((movie) => (
                            <Grid item xs={12} sm={6} md={4} key={movie.id}>
                                <Link href={`/detail/movie/${movie.id}`} passHref>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            cursor: 'pointer',
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            '&:hover': {
                                                opacity: 0.8,
                                            },
                                        }}
                                    >
                                        <img
                                            src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                                            alt={movie.title}
                                            style={{
                                                width: '100%',
                                                height: '500px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            sx={{ mt: 2 }}
                                        >
                                            {movie.title}
                                        </Typography>
                                    </Box>
                                </Link>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Box>
        </AppLayout>
    )
}
