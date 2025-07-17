import React from 'react'
import { Box, Typography } from '@mui/material'

export default function MovieDetail({ movie }) {
    if (!movie) {
        return <Typography>映画情報がありません。</Typography>
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
                {movie.title}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
                {movie.overview}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
                公開日: {movie.release_date}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
                評価: {movie.vote_average}
            </Typography>
        </Box>
    )
}
