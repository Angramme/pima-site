<script>
    import { afterUpdate } from "svelte";

    /** @type {boolean} */
    export let default_open = false;
    /** @type {string} */
    export let closed_height = "15vh";

    let open = default_open;
    let plus_needed = true;

    /** @type {HTMLElement}*/
    let main;

    afterUpdate(()=>{
        plus_needed = open || main.scrollHeight != main.clientHeight;
    });
</script>

<div bind:this={main} class="main" style={open ? "" : `max-height: ${closed_height};`}>
    <slot>
        No content provided...
    </slot>
</div>
{#if plus_needed}
    <div class="plus">
        <button on:click={()=>open=!open}>{open ? "- cacher -" : "+ afficher plus +"}</button>
    </div>
{/if}

<style>
    div.main{
        overflow-y: scroll;
        overflow-x: scroll;
    }
    .plus{
        margin-top: 0.5rem;
        text-align: center;
    }
</style>