import { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function LikeButton({ movieId }) {
  const [liked, setLiked] = useState(false);
  const userId = 1; // 仮ユーザーID（あとで認証連携へ）

  // 初回読み込みでいいねチェック
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/likes/check?movie_id=${movieId}&user_id=${userId}`);
        const data = await res.json();
        setLiked(data.liked);
      } catch (error) {
        console.error('❌ いいね状態取得失敗:', error);
      }
    };

    fetchLikeStatus();
  }, [movieId]);

  // クリック時の処理
  const handleLikeClick = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/likes', {
        method: liked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          movie_id: movieId,
          user_id: userId,
        }),
      });

      if (res.ok) {
        setLiked(!liked);
      } else {
        const error = await res.json();
        console.error('❌ エラー:', error);
      }
    } catch (error) {
      console.error('❌ 通信失敗:', error);
    }
  };

  return (
    <IconButton onClick={handleLikeClick}>
      {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
    </IconButton>
  );
}
