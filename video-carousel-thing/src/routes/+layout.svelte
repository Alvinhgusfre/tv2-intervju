<script lang="ts">
  import '$lib/themes/default.css'
</script>

<div class='container'>
  <header>
    <h1>Filmkarusell</h1>
  </header>

  <main>
    <slot />
  </main>

  <footer>

  </footer>
</div>

<style>
  main {
    margin: 0 8rem;
  }
  header {
    min-height: 3em;
    background: var(--color-primary);
    width: 100%;
  }
  header h1 {
    margin: 0 8rem;
    padding: .5em 0;
  }
  @media (max-width: 600px) {
    main {
      margin: 0 1rem;
    }
    header h1 {
      margin: 0 1rem;
    }
  }
</style>