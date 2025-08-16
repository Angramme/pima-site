<script lang="ts">
    import links from "$data/external-links.json";
    import Banner from "$lib/components/Banner.svelte";
    import { Button } from "$lib/components/ui/button";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { MessageCircle, Linkedin, FolderOpen, Lock } from "@lucide/svelte";

    export let data: import("./$types").PageData;
    $: isLoggedIn = !!data.user;
</script>

<Banner src="/img/banners/1.jpg" />

<h1 class="text-2xl font-normal no-underline">
    <span class="block"><b>D</b>ouble</span>
    <span class="block"><b>M</b>ajeure</span>
    <span class="block"><b>M</b>athématiques</span>
    <span class="block"><b>I</b>nformatique</span>
</h1>

<p class="my-[5pt] text-justify">
    Site <i>non-officiel</i> DMMI/PIMA.
    <br />"Æ PIMA" : "Anciens-Etudiants-du-Parcours-PIMA"
</p>

<!-- <section class="w-full my-12">
    <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
    >
        <Card class="flex flex-col {!isLoggedIn ? 'opacity-60' : ''}">
            <CardHeader class="text-center">
                <div
                    class="mx-auto mb-4 p-3 bg-muted rounded-full w-fit relative"
                >
                    <MessageCircle class="h-8 w-8 text-muted-foreground" />
                    {#if !isLoggedIn}
                        <div
                            class="absolute -top-1 -right-1 bg-background border rounded-full p-1"
                        >
                            <Lock class="h-3 w-3 text-muted-foreground" />
                        </div>
                    {/if}
                </div>
                <CardTitle class="text-xl font-semibold">Discord</CardTitle>
                <CardDescription class=""
                    >Rejoignez notre serveur Discord pour échanger avec la
                    communauté</CardDescription
                >
            </CardHeader>
            <CardContent class="text-center flex-1 flex flex-col">
                <p class="text-sm text-muted-foreground mb-6 flex-1">
                    Discutez en temps réel, posez vos questions et partagez vos
                    expériences avec d'autres étudiants.
                </p>
                <Button class="w-full" disabled={!isLoggedIn}>
                    {isLoggedIn ? "Rejoindre Discord" : "Connexion requise"}
                </Button>
            </CardContent>
        </Card>

        <Card class="flex flex-col {!isLoggedIn ? 'opacity-60' : ''}">
            <CardHeader class="text-center">
                <div
                    class="mx-auto mb-4 p-3 bg-muted rounded-full w-fit relative"
                >
                    <Linkedin class="h-8 w-8 text-muted-foreground" />
                    {#if !isLoggedIn}
                        <div
                            class="absolute -top-1 -right-1 bg-background border rounded-full p-1"
                        >
                            <Lock class="h-3 w-3 text-muted-foreground" />
                        </div>
                    {/if}
                </div>
                <CardTitle class="text-xl font-semibold">LinkedIn</CardTitle>
                <CardDescription class=""
                    >Connectez-vous avec notre réseau professionnel</CardDescription
                >
            </CardHeader>
            <CardContent class="text-center flex-1 flex flex-col">
                <p class="text-sm text-muted-foreground mb-6 flex-1">
                    Développez votre réseau professionnel et découvrez des
                    opportunités de carrière.
                </p>
                <Button class="w-full" disabled={!isLoggedIn}>
                    {isLoggedIn ? "Suivre sur LinkedIn" : "Connexion requise"}
                </Button>
            </CardContent>
        </Card>

        <Card
            class="flex flex-col md:col-span-2 lg:col-span-1 {!isLoggedIn
                ? 'opacity-60'
                : ''}"
        >
            <CardHeader class="text-center">
                <div
                    class="mx-auto mb-4 p-3 bg-muted rounded-full w-fit relative"
                >
                    <FolderOpen class="h-8 w-8 text-muted-foreground" />
                    {#if !isLoggedIn}
                        <div
                            class="absolute -top-1 -right-1 bg-background border rounded-full p-1"
                        >
                            <Lock class="h-3 w-3 text-muted-foreground" />
                        </div>
                    {/if}
                </div>
                <CardTitle class="text-xl font-semibold">Google Drive</CardTitle>
            </CardHeader>
            <CardContent class="text-center flex-1 flex flex-col">
                <div class="text-sm text-muted-foreground mb-6 flex-1">
                    <p class="mb-3">Contenu disponible :</p>
                    <ul class="text-left space-y-2">
                        <li>
                            • <span class="font-medium text-foreground"
                                >Procédures d'admission</span
                            >
                        </li>
                        <li>• Conseils et guides pratiques</li>
                        <li>
                            • <span class="font-medium text-foreground"
                                >Conseils sur les documents administratifs</span
                            >
                        </li>
                    </ul>
                </div>
                <Button class="w-full" disabled={!isLoggedIn}>
                    {isLoggedIn ? "Accéder au Drive" : "Connexion requise"}
                </Button>
            </CardContent>
        </Card>
    </div>
</section> -->

<hr class="mb-[15pt]" />

<h2 class="text-xl font-bold mt-[10pt] mb-[5pt]">À propos de ce site</h2>
<p class="my-[5pt] text-justify">
    Ce site est maintenu par les étudiants de la double majeure en Mathématiques
    et Informatique à Sorbonne Université, également connue sous l'acronyme
    PIMA. L'objectif de ce site est de rassembler des ressources utiles, telles
    que des <accent>comptes rendus</accent> au format PDF rédigés par d'anciens
    étudiants, des instructions pour obtenir des documents administratifs tels
    que les <accent>descriptifs des Unités d'Enseignement</accent> (UE), des
    <accent>conseils pour la rédaction</accent> de lettres de recommandation, de
    lettres de motivation, de CV, et bien plus encore.
</p>

<p class="my-[5pt] text-justify">
    Sur ce site, vous trouverez également des informations sur les <accent
        >procédures d'admission</accent
    >, des conseils, des documents partagés sur le drive, et même la possibilité
    de <accent>contacter d'anciens étudiants</accent> de la PIMA qui ont intégré
    les écoles que vous visez. De plus, nous prévoyons également de fournir des
    <accent>conseils sur les documents administratifs</accent> et sur la manière
    de naviguer au mieux dans les méandres de l'administration de la Sorbonne.
</p>

<p class="my-[5pt] text-justify">
    L'idée maîtresse qui sous-tend ce projet est que, une fois que vous aurez
    également réussi à intégrer une école, vous serez encouragés à contribuer au
    site en partageant vos expériences et connaissances pour aider les
    générations futures d'étudiants de la PIMA.
</p>

<p class="my-[5pt] text-justify">
    Actuellement, l'accès au site est exclusif, ce qui signifie que vous devez
    créer un compte pour accéder aux informations existantes et ajouter de
    nouvelles ressources. Cette approche vise à garantir que les contacts des
    anciens étudiants et les informations demeurent aussi confidentiels que
    possible. Nous voulons également nous assurer que les personnes extérieures
    à la PIMA, pour ne pas les nommer, ne puissent pas accéder à nos précieuses
    données.
</p>

<p class="my-[5pt] text-justify">
    Dans l'ensemble, ce site offre un véritable réseau et une source de
    connaissances précieuses pour la vie académique et professionnelle des
    étudiants de la PIMA, à condition qu'un nombre suffisant d'étudiants s'y
    inscrivent.
</p>

<h3>En chiffres :</h3>

<section class="max-w-4xl mx-auto px-6 py-12">
    <div class="grid grid-cols-2 gap-8">
        <div class="text-center">
            <div class="text-4xl font-bold text-gray-900 mb-2">
                {#await data.streamed.members_count}
                    ...
                {:then members}
                    {members}
                {/await}
            </div>
            <div class="text-gray-600">Membres</div>
        </div>
        <div class="text-center">
            <div class="text-4xl font-bold text-gray-900 mb-2">
                {#await data.streamed.ancien_count}
                    ...
                {:then members}
                    {members}
                {/await}
            </div>
            <div class="text-gray-600">Anciens</div>
        </div>
    </div>
</section>

<h2 class="text-xl font-bold mt-[10pt] mb-[5pt]">Contribuer :</h2>
<p class="my-[5pt] text-justify">
    Pour ajouter du contenu à ce site web, veuillez suivre les instructions sur
    la page <b>GitHub</b> (<a
        target="_blank"
        href="https://github.com/Angramme/pima-site">lien</a
    >). Pour ajouter du contenu sur le <b>Google Drive</b> contacter un des admins
    pour recevoir les droits. Pour suggerer des changement a ce site web, veuillez
    contacter les admins. Pour connaitre les admins, chercher simplement "admin"
    sur la page "anciens" ou consultez la page "login"/"connexion".
</p>

<h2 class="text-xl font-bold mt-[10pt] mb-[5pt]">Liens :</h2>
<ul class="my-[5pt] text-justify">
    <li>Discord: https://discord.gg/S8NJDG84</li>
    <li>Linkedin: https://www.linkedin.com/groups/8184888/</li>
</ul>


<style>
    accent {
        font-weight: bold;
        text-decoration: underline var(--accent-color);
    }
</style>
