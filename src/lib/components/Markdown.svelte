<script>
    import { display_mardkown } from "$lib/utils";
    import { afterUpdate } from "svelte";
    /** @type {string} */
    export let markdown;

    /** @type {number} */
    let height;
    /** @type {HTMLElement} */
    let real;

    afterUpdate(()=>{
        height = real.offsetHeight;
    });
</script>

{#await display_mardkown(markdown)}
    <div style={`height: ${height}px`}>Chargement de Markdown... {markdown}</div>
{:then ht} 
    <p bind:this={real}>{@html ht}</p>
{/await}