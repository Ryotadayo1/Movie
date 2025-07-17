// getNowPlayingMovies.js
export default async function handler(req, res) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`
  )
  const data = await response.json()
  res.status(200).json(data)
}
