import { json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'

const BASE_URL = 'https://www.omdbapi.com/'

export async function GET({ url, fetch }) {
  const query = url.searchParams.get('q')

  if (!query) {
    return json({ error: 'Missing query parameter "q"' }, { status: 400 })
  }

  try {
    const res = await fetch(
      `${BASE_URL}?apikey=${env.OMDB_API_KEY}&s=${query}&type=movie`
    )

    const data = await res.json()

    if (data.Response === 'False') {
      return json({ error: data.Error }, { status: 404 })
    }

    return json(data.Search)
  } catch (err) {
    return json({ error: 'Failed to fetch from OMDb' }, { status: 500 })
  }
}



