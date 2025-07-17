// pages/api/getMovies.js
export default async function handler(req, res) {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ja-JP`
  );
  const data = await response.json();
  res.status(200).json(data.results);
}
