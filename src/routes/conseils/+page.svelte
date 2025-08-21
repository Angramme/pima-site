<script lang="ts">
    import Banner from "$lib/components/Banner.svelte";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import Conseil from "$lib/components/Conseil.svelte";

    let { data } = $props();

    const user = getContext<Writable<App.Locals["user"]>>("user");

    let expandedTips = $state(new Set<string>());

    function toggleExpanded(id: string) {
        if (expandedTips.has(id)) {
            expandedTips.delete(id);
        } else {
            expandedTips.add(id);
        }
        expandedTips = expandedTips;
    }

    function getNetScore(upvotes: number, downvotes: number) {
        return upvotes - downvotes;
    }
</script>

<Banner title="Conseils" src="/img/banners/5.jpg" />

{#if !$user}
    <p>
        ⚠️ Vous voyez uniquement les conseils des anciens qui ont été partagés
        publiquement. <a
            data-sveltekit-preload-data="off"
            data-sveltekit-preload-code="off"
            href="/login">Connectez-vous</a
        > pour voir tous les conseils. ⚠️
    </p>
{/if}

<br />

{#await data.streamed.descs}
    Chargement...
{:then user_profiles}
    <div class="space-y-6">
        {#each user_profiles.sort((a, b) => getNetScore(b.upvotes, b.downvotes) - getNetScore(a.upvotes, a.downvotes)) as des (des.id)}
            <Conseil user={des} />
        {/each}
    </div>
{/await}
