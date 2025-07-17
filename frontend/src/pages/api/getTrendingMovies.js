export default async function handler(req, res) {
    const API_KEY = process.env.TMDB_API_KEY

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=ja`
        )

        if (!response.ok) {
            throw new Error('Failed to fetch trending movies')
        }

        const data = await response.json()
        res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: 'Trending movies fetch failed' })
    }
}
