// frontend/src/pages/api/[id].js

export default async function handler(req, res) {
  const { id } = req.query;
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (!id) {
    return res.status(400).json({ error: 'Movie ID is required.' });
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=ja-JP`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Failed to fetch movie details' });
  }
}

