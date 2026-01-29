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
  .container {
    margin: 0 8rem;
  }
  header {
    min-height: 3em;
  }
  h1 {
    margin: 0;
    padding: .5em 0;
  }
</style>