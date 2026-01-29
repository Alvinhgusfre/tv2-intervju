/** @param {String} query */
export async function fetchMovies(query) {
  const res = await fetch(`/api/movies?q=${encodeURIComponent(query)}`)

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to fetch movies')
  }

  return res.json()
}

export async function fetchRandomMovies() {
  const res = await fetch(`/api/randomMovies`)

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to fetch random movies')
    }

  return res.json()
}
