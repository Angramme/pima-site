<script lang="ts">
    import Banner from "$lib/components/Banner.svelte";
    import Markdown from "$lib/components/Markdown.svelte";
    import Rolldown from "$lib/components/Rolldown.svelte";
    import { Button } from "$lib/components/ui/button"
    import { Card, CardContent, CardHeader } from "$lib/components/ui/card"
    import { Badge } from "$lib/components/ui/badge"
    import { ChevronUp, ChevronDown, User, GraduationCap } from "@lucide/svelte"
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";

    let { data } = $props();

    const user = getContext<Writable<App.Locals['user']>>("user");
</script>

<Banner title="Conseils" src="/img/banners/5.jpg" />

<h1>Conseils des anciens</h1>

<p>
    Conseils des anciens du parcours listés par l'ordre de plus récent (année
    fin L3).
</p>

{#if !$user}
    <p>
        ⚠️ Vous voyez uniquement les conseils des anciens qui ont été partagés publiquement. <a data-sveltekit-preload-data="off" data-sveltekit-preload-code="off" href="/login">Connectez-vous</a> pour voir tous les conseils. ⚠️
    </p>
{/if}

<br />

{#await data.streamed.descs}
    Chargement...
{:then user_profiles}
    {#each user_profiles as des}
        <!-- TODO... -->
    {/each}
{/await}
