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

    function getNetScore(upvotes: number, downvotes: number) {
        return upvotes - downvotes;
    }

    function handleVote(id: string, voteType: 'upvote' | 'downvote') {
        // TODO: implement voting logic
        console.log(`Voted ${voteType} on ${id}`);
    }
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
    <div class="space-y-6">
        {#each user_profiles.sort((a, b) => getNetScore(b.upvotes, b.downvotes) - getNetScore(a.upvotes, a.downvotes)) as des (des.id)}
            <Card class="w-full">
                <CardHeader class="pb-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center gap-2 text-sm text-muted-foreground">
                                <User class="h-4 w-4" />
                                <span class="font-medium">
                                    {des.prenom} {des.nom || ""}
                                </span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-muted-foreground">
                                <GraduationCap class="h-4 w-4" />
                                <span>Promotion {des.grad_year}</span>
                            </div>
                        </div>
                        <Badge variant="secondary" class="text-xs">
                            {des.choisi}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent>
                    <div
                        class="prose prose-sm max-w-none mb-4 text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-code:text-foreground prose-blockquote:text-muted-foreground prose-li:text-foreground"
                    >
                        {@html des.description}
                    </div>

                    <div class="flex items-center justify-between pt-4 border-t border-border">
                        <div class="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                on:click={() => handleVote(des.id, "upvote")}
                                class="flex items-center gap-2 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 dark:hover:text-green-400"
                            >
                                <ChevronUp class="h-4 w-4" />
                                <span>{des.upvotes}</span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                on:click={() => handleVote(des.id, "downvote")}
                                class="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                            >
                                <ChevronDown class="h-4 w-4" />
                                <span>{des.downvotes}</span>
                            </Button>
                        </div>

                        <div class="text-sm text-muted-foreground">
                            Score net : {getNetScore(des.upvotes, des.downvotes)}
                        </div>
                    </div>
                </CardContent>
            </Card>
        {/each}
    </div>
{/await}
