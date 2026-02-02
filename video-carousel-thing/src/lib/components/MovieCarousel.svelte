<script lang="ts">
  import { createEventDispatcher } from "svelte"; // Not actually deprecated
  import type { Movie } from "$lib/types/movie.js";
  import Button from "./Button.svelte";
  import { onMount } from "svelte";

  // export let query = 'Batman'
  export let movies: Movie[] = []
  export let mode: 'browse' | 'favourites' = 'browse'

  onMount(() => {
    updateArrows()
  })

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

  let isDown = false
  let isDragging = false
  let startX = 0
  let scrollStart = 0

  const DRAG_THRESHOLD = 6

  function pointerDown(e: PointerEvent) {
    isDown = true
    isDragging = false

    startX = e.clientX
    scrollStart = carousel.scrollLeft
  }

  function pointerMove(e: PointerEvent) {
    if (!isDown) return

    const dx = e.clientX - startX

    // Only start dragging after threshold
    if (!isDragging && Math.abs(dx) > DRAG_THRESHOLD) {
      isDragging = true
      carousel.setPointerCapture(e.pointerId)
      carousel.classList.add('dragging')
    }

    if (!isDragging) return

    carousel.scrollLeft = scrollStart - dx
  }

  function pointerUp(e: PointerEvent) {
    if (isDragging) {
      try {
        carousel.releasePointerCapture(e.pointerId)
      } catch {}
    }

    isDown = false
    isDragging = false
    carousel.classList.remove('dragging')
  }

  // Arrow logic
  let canScrollLeft = false
  let canScrollRight = true

  function updateArrows() {
    if (!carousel) return

    canScrollLeft = carousel.scrollLeft > 5
    canScrollRight =
      carousel.scrollLeft + carousel.clientWidth <
      carousel.scrollWidth - 5
  }

  function scrollByCard(direction: 'left' | 'right') {
    const card = carousel.querySelector('.card') as HTMLElement
    if (!card) return

    const gap = parseFloat(getComputedStyle(carousel).gap || '0')
    const amount = card.offsetWidth + gap

    carousel.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth'
    })
  }
</script>

<div class="carousel-wrapper">
  <button
    class="arrow left"
    on:click={() => scrollByCard('left')}
    disabled={!canScrollLeft}
    aria-label="Scroll left"
  >
    ◀
  </button>

  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <div
    class="carousel"
    bind:this={carousel}
    role="region"
    aria-label="Movie carousel"
    aria-roledescription="carousel"
    tabindex="0"
    on:pointerdown={pointerDown}
    on:pointermove={pointerMove}
    on:pointerup={pointerUp}
    on:pointerleave={pointerUp}
    on:pointercancel={pointerUp}
    on:scroll={updateArrows}
  >
    {#each movies as movie}
      <div class='card'>
        <div class="poster">
          <img
            src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'}
            alt={movie.Title}
            loading="lazy"
          />
        </div>
        <div class='action-btn'>
          <Button
            text={mode === 'browse' ? '❤️ Add' : '❌ Remove'}
            on:click={() => mode === 'browse' ? handleAdd(movie) : handleRemove(movie.imdbID)}
          >
          </Button>
        </div>
      </div>
    {/each}
  </div>

  <button
    class="arrow right"
    on:click={() => scrollByCard('right')}
    disabled={!canScrollRight}
    aria-label="Scroll right"
  >
    ▶
  </button>
</div>

<style>
  .carousel {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    scroll-snap-type: x proximity;
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    padding: 1rem;
    scrollbar-width: none;       
    cursor: grab;
  }
  .carousel::-webkit-scrollbar {
    display: none;
  }
  .carousel:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 4px;
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

    scroll-snap-align: start;
    user-select: none;
    pointer-events: auto;

    flex: 0 0 auto;
    will-change: transform;
  }
  .card:hover {
    .poster {
      transform-origin: bottom;
      transform: scale(1.05);
      border: 2px solid var(--color-accent-1);
    }

    .action-btn {
      visibility: visible;
      opacity: 1;
      transition-delay: .1s;
    }
  }
  .card:focus {
    border: 2px solid var(--color-accent-1);
  }
  .action-btn {
    position: absolute;
    left: 10px;
    bottom: 10px;
    opacity: 0;
    transition: opacity 0.5s ease, visibility 0.5s;
    transition-delay: .1s;
  }

  .poster {
    width: 100%;
    aspect-ratio: 2 / 3;
    overflow: hidden;
    border-radius: 4px;
    background: #111;
    position: relative;

    pointer-events: none;
    box-sizing: border-box;
    border: 2px solid transparent;
    transition: transform 0.2s ease, border-color 0.2s ease;
  }

  .poster img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform .2s ease;

    -webkit-user-drag: none;
    user-select: none;
    pointer-events: none;
  }


  /* Arrows */
  .carousel-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .arrow {
    position: absolute;
    z-index: 10;
    width: 5em;
    height: 5em;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: transform 0.2s ease, opacity 0.2s ease;
  }

  .carousel-wrapper .arrow {
    opacity: 0;
  }

  .carousel-wrapper:hover .arrow {
    opacity: 1;
  }

  .arrow:hover:not(:disabled) {
    transform: scale(1.1);
  }

  .carousel-wrapper:hover .arrow:disabled {
    opacity: 0.3;
    cursor: default;
  }

  .arrow.left {
    left: 8px;
  }

  .arrow.right {
    right: 8px;
  }


</style>