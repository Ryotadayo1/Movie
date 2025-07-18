import {
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    Modal,
    Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import StarIcon from '@mui/icons-material/Star'
import CloseIcon from '@mui/icons-material/Close'
import AddIcon from '@mui/icons-material/Add'
import ReviewForm from './ReviewForm'
import laravelApiClient from '@/lib/laravelApiClient'
import { useAuth } from '@/hooks/auth'

export default function MovieReviews({ movieId }) {
    const [reviews, setReviews] = useState([])
    const [open, setOpen] = useState(false)
    const [editingReview, setEditingReview] = useState(null)
    const { user } = useAuth({ middleware: 'auth' })

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/reviews?movie_id=${movieId}`,
                )
                const data = await response.json()
                setReviews(data)
            } catch (error) {
                console.error('Error fetching reviews:', error)
            }
        }
        fetchReviews()
    }, [movieId])

    const handleOpen = () => {
        setEditingReview(null)
        setOpen(true)
    }

    const handleClose = () => {
        setEditingReview(null)
        setOpen(false)
    }

    const addReview = async ({ review_text, rating, id }) => {
        try {
            let response
            if (id) {
                // 編集モード
                response = await laravelApiClient.put(`/api/reviews/${id}`, {
                    movie_id: movieId,
                    review_text,
                    rating,
                })
            } else {
                // 新規投稿
                response = await laravelApiClient.post('/api/reviews', {
                    movie_id: movieId,
                    review_text,
                    rating,
                })
            }

            const newReview = response.data.review

            if (id) {
                // 編集反映
                setReviews((prev) =>
                    prev.map((r) => (r.id === id ? newReview : r)),
                )
            } else {
                // 新規追加
                setReviews((prev) => [...prev, newReview])
            }

            handleClose()
        } catch (error) {
            console.error('レビュー送信エラー:', error)
        }
    }

    const handleDelete = async (id) => {
        if (window.confirm('このレビューを削除してもよろしいですか？')) {
            try {
                await laravelApiClient.delete(`api/reviews/${id}`)
                setReviews(reviews.filter((r) => r.id !== id))
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handleEdit = (review) => {
        setEditingReview(review)
        setOpen(true)
    }

    return (
        <div style={{ backgroundColor: '#FFF', padding: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Button
                    variant="contained"
                    onClick={handleOpen}
                    startIcon={<AddIcon />}
                    size="large"
                    sx={{
                        border: '1px solid #B5B5B5',
                        borderRadius: '50px',
                        color: '#333333',
                        '&:hover': { backgroundColor: '#A0A0A0' },
                        fontWeight: 'bold',
                    }}
                >
                    レビューを投稿する
                </Button>
            </div>

            {/* モーダルフォーム */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxWidth: '800px',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '10px',
                    }}
                >
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            padding: '10px',
                            '& .MuiSvgIcon-root': { fontSize: '2rem' },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <ReviewForm
                        addReview={addReview}
                        onSubmit={handleClose}
                        movieId={movieId}
                        reviewToEdit={editingReview}
                    />
                </Box>
            </Modal>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
                {reviews.map((review) => (
                    <Card key={review.id} sx={{ maxWidth: 800, margin: 'auto', width: '80%', p: '10px' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant="h6" component="div">
                                    {review.user.name}
                                </Typography>

                                {review.user.id === user?.id && (
                                    <Box>
                                        <IconButton onClick={() => handleEdit(review)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(review.id)} sx={{ color: 'red' }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                )}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                                {[...Array(review.rating)].map((_, index) => (
                                    <StarIcon key={index} color="primary" sx={{ fontSize: '40px' }} />
                                ))}
                                {[...Array(5 - review.rating)].map((_, index) => (
                                    <StarIcon key={index} color="disabled" sx={{ fontSize: '40px' }} />
                                ))}
                                <Typography variant="body1" sx={{ marginLeft: 1 }}>
                                    ({review.rating}/5)
                                </Typography>
                            </Box>
                            <Typography sx={{ fontSize: '20px', mt: '10px' }}>
                                {review.review_text}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ marginBottom: 1, textAlign: 'right' }}
                            >
                                {new Date(review.created_at).toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </div>
    )
}
