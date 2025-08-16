<script lang="ts">
    import { display_mardkown } from "$lib/utils";
    import { marked } from "marked";
    export let markdown: string;

    const renderer = {
        heading(text: string, level: number, raw: string){ // make heading smaller
            const lvl = Math.min(Math.max(level, 3), 6);
            return `<h${lvl}>${text}</h${lvl}>`;
        },
        hr(){ return "<div style=\"text-align: center; margin: 1rem;\">§</div>"; }
    };

    marked.use({ renderer });

    let data: Promise<string> = display_mardkown(markdown);
     $: display_mardkown(markdown)
        .then((res)=>data = new Promise((f)=>f(res)));
</script>

{#await data}
    <div>[Chargement et sanitation de Markdown...] {markdown}</div>
{:then ht} 
    <p>{@html ht}</p>
{/await}
