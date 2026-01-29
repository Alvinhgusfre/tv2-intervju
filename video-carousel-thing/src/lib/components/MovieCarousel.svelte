<script lang="ts">
  import { onMount } from "svelte";
  import { fetchMovies, fetchRandomMovies } from "$lib/api/movies.js";
  import type { Movie } from "$lib/types/movie.js";
  import Button from "./Button.svelte";

  export let query = 'Batman'

  let movies: Movie[] = []
  let error = null
  let loading = true
  
  async function loadMovies() {
    loading = true
    error = null

    try {
      movies = await fetchRandomMovies()
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load movies'
    } finally {
      loading = false
    }
  }
  onMount(loadMovies)


  // Drag & Scroll behaviour
  let carousel: HTMLDivElement

  let isDragging = false
  let startX = 0
  let scrollLeft = 0

  function onWheel(e: WheelEvent) {
    e.preventDefault()
    carousel.scrollLeft += e.deltaY
  }

  function onMouseDown(e: MouseEvent) {
    isDragging = true
    startX = e.pageX - carousel.offsetLeft
    scrollLeft = carousel.scrollLeft

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  function onMouseMove(e: MouseEvent) {
    if (!isDragging) return
    const x = e.pageX - carousel.offsetLeft
    const walk = (x - startX) * 1.5
    carousel.scrollLeft = scrollLeft - walk
  }

  function onMouseUp() {
    isDragging = false
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  // Touch support
  function onTouchStart(e: TouchEvent) {
    isDragging = true
    startX = e.touches[0].pageX - carousel.offsetLeft
    scrollLeft = carousel.scrollLeft

    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', onTouchEnd)
  }

  function onTouchMove(e: TouchEvent) {
    if (!isDragging) return
    const x = e.touches[0].pageX - carousel.offsetLeft
    const walk = (x - startX) * 1.5
    carousel.scrollLeft = scrollLeft - walk
  }

  function onTouchEnd() {
    isDragging = false
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchend', onTouchEnd)
  }
 
  function onKeyDown(e: KeyboardEvent) {
  const STEP = 200

    if (e.key === 'ArrowRight') {
      carousel.scrollLeft += STEP
      e.preventDefault()
    }

    if (e.key === 'ArrowLeft') {
      carousel.scrollLeft -= STEP
      e.preventDefault()
    }
  }
</script>

{#if loading}
  <p class='loading'>Loading...</p>
{:else if error}
  <p class='error'>{error}</p>
{:else}
  <Button text='Refresh' on:click={loadMovies}></Button>
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="carousel"
    bind:this={carousel}
    role="region"
    aria-label="Movie carousel"
    aria-roledescription="carousel"
    tabindex="0"
    on:wheel={onWheel}
    on:mousedown={onMouseDown}
    on:touchstart={onTouchStart}
    on:keydown={onKeyDown}
  >
    {#each movies as movie}
      <div class='card'>
        <img src={movie.Poster != 'N/A' ? movie.Poster : '/placeholder.png'} alt={movie.Title}>
      </div>
    {/each}
  </div>
{/if}

<style>
  .carousel {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding: 1rem;
    scroll-behavior: smooth;
    scrollbar-width: none;       
    -ms-overflow-style: none;
    cursor: grab;
  }

  .carousel:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 4px;
  }

  .carousel::-webkit-scrollbar {
    display: none;
  }

  .card {
    display: flex;
    flex-direction: column;
    min-width: 200px;
    max-width: 200px;
    scroll-snap-align: start;
    border-radius: 8px;
    text-align: center;
    transition: transform 0.2s;
    flex-shrink: 0;
    user-select: none;
  }

  .card:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    border-radius: 4px;
  }

  h3 {
    font-size: 1rem;
    margin: 0.5rem 0 0.25rem;
  }

  p {
    font-size: 0.8rem;
    color: #aaa;
  }

  .error {
    color: red;
  }
</style>