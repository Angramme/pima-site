<script lang="ts">
    import { getContext } from "svelte";
    import { page } from "$app/stores";
    import type { Writable } from "svelte/store";
    import { Button } from "$lib/components/ui/button/index.js";

    const pages: string[][] = [
        ["/", "accueil"],
        ["/restricted/anciens", "anciens"],
        ["/conseils", "conseils"],
        ["/restricted/external/Google Drive", "drive"],
        // ["/restricted/faq", "FAQ"],
    ];

    const user = getContext<Writable<App.Locals["user"]>>("user");
</script>

<div class="fixed top-0 left-0 right-0 z-10">
    <nav
        class="flex flex-wrap items-center justify-end gap-2 p-4 backdrop-blur-[5px]"
    >
        <div class="grow">
            <span class="m-[5px] p-1 text-lg font-normal no-underline"
                >Æ PIMA</span
            >
        </div>
        {#each pages as [link, name]}
            <div>
                <a
                    data-sveltekit-preload-data="off"
                    data-sveltekit-preload-code="off"
                    href={link}
                    class="m-[5px] p-1 text-lg font-normal no-underline {$page
                        .url.pathname == link
                        ? 'bg-foreground text-background'
                        : ''}"
                >
                    {name}
                </a>
            </div>
        {/each}
        <div class="border-l border-foreground pl-2 my-0">
            {#if $user}
                <a
                    data-sveltekit-preload-data="off"
                    data-sveltekit-preload-code="off"
                    href="/restricted/user"
                    class="m-[5px] p-1 text-lg font-normal no-underline"
                >
                    {$user.prenom}</a
                >
                <form method="POST" action="/?/disconnect" class="inline">
                    <Button
                        disabled={false}
                        type="submit"
                        variant="link"
                        class="mx-[5px] my-0 px-1 py-0 h-[1.8rem] text-lg font-normal no-underline text-foreground align-baseline"
                        >déconnexion</Button
                    >
                </form>
            {:else}
                <a
                    data-sveltekit-preload-data="off"
                    data-sveltekit-preload-code="off"
                    href="/login"
                    class="m-[5px] p-1 text-lg font-normal no-underline"
                >
                    connexion
                </a>
            {/if}
        </div>
    </nav>
</div>
