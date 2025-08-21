<script lang="ts">
    // import anciens_r from "$data/contact-anciens.json"

    import Banner from "$lib/components/Banner.svelte";
    import { parse_ast, ast_match } from "$lib/search";
    import { Search } from "@lucide/svelte"
    // import { Input } from "$lib/components/ui/input"
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card"
    import { Badge } from "$lib/components/ui/badge"
    import AnciensProfileCard from "$lib/components/AnciensProfileCard.svelte";

    let { data }: { data: import('./$types').PageData } = $props();

    let search_term = $state<string>("");
    const ast_term = $derived(parse_ast(search_term));
    $effect(() => { if (ast_term) console.log(ast_term); });

    const anciens_P = $derived(data.streamed.users
        .then((v: any[])=>
            v.map((d: any)=>{
                // @ts-ignore
                if(d.admin) d._admin = "admin";
                return d;
            })
            // @ts-ignore
            .filter(o=>!ast_term ? true : ast_match(ast_term, Object.values(o), o))));

    let show_hint = $state(false);
    let selectedId = $state<string | null>(null);
    let selectedProfile = $state<any>(null);
    let isLoadingProfile = $state<boolean>(false);
    let adminConfirm = $state<string>("");

    async function openProfile(userId: string){
        selectedId = userId;
        isLoadingProfile = true;
        try{
            const res = await fetch(`/restricted/anciens/api/${encodeURIComponent(userId)}`);
            if(!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            selectedProfile = data.subject ?? data; // support both shapes
        }catch(e){
            console.error(e);
            selectedProfile = null;
        }finally{
            isLoadingProfile = false;
        }
    }
    function closeProfile(){
        selectedId = null;
        selectedProfile = null;
        adminConfirm = "";
    }

    async function grantAdmin(){
        if(!selectedId) return;
        const res = await fetch(`/restricted/anciens/api/${encodeURIComponent(selectedId)}/admin`, { method: "POST", headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ grant: true }) });
        let ok = res.ok; let msg = '';
        try { const j = await res.json(); ok = ok && !j?.error; msg = j?.error || ''; } catch {}
        if(ok){ selectedProfile && (selectedProfile.admin = true); alert('Droits admin accordés'); }
        else { alert(msg || 'Erreur lors de la mise à jour'); }
    }
    async function revokeAdmin(){
        if(!selectedId) return;
        const res = await fetch(`/restricted/anciens/api/${encodeURIComponent(selectedId)}/admin`, { method: "POST", headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ grant: false }) });
        let ok = res.ok; let msg = '';
        try { const j = await res.json(); ok = ok && !j?.error; msg = j?.error || ''; } catch {}
        if(ok){ selectedProfile && (selectedProfile.admin = false); alert('Droits admin retirés'); }
        else { alert(msg || 'Erreur lors de la mise à jour'); }
    }
    async function deleteUser(login_confirm: string){
        if(!selectedId || !selectedProfile) return;
        const yes = confirm("Confirmer la suppression de cet utilisateur ? Cette action est irréversible.");
        if(!yes) return;
        const res = await fetch(`/restricted/anciens/api/${encodeURIComponent(selectedId)}/delete`, { method: "POST", headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ login_confirm }) });
        let ok = res.ok; let msg = '';
        try { const j = await res.json(); ok = ok && !j?.error; msg = j?.error || ''; } catch {}
        if(ok){
            alert('Utilisateur supprimé');
            closeProfile();
            window.location.reload();
        } else {
            alert(msg || 'Erreur lors de la suppression');
        }
    }
</script>

<Banner src="/img/banners/4.jpg" 
    title="Anciens"
    />

<p>
    Exemples d'utilisation <button onclick={() => (show_hint = !show_hint)}>{show_hint ? "cacher" : "afficher"}</button>: 
    
</p>
{#if show_hint}
<ul>
    <li>Trouver une personne: taper son nom ou prenom, par exemple "fred"</li>
    <li>Recherche par mot clef: taper le mot clef, par exemple "ingé", cela cherche dans toutes les proprietes</li>
    <li>Sinon il y a 3 operateurs
        <ul>
            <li>| ou logique</li>
            <li>& et logique</li>
            <li>: inclusion</li>
        </ul>
    </li>
    <li>Trouver tout le monde admis a l'X: taper "admis : (poly | X)" (i.e le champ "admis" contient "poly" ou "X")</li>
    <li>Trouver des Telecom admis en 2023: taper "(admis:tele) & (grad_year:2023)".</li>
    <li>Trouver des Telecom admis strictement apres 2022: taper "(admis:tele) & (grad_year:>2022)".</li>
    <li>Trouver des gens de nationalié Polonaise: taper "nationalite:(pl | polo)"</li>
    <li>Trouver tout le monde avec 18 de moyenne en L2 OU en L3: taper "(moyenneL2|moyenneL3):18" </li>
    <li>Trouver tout le monde avec au moins 15 de moyenne en L2 ET en L3: taper "(moyenneL2&moyenneL3):>14" </li>
    <li>En general vous pouvez cherchez toutes les données :)</li>
</ul>
Voici les proprietes possibles:
<ul>
{#await data.streamed.users}
    <li>Chargement...</li>
{:then dat} 
    {#each Object.keys(dat[0]) as k}
        <li>{k}</li>
    {/each}
{/await}
</ul>
{/if}

<div class="relative mt-3">
    <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
    <input
        type="text"
        placeholder="Rechercher par nom, université, année..."
        bind:value={search_term}
        class="border-input bg-background selection:bg-primary dark:bg-input/30 selection:text-primary-foreground ring-offset-background placeholder:text-muted-foreground shadow-xs flex h-12 w-full min-w-0 rounded-md border pl-10 pr-3 py-1 text-base outline-none transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50"
    />
</div>
<p class="text-sm m-2 mb-8">
    Les informations présentes ont été fournies par les élèves eux-mêmes avec leur consentement.
</p>


<div class="mb-6">
    {#await anciens_P}
        <p class="text-sm text-muted-foreground">Recherche en cours...</p>
    {:then anciens}
        <p class="text-sm text-muted-foreground">
            {anciens.length} résultat{anciens.length === 1 ? "" : "s"} trouvé{anciens.length === 1 ? "" : "s"}
        </p>
    {/await}
</div>

{#await anciens_P}
    <p>Chargement...</p>
{:then anciens}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each anciens as data (data.id)}
            <button type="button" class="card-link text-left" onclick={() => openProfile(data.id)}>
                <Card class="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:bg-accent/50 h-full w-full">
                    <CardHeader class="pb-0">
                        <CardTitle class="text-base font-semibold text-foreground leading-none {data.sleeping ? 'sleeper' : ''} {data.admin ? 'admin' : ''}">
                            {data.prenom} {data.nom || ''}
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="pt-0 space-y-2 text-xs">
                        <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 items-center">
                            <Badge variant="secondary" class="" href="">
                                Suite
                            </Badge>
                            <span class="text-muted-foreground truncate">{data.choisi || "non renseigné"}</span>
                            
                            <Badge variant="secondary" class="" href="">
                                Travail
                            </Badge>
                            <span class="text-muted-foreground truncate">{data.travails.join(', ') || "non renseigné"}</span>

                            <Badge variant="secondary" class="" href="">
                                PIMA
                            </Badge>
                            <span class="text-muted-foreground">{data.grad_year-3}-{data.grad_year}</span>
                        </div>
                    </CardContent>
                </Card>
            </button>
        {/each}
    </div>

    {#if anciens.length === 0}
        <div class="text-center py-12">
            {#if search_term}
                <p class="text-muted-foreground text-lg">Aucun résultat trouvé pour "{search_term}"</p>
                <p class="text-muted-foreground text-sm mt-2">Essayez de chercher avec d'autres mots-clefs.</p>
            {:else}
                <p class="text-muted-foreground text-lg">Aucun ancien trouvé.</p>
            {/if}
        </div>
    {/if}
{/await}


<style>
    .sleeper{
        font-style: italic;
        color: blueviolet;
    }
    .sleeper::after{
        content: " 😴";
    }
    .admin{
        font-style: italic;
        color: green;
    }
    a.card-link, button.card-link {
        text-decoration: none;
        color: inherit;
        width: 100%;
    }

    .modal-backdrop{
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: flex-start;
        justify-content: center;
        padding: 2rem 1rem;
        z-index: 50;
        overflow: auto;
    }
    .modal-body{
        max-width: 64rem;
        width: 100%;
        background: var(--color-card);
        color: var(--color-card-foreground);
        border-radius: var(--radius-lg);
        box-shadow: 0 10px 25px rgba(0,0,0,0.25);
        padding: 1rem;
    }
</style>

{#if selectedId}
    <div class="modal-backdrop" role="dialog" aria-modal="true" onclick={(e)=>{ if(e.target === e.currentTarget) closeProfile(); }} onkeydown={(e)=>{ if(e.key === 'Escape') closeProfile(); }} tabindex="0">
        <div class="modal-body">
            {#if isLoadingProfile}
                <p class="m-4">Chargement…</p>
            {:else if selectedProfile}
                <AnciensProfileCard profile={selectedProfile} expectedLogin={selectedProfile?.login} showAdmin={Boolean(data.user?.admin)} onGrantAdmin={grantAdmin} onRevokeAdmin={revokeAdmin} onDelete={deleteUser} />
            {:else}
                <p class="m-4">Impossible de charger ce profil.</p>
            {/if}
        </div>
    </div>
{/if}
