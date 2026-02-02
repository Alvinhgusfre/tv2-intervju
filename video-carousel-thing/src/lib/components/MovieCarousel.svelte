<script lang="ts">
  import { createEventDispatcher } from "svelte"; // Not actually deprecated
  import type { Movie } from "$lib/types/movie.js";
  import Button from "./Button.svelte";

  // export let query = 'Batman'
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
  let scrollStart = 0
  let velocity = 0
  let rafId = 0

  const friction = 1.5

  function onPointerDown(e: PointerEvent) {
    if ((e.target as HTMLElement).closest('button')) return
    isDragging = true
    startX = e.clientX
    scrollStart = carousel.scrollLeft
    velocity = 0

    carousel.setPointerCapture(e.pointerId)
    cancelAnimationFrame(rafId)
  }

  function onPointerMove(e: PointerEvent) {
    if (!isDragging) return

    const dx = e.clientX - startX
    const prev = carousel.scrollLeft

    carousel.scrollLeft = scrollStart - dx
    velocity = carousel.scrollLeft - prev
  }

  function releasePointer(e: PointerEvent) {
    if (!isDragging) return

    isDragging = false

    try {
      carousel.releasePointerCapture(e.pointerId)
    } catch {}

    applyMomentum()
  }

  function applyMomentum() {
    function frame() {
      velocity *= friction
      carousel.scrollLeft += velocity

      if (Math.abs(velocity) > 0.5) {
        rafId = requestAnimationFrame(frame)
      } else {
        snapToCard()
      }
    }

    rafId = requestAnimationFrame(frame)
  }

  function snapToCard() {
    const card = carousel.querySelector('.card') as HTMLElement
    if (!card) return

    const gap = parseFloat(getComputedStyle(carousel).gap || '0')
    const cardWidth = card.offsetWidth + gap

    const index = Math.round(carousel.scrollLeft / cardWidth)

    carousel.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    })
  }

  function onWheelNative(e: WheelEvent) {
    e.preventDefault()
    carousel.scrollLeft += e.deltaY
  }

  // Attach non-passive wheel listener
  function setupWheel(node: HTMLElement) {
    const handler = (e: WheelEvent) => onWheelNative(e)

    node.addEventListener('wheel', handler, { passive: false })

    return {
      destroy() {
        node.removeEventListener('wheel', handler)
      }
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
  on:pointerdown={onPointerDown}
  on:pointermove={onPointerMove}
  on:pointerup={releasePointer}
  on:pointerleave={releasePointer}
  on:pointercancel={releasePointer}
  on:lostpointercapture={releasePointer}
  use:setupWheel
>
  {#each movies as movie}
    <div class='card'>
      <img src={movie.Poster != 'N/A' ? movie.Poster : '/placeholder.png'} alt={movie.Title}>
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

<style>
  .carousel {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    overscroll-behavior-x: contain;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    padding: 1rem;
    scrollbar-width: none;       
    cursor: pointer;
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
    flex: 0 0 auto;
    will-change: transform;
  }
  .card:hover {
    img {
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

  img {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    border-radius: 4px;

    -webkit-user-drag: none;
    user-select: none;
    pointer-events: none;
  }

</style>