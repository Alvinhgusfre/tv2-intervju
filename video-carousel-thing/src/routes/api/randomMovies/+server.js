import { json } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'

const BASE_URL = 'https://www.omdbapi.com/'

const RANDOM_TERMS = [
  'a',
  'e',
  'i',
  'o',
  'u',
  'man',
  'love',
  'the',
  'dark',
  'star'
]

/** @param {String[]} arr */
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomPage() {
  return Math.floor(Math.random() * 5) + 1
}

/**
 * 
 * @param {*} fetch 
 * @param {String} term 
 * @param {Number} page 
 * @returns 
 */
async function fetchSearch(fetch, term, page) {
  const res = await fetch(
    `${BASE_URL}?apikey=${env.OMDB_API_KEY}&s=${term}&type=movie&page=${page}`
  )

  const data = await res.json()

  if (data.Response === 'False') {
    return []
  }

  return data.Search
}

/** @param {*} fetch */
async function getRandomMovies(fetch, count = 20) {
  const movies = new Map()
  let attempts = 0
  const MAX_ATTEMPTS = 15

  while (movies.size < count && attempts < MAX_ATTEMPTS) {
    attempts++

    const term = randomItem(RANDOM_TERMS)
    const page = randomPage()

    const results = await fetchSearch(fetch, term, page)

    for (const movie of results) {
      movies.set(movie.imdbID, movie)
      if (movies.size >= count) break
    }
  }

  return Array.from(movies.values())
}

export const GET = async ({ fetch }) => {
  try {
    const movies = await getRandomMovies(fetch, 20)
    return json(movies)
  } catch (err) {
    return json({ error: 'Failed to fetch random movies' }, { status: 500 })
  }
}
