<script lang="ts">
    import { display_mardkown } from "$lib/utils";
    import { marked } from "marked";
    import type { RendererObject } from 'marked';

    let { markdown } = $props();

    const renderer: RendererObject = {
        heading(text: string, level: number, raw: string) {
            return `<h1 class="text-2xl mt-4">${text}</h1>`;
        },
        hr() {
            return '<div style="text-align: center; margin: 1rem;">§</div>';
        },
        paragraph(text) {
            return `<div class="my-4">${text}</div>`;
        },
        list(body, ordered, start) {
            return `<ul class="list-decimal ml-4 mb-3">${body}</ul>`;
        },
    };

    marked.use({ renderer });

    let data: Promise<string> = $derived(
        display_mardkown(markdown).then(
            (res) => (data = new Promise((f) => f(res))),
        ),
    );
</script>

{#await data}
    <div>[Chargement et sanitation de Markdown...] {markdown}</div>
{:then ht}
    <p>{@html ht}</p>
{/await}