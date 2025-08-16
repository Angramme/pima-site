<script lang='ts'>
    import { enhance } from '$app/forms';
    import Markdown from '$lib/components/Markdown.svelte';
    import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
    import { Badge } from "$lib/components/ui/badge";
    import { UserIcon, Mail, GraduationCap, Globe, Award, Briefcase, Calendar } from "@lucide/svelte";

    
    let { data, form } = $props();
    let profile = $derived(data.subject);

    let user_input: string | undefined = $state("user login");

    function formatDate(dateString: string | Date | null | undefined): string {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
</script>


{#await profile}
    <p>Loading...</p>
{:then profile}
    <div class="min-h-screen bg-background p-6">
        <div class="max-w-4xl mx-auto space-y-6">
            <!-- Header Section -->
            <Card>
                <CardHeader class="pb-4">
                    <div class="flex items-center gap-4">
                        <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <UserIcon class="w-8 h-8 text-primary" />
                        </div>
                        <div class="flex-1">
                            <CardTitle class="text-2xl font-bold">
                                {profile.prenom} {profile.nom}
                                {#if profile.admin}
                                    <Badge variant="destructive" class="ml-2">
                                        Administrateur
                                    </Badge>
                                {/if}
                            </CardTitle>
                            <p class="text-muted-foreground">@{profile.login}</p>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Contact Information -->
                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <Mail class="w-5 h-5" />
                            Informations de Contact
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-3">
                        {#if profile.email}
                            <div>
                                <p class="text-sm font-medium text-muted-foreground">Email</p>
                                <p class="text-sm">{profile.email}</p>
                            </div>
                        {/if}
                        {#if profile.contact && profile.contact.length > 0}
                            <div>
                                <p class="text-sm font-medium text-muted-foreground">Coordonnées</p>
                                <div class="space-y-1">
                                    {#each profile.contact as contact}
                                        <p class="text-sm">{contact}</p>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                        {#if profile.nationalite && profile.nationalite.length > 0}
                            <div>
                                <p class="text-sm font-medium text-muted-foreground mb-2">Nationalité</p>
                                <div class="flex flex-wrap gap-1">
                                    {#each profile.nationalite as nat}
                                        <Badge variant="outline" class="text-xs">
                                            <Globe class="w-3 h-3 mr-1" />
                                            {nat}
                                        </Badge>
                                    {/each}
                                </div>
                            </div>
                        {/if}
                    </CardContent>
                </Card>

                <!-- Academic Information -->
                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <GraduationCap class="w-5 h-5" />
                            Informations Académiques
                        </CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-3">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Année de Diplôme</p>
                            <p class="text-sm">{profile.grad_year}</p>
                        </div>

                        {#if profile.moyenneL2 !== null || profile.moyenneL3 !== null}
                            <div>
                                <p class="text-sm font-medium text-muted-foreground mb-2">Moyennes Académiques</p>
                                <div class="space-y-1">
                                    {#if profile.moyenneL2 !== null}
                                        <div class="flex justify-between">
                                            <span class="text-sm">Moyenne L2 :</span>
                                            <Badge variant="secondary">{profile.moyenneL2}/20</Badge>
                                        </div>
                                    {/if}
                                    {#if profile.moyenneL3 !== null}
                                        <div class="flex justify-between">
                                            <span class="text-sm">Moyenne L3 :</span>
                                            <Badge variant="secondary">{profile.moyenneL3}/20</Badge>
                                        </div>
                                    {/if}
                                </div>
                            </div>
                        {/if}

                        {#if profile.admis && profile.admis.length > 0}
                            <div>
                                <p class="text-sm font-medium text-muted-foreground mb-2">Programmes Admis</p>
                                <div class="space-y-1">
                                    {#each profile.admis as program}
                                        <Badge variant="outline" class="mr-1 mb-1">
                                            <Award class="w-3 h-3 mr-1" />
                                            {program}
                                        </Badge>
                                    {/each}
                                </div>
                            </div>
                        {/if}

                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Programme Choisi</p>
                            <Badge variant="default" class="mt-1">
                                <Award class="w-3 h-3 mr-1" />
                                {profile.choisi}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <!-- Professional Experience -->
            {#if profile.jobs && profile.jobs.length > 0}
                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2">
                            <Briefcase class="w-5 h-5" />
                            Expérience Professionnelle
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="flex flex-wrap gap-2">
                            {#each profile.jobs as job}
                                <Badge variant="secondary">
                                    {job}
                                </Badge>
                            {/each}
                        </div>
                    </CardContent>
                </Card>
            {/if}

            <!-- Description -->
            <Card>
                <CardHeader>
                    <CardTitle>À Propos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="prose prose-sm max-w-none dark:prose-invert">
                        <Markdown content={profile.description} />
                    </div>
                </CardContent>
            </Card>

            <!-- Account Information -->
            <Card>
                <CardHeader>
                    <CardTitle class="flex items-center gap-2">
                        <Calendar class="w-5 h-5" />
                        Informations du Compte
                    </CardTitle>
                </CardHeader>
                <CardContent class="space-y-3">
                    <div>
                        <p class="text-sm font-medium text-muted-foreground">Compte Créé</p>
                        <p class="text-sm">{formatDate(profile.createdAt)}</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-muted-foreground">Dernière Mise à Jour</p>
                        <p class="text-sm">{formatDate(profile.updatedAt)}</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-muted-foreground">ID Utilisateur</p>
                        <p class="text-sm font-mono text-xs bg-muted px-2 py-1 rounded">{profile.id}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
{/await}
