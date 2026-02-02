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

  function printT() {
    const inputElement = document.getElementById('t-number') as HTMLInputElement
    let n: number = inputElement.valueAsNumber
    if (n < 3 || n % 2 === 0) {
      console.log('Input must be an odd number ≥ 3')
      return
    }

    const center = Math.floor(n / 2)

    // Top row
    console.log(Array(n).fill('T').join(' '))

    // Stem
    for (let i = 1; i < n; i++) {
      console.log(
        '  '.repeat(center) + 'T'
      )
    }
  }
</script>

<h2>T-printer</h2>
<div class='t-printer'>
  <Button text='Print T' on:click={printT}></Button>
  <input id='t-number' type='number'>
</div>

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