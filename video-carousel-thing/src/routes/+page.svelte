<script lang="ts">

import MovieCarousel from "$lib/components/MovieCarousel.svelte";
import { favourites } from "$lib/stores/favourites.js";
import { fetchRandomMovies } from "$lib/api/movies.js";
import type { Movie } from "$lib/types/movie.js";
import Button from "$lib/components/Button.svelte";

let randomMovies: Movie[] = []
let loading = true
let error = null

async function loadMovies() {
    loading = true
    error = null

    try {
      const res = await fetchRandomMovies()
      randomMovies = res.movies ?? res
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load movies'
    } finally {
      loading = false
    }
  }

loadMovies()

function addToFavourites(e: CustomEvent<Movie>) {
  favourites.add(e.detail)
}

function removeFromFavourites(e: CustomEvent<string>) {
  favourites.remove(e.detail)
}

//#100118
</script>

{#if loading}
  <p class='loading'>Loading...</p>
{:else if error}
  <p class='error'>{error}</p>
{:else}
  <h2>Uforsk</h2>
  <Button text='Refresh' on:click={loadMovies}></Button>
  <MovieCarousel movies={randomMovies} mode='browse' on:add={addToFavourites}></MovieCarousel>
{/if}
<h2>Mine favoritter</h2>
<MovieCarousel movies={$favourites} mode='favourites' on:remove={removeFromFavourites}></MovieCarousel>