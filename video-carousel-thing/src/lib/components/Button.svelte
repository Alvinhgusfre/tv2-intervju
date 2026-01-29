<script lang="ts">
  import '$lib/themes/default.css'

  export let size = 'auto';
  export let text = 'Click me'

</script>

<button style='width:{size}em' on:click>{text}</button>

<style>
  button {
    border: none;
    border-radius: 4px;
    background: var(--color-primary);
    color: var(--color-base-on-text);
    padding: .5em 1em;
  }
  button:hover {
    background: var(--color-primary-hover);
    cursor: pointer;
    transform: scale(1.05);
  }
</style>