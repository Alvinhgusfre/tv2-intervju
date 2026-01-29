<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Movie } from "$lib/types/movie.js";
  import Button from "./Button.svelte";

  export let query = 'Batman'
  export let movies: Movie[] = []
  export let mode: 'browse' | 'favourites' = 'browse'

  // Logic for adding and removing favourite movies
  const dispatch = createEventDispatcher<{
    add: Movie
    remove: string
  }>()

  function handleAdd(movie: Movie) {
    dispatch('add', movie)
  }

  function handleRemove(imdbID: string) {
    dispatch('remove', imdbID)
  }


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
      <div class='action-btn'>
        <Button
          text={mode === 'browse' ? '❤️ Add' : '❌ Remove'}
          on:click={() =>
            mode === 'browse'
              ? handleAdd(movie)
              : handleRemove(movie.imdbID)
          }
        >
        </Button>
      </div>
    </div>
  {/each}
</div>




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
    position: relative;
  }


  .action-btn {
    position: absolute;
    left: 10px;
    bottom: 10px;
    opacity: 0;
    transition: opacity 0.5s ease, visibility 0.5s;
    transition-delay: 1s;
  }

  .card:hover {
    transform: scale(1.05);

    .action-btn {
      visibility: visible;
      opacity: 1;
      transition-delay: .5s;
    }
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