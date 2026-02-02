import { writable } from 'svelte/store'
import { browser } from '$app/environment'
import type { Movie } from '$lib/types/movie.js'

const STORAGE_KEY = 'favourite-movies'

function createFavorites() {
  const { subscribe, set, update } = writable<Movie[]>([])

  // Load from storage when running in browser
  if (browser) {
    const stored = localStorage.getItem(STORAGE_KEY)

    if (stored) {
      try {
        set(JSON.parse(stored))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }

  function persist(movies: Movie[]) {
    if (browser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(movies))
    }
  }

  return {
    subscribe,

    add(movie: Movie) {
      update((movies) => {
        if (movies.some((m) => m.imdbID === movie.imdbID)) {
          return movies
        }

        const updated = [...movies, movie]
        persist(updated)
        return updated
      })
    },

    remove(imdbID: string) {
      update((movies) => {
        const updated = movies.filter((m) => m.imdbID !== imdbID)
        persist(updated)
        return updated
      })
    },

    clear() {
      persist([])
      set([])
    }
  }
}

export const favourites = createFavorites()
