<script lang="ts">
    import Markdown from "$lib/components/Markdown.svelte";
    import { Button } from "$lib/components/ui/button";
    import { Card, CardContent, CardHeader } from "$lib/components/ui/card";
    import { Badge } from "$lib/components/ui/badge";
    import {
        ChevronUp,
        ChevronDown,
        User,
        GraduationCap,
        ExternalLink,
    } from "@lucide/svelte";
    import { enhance } from "$app/forms";

    let { user } = $props();

    let isExpanded = $state(false);
</script>

<Card class="w-full">
    <CardHeader class="pb-4">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div
                    class="flex items-center gap-2 text-sm text-muted-foreground"
                >
                    <User class="h-4 w-4" />
                    <span class="font-medium">
                        {user.prenom}
                        {user.nom || ""}
                    </span>
                </div>
                <div
                    class="flex items-center gap-2 text-sm text-muted-foreground"
                >
                    <GraduationCap class="h-4 w-4" />
                    <span>Promotion {user.grad_year}</span>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <Badge href="" variant="secondary" class="text-xs">
                    {user.choisi}
                </Badge>
                <Button
                    disabled={false}
                    variant="outline"
                    size="sm"
                    href={`/restricted/anciens/${user.id}`}
                    class="flex items-center gap-1 text-xs"
                >
                    <ExternalLink class="h-3 w-3" />
                    Voir plus
                </Button>
            </div>
        </div>
    </CardHeader>

    <CardContent class="">
        {@const isTruncated = user.description && user.description.length > 300}
        <div
            class="text-sm prose prose-sm max-w-none mb-4 text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-code:text-foreground prose-blockquote:text-muted-foreground prose-li:text-foreground"
            class:truncate={isTruncated && !isExpanded}
            class:max-h-50={isTruncated && !isExpanded}
        >
            <Markdown markdown={user.description}></Markdown>
        </div>

        {#if isTruncated}
            <Button
                disabled={false}
                variant="link"
                size="sm"
                onclick={() => isExpanded = !isExpanded}
                class="p-0 h-auto text-primary hover:text-primary/80"
            >
                {isExpanded ? "Voir moins" : "Lire la suite"}
            </Button>
        {/if}

        <div
            class="flex items-center justify-between pt-4 border-t border-border"
        >
            <form class="flex items-center gap-4" method="POST" use:enhance>
                <input type="hidden" name="id" value={user.id} />
                <Button
                    disabled={false}
                    variant="ghost"
                    size="sm"
                    type="submit"
                    formaction="?/upvote"
                    class="flex items-center gap-2 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 dark:hover:text-green-400"
                >
                    <ChevronUp class="h-4 w-4" />
                    <span>{user.upvotes}</span>
                </Button>

                <Button
                    disabled={false}
                    variant="ghost"
                    size="sm"
                    type="submit"
                    formaction="?/downvote"
                    class="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                >
                    <ChevronDown class="h-4 w-4" />
                    <span>{user.downvotes}</span>
                </Button>
            </form>

            <div class="text-sm text-muted-foreground">
                Score net : {user.upvotes - user.downvotes}
            </div>
        </div>
    </CardContent>
</Card>
