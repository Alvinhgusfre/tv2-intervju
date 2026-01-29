import { writable } from 'svelte/store'
import type { Movie } from '$lib/types/movie.js'

function createFavorites() {
  const { subscribe, update, set } = writable<Movie[]>([])

  return {
    subscribe,

    add(movie: Movie) {
      update((movies) => {
        if (movies.some((m) => m.imdbID === movie.imdbID)) {
          return movies // prevent duplicates
        }
        return [...movies, movie]
      })
    },

    remove(imdbID: string) {
      update((movies) => movies.filter((m) => m.imdbID !== imdbID))
    },

    clear() {
      set([])
    }
  }
}

export const favourites = createFavorites()
