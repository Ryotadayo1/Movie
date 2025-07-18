import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import laravelApiClient from '@/lib/laravelApiClient' // ✅ Laravel API クライアントを使用

export default function ReviewForm({
  onSubmit,
  reviewToEdit = null,
  addReview,
  movieId,
}) {
  const [reviewText, setReviewText] = useState('')
  const [rating, setRating] = useState(3)

  useEffect(() => {
    if (reviewToEdit) {
      setReviewText(reviewToEdit.review_text)
      setRating(reviewToEdit.rating)
    }
  }, [reviewToEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!reviewText) return

    try {
      const payload = {
        movie_id: movieId,
        review_text: reviewText,
        rating,
      }

      let res
      if (reviewToEdit) {
        // 編集
        res = await laravelApiClient.put(`/api/reviews/${reviewToEdit.id}`, payload)
      } else {
        // 新規投稿
        res = await laravelApiClient.post('/api/reviews', payload)
      }

      addReview(res.data) // レビュー一覧に反映
    } catch (err) {
      console.error('レビュー送信失敗:', err)
    }

    // フォームとモーダルの後処理
    setReviewText('')
    setRating(3)
    onSubmit()
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 800,
        margin: 'auto',
        width: '80%',
        p: 2,
        backgroundColor: '#f9f9f9',
        borderRadius: 2,
        boxShadow: 1,
        mb: 4,
      }}
    >
      <Typography variant="h6" gutterBottom>
        {reviewToEdit ? 'レビューを編集する' : 'レビューを書く'}
      </Typography>

      <TextField
        label="レビュー内容"
        multiline
        rows={4}
        fullWidth
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        label="評価（1〜5）"
        select
        fullWidth
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        sx={{ mb: 2 }}
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <MenuItem key={num} value={num}>
            {num}
          </MenuItem>
        ))}
      </TextField>

      <Button variant="contained" color="primary" type="submit">
        {reviewToEdit ? '更新する' : '投稿'}
      </Button>
    </Box>
  )
}
