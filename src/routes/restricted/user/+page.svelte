<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidate } from "$app/navigation";
    import Banner from "$lib/components/Banner.svelte";
    import Markdown from "$lib/components/Markdown.svelte";
    import { generate_password } from "$lib/utils";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Textarea } from "$lib/components/ui/textarea";
    import { Checkbox } from "$lib/components/ui/checkbox";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { Badge } from "$lib/components/ui/badge";
    import { X, Plus } from "@lucide/svelte";
    import type { PageData, ActionData } from "./$types.js";

    let delete_account_btn: HTMLInputElement;
    let user_agreed: boolean = $state(false);
    let submitting = $state(false);
    let updateSuccess = $state(false);

    let { data, form }: { data: PageData; form: ActionData } = $props();

    $effect(() => {
        if (form?.update_success) {
            updateSuccess = true;
            const timer = setTimeout(() => {
                updateSuccess = false;
            }, 2000);
            return () => clearTimeout(timer);
        }
    });

    let user = $state(data.user);

    let newUni = $state("");
    function addUni() {
        if (newUni && user && !user.admis.includes(newUni)) {
            user.admis = [...user.admis, newUni];
            newUni = "";
        }
    }
    function removeUni(index: number) {
        if (user) {
            user.admis.splice(index, 1);
            user.admis = user.admis;
        }
    }

    let newContact = $state("");
    function addContact() {
        if (newContact && user && !user.contact.includes(newContact)) {
            user.contact = [...user.contact, newContact];
            newContact = "";
        }
    }
    function removeContact(index: number) {
        if (user) {
            user.contact.splice(index, 1);
            user.contact = user.contact;
        }
    }

    let newNationalite = $state("");
    function addNationalite() {
        if (
            newNationalite &&
            user &&
            !user.nationalite.includes(newNationalite)
        ) {
            user.nationalite = [...user.nationalite, newNationalite];
            newNationalite = "";
        }
    }
    function removeNationalite(index: number) {
        if (user) {
            user.nationalite.splice(index, 1);
            user.nationalite = user.nationalite;
        }
    }

    let newJob = $state("");
    function addJob() {
        if (newJob && user && !user.travails.includes(newJob)) {
            user.travails = [...user.travails, newJob];
            newJob = "";
        }
    }
    function removeJob(index: number) {
        if (user) {
            user.travails.splice(index, 1);
            user.travails = user.travails;
        }
    }

    let new_pwd_val = $state("");
    let con_pwd_val = $state("");

    let delete_account_form: HTMLFormElement;
    const delete_account_now = async () => {
        const yes = confirm(
            "Veuillez vous vraiment supprimer votre compte? Attention cette opération n'est pas réversible.",
        );
        if (!yes) return;
        delete_account_form.submit();
    };

    let create_pwd: HTMLInputElement;
</script>

<Banner />

<div
    class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 my-4"
    role="alert"
>
    <p>
        N'oubliez pas de cliquer sur le bouton 'Enregistrer les paramètres' en
        bas de la page pour sauvegarder vos modifications.
    </p>
</div>

<!-- <h1>Donnes et parametres utilisateur</h1> -->

<!-- Server message sesction -->
{#if form?.pwd_rst_missing}<p class="error">Manque de mot de passe!</p>{/if}
{#if form?.pwd_rst_incorrect}<p class="error">Mot de passe incorrect!</p>{/if}
{#if form?.pwd_rst_success}<p class="success">Changement réussi!</p>{/if}
{#if form?.disconnected}
    <p class="success">Déconnexion réussie!</p>
{/if}
{#if form?.update_success}<p class="success">Mise a jour réussie!</p>{/if}
{#if form?.update_failure}<p class="error">
        Erreur de mise à jour: "{form.update_failure}""
    </p>{/if}

<!-- <form
    method="POST"
    action="?/disconnect"
    use:enhance={() => {
        return async ({ update }) => {
            await invalidate("user:update");
            return update();
        };
    }}
>
    <fieldset>
        <legend>Deconnexion</legend>
        <div>
            {#if form?.disconnected}
                <p class="success">Déconnexion réussie!</p>
            {/if}
            <input type="submit" value="Deconnexion" />
        </div>
    </fieldset>
</form> -->


{#if user && user}
    <form
        method="POST"
        action="?/update_data"
        use:enhance={() => {
            submitting = true;
            return async ({ update }) => {
                update({ reset: false });
                submitting = false;
            };
        }}
        class="space-y-8"
    >
        {#if form?.update_success}<p class="success">
                Mise a jour réussie!
            </p>{/if}
        {#if form?.update_failure}<p class="error">
                Erreur de mise à jour: "{form.update_failure}"
            </p>{/if}

        <input type="hidden" name="admis" value={user.admis.join(",")} />
        <input type="hidden" name="contact" value={user.contact.join(",")} />
        <input
            type="hidden"
            name="nationalite"
            value={user.nationalite.join(",")}
        />
        <input type="hidden" name="travails" value={user.travails.join(",")} />

        <Card class="">
            <CardHeader class="">
                <CardTitle class="">Informations personnelles</CardTitle>
                <CardDescription class=""
                    >Informations de base vous concernant</CardDescription
                >
            </CardHeader>
            <CardContent class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <Label class="" for="prenom">Prénom *</Label>
                        <Input
                            class=""
                            id="prenom"
                            name="prenom"
                            type="text"
                            bind:value={user.prenom}
                            required
                        />
                    </div>
                    <div class="space-y-2">
                        <Label class="" for="nom">Nom</Label>
                        <Input
                            class=""
                            id="nom"
                            name="nom"
                            type="text"
                            bind:value={user.nom}
                        />
                    </div>
                </div>

                <div class="space-y-2">
                    <Label class="" for="email">Email</Label>
                    <Input
                        class=""
                        id="email"
                        name="email"
                        type="email"
                        bind:value={user.email}
                    />
                </div>

                <div class="space-y-2">
                    <Label class="" for="grad_year">Année de diplôme</Label>
                    <Input
                        class=""
                        id="grad_year"
                        name="grad_year"
                        type="number"
                        min="1900"
                        max="2100"
                        bind:value={user.grad_year}
                    />
                </div>

                <div class="space-y-2">
                    <Label class="" for="choisi">Choix/Statut actuel</Label>
                    <Input
                        class=""
                        id="choisi"
                        name="choisi"
                        type="text"
                        bind:value={user.choisi}
                        placeholder="ex: Programme de Master, Poste de travail, etc."
                    />
                </div>
            </CardContent>
        </Card>

        <Card class="">
            <CardHeader class="">
                <CardTitle class="">Informations académiques</CardTitle>
                <CardDescription class=""
                    >Votre parcours académique et vos réussites</CardDescription
                >
            </CardHeader>
            <CardContent class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <Label class="" for="moyenneL2">Moyenne L2</Label>
                        <Input
                            class=""
                            id="moyenneL2"
                            name="moyenneL2"
                            type="number"
                            step="0.01"
                            min="0"
                            max="20"
                            bind:value={user.moyenneL2}
                            placeholder="ex: 15,5"
                        />
                    </div>
                    <div class="space-y-2">
                        <Label class="" for="moyenneL3">Moyenne L3</Label>
                        <Input
                            class=""
                            id="moyenneL3"
                            name="moyenneL3"
                            type="number"
                            step="0.01"
                            min="0"
                            max="20"
                            bind:value={user.moyenneL3}
                            placeholder="ex: 16,2"
                        />
                    </div>
                </div>

                <div class="space-y-2">
                    <Label class="">Universités acceptées</Label>
                    <div class="flex gap-2">
                        <Input
                            class=""
                            type="text"
                            bind:value={newUni}
                            placeholder="Ajouter le nom d'une université"
                            onkeypress={(e: any) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addUni();
                                }
                            }}
                        />
                        <Button
                            class=""
                            disabled={false}
                            type="button"
                            variant="outline"
                            size="icon"
                            onclick={addUni}
                        >
                            <Plus class="h-4 w-4" />
                        </Button>
                    </div>
                    <div class="flex flex-wrap gap-2 mt-2">
                        {#each user.admis as uni, index (uni)}
                            <Badge
                                href=""
                                variant="outline"
                                class="flex items-center gap-1"
                            >
                                {uni}
                                <button
                                    type="button"
                                    onclick={() => removeUni(index)}
                                    class="ml-1 hover:text-destructive"
                                >
                                    <X class="h-3 w-3" />
                                </button>
                            </Badge>
                        {/each}
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card class="">
            <CardHeader class="">
                <CardTitle class="">Contact et profil</CardTitle>
                <CardDescription class=""
                    >Moyens de vous contacter et votre profil</CardDescription
                >
            </CardHeader>
            <CardContent class="space-y-6">
                <div class="space-y-2">
                    <Label class="">Informations de contact</Label>
                    <div class="flex gap-2">
                        <Input
                            class=""
                            type="text"
                            bind:value={newContact}
                            placeholder="Ajouter un moyen de contact (téléphone, réseaux sociaux, etc.)"
                            onkeypress={(e: any) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addContact();
                                }
                            }}
                        />
                        <Button
                            class=""
                            disabled={false}
                            type="button"
                            variant="outline"
                            size="icon"
                            onclick={addContact}
                        >
                            <Plus class="h-4 w-4" />
                        </Button>
                    </div>
                    <div class="flex flex-wrap gap-2 mt-2">
                        {#each user.contact as c, index (c)}
                            <Badge
                                href=""
                                variant="outline"
                                class="flex items-center gap-1"
                            >
                                {c}
                                <button
                                    type="button"
                                    onclick={() => removeContact(index)}
                                    class="ml-1 hover:text-destructive"
                                >
                                    <X class="h-3 w-3" />
                                </button>
                            </Badge>
                        {/each}
                    </div>
                </div>

                <div class="space-y-2">
                    <Label class="">Nationalité</Label>
                    <div class="flex gap-2">
                        <Input
                            class=""
                            type="text"
                            bind:value={newNationalite}
                            placeholder="Ajouter une nationalité"
                            onkeypress={(e: any) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addNationalite();
                                }
                            }}
                        />
                        <Button
                            class=""
                            disabled={false}
                            type="button"
                            variant="outline"
                            size="icon"
                            onclick={addNationalite}
                        >
                            <Plus class="h-4 w-4" />
                        </Button>
                    </div>
                    <div class="flex flex-wrap gap-2 mt-2">
                        {#each user.nationalite as nat, index (nat)}
                            <Badge
                                href=""
                                variant="outline"
                                class="flex items-center gap-1"
                            >
                                {nat}
                                <button
                                    type="button"
                                    onclick={() => removeNationalite(index)}
                                    class="ml-1 hover:text-destructive"
                                >
                                    <X class="h-3 w-3" />
                                </button>
                            </Badge>
                        {/each}
                    </div>
                </div>

                <div class="space-y-2">
                    <Label class="">Emplois/Expérience professionnelle</Label>
                    <div class="flex gap-2">
                        <Input
                            class=""
                            type="text"
                            bind:value={newJob}
                            placeholder="Ajouter un emploi ou une expérience professionnelle"
                            onkeypress={(e: any) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addJob();
                                }
                            }}
                        />
                        <Button
                            class=""
                            disabled={false}
                            type="button"
                            variant="outline"
                            size="icon"
                            onclick={addJob}
                        >
                            <Plus class="h-4 w-4" />
                        </Button>
                    </div>
                    <div class="flex flex-wrap gap-2 mt-2">
                        {#each user.travails as job, index (job)}
                            <Badge
                                href=""
                                variant="outline"
                                class="flex items-center gap-1"
                            >
                                {job}
                                <button
                                    type="button"
                                    onclick={() => removeJob(index)}
                                    class="ml-1 hover:text-destructive"
                                >
                                    <X class="h-3 w-3" />
                                </button>
                            </Badge>
                        {/each}
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card class="">
            <CardHeader class="">
                <CardTitle class="">Description</CardTitle>
                <CardDescription class=""
                    >Parlez de vous en utilisant le formatage Markdown</CardDescription
                >
            </CardHeader>
            <CardContent class="space-y-6">
                <div class="flex items-center space-x-2">
                    <Checkbox
                        class=""
                        id="public_description"
                        name="public_description"
                        bind:checked={user.public_description}
                    />
                    <Label class="" for="public_description"
                        >Rendre la description publique</Label
                    >
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="space-y-2 flex flex-col">
                        <Label class="" for="description"
                            >Description (Markdown)</Label
                        >
                        <Textarea
                            id="description"
                            name="description"
                            bind:value={user.description}
                            placeholder="Écrivez à propos de vous en utilisant le formatage Markdown..."
                            class="min-h-[300px] font-mono text-sm flex-1"
                        />
                        <p class="text-xs text-muted-foreground">
                            Vous pouvez utiliser le formatage Markdown :
                            **gras**, *italique*, `code`, [liens](url),
                            ![images](url), etc.
                        </p>
                    </div>
                    <div class="space-y-2 flex flex-col">
                        <Label class="">Aperçu</Label>
                        <div
                            class="markdown-preview p-4 border rounded-md min-h-[300px] flex-1"
                        >
                            <Markdown markdown={user.description} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card class="">
            <CardContent class="pt-6">
                <div class="flex items-start space-x-2">
                    <Checkbox
                        class=""
                        id="legal_agreement"
                        bind:checked={user_agreed}
                        required
                    />
                    <Label
                        for="legal_agreement"
                        class="text-sm leading-relaxed"
                    >
                        <u>J'ai pris connaissance</u> de la réglementation{" "}
                        <a
                            href="/reglementation"
                            target="_blank"
                            class="text-primary hover:underline"
                            rel="noreferrer"
                        >
                            ici
                        </a>{" "}
                        et <u>je donne mon accord</u> pour l'utilisation de mes données
                        ci-dessus.
                    </Label>
                </div>
            </CardContent>
        </Card>

        <div class="flex justify-end">
            <Button
                type="submit"
                size="lg"
                class="px-8"
                disabled={!user_agreed || submitting}
            >
                {#if submitting}
                    Enregistrement...
                {:else if updateSuccess}
                    Enregistré !
                {:else}
                    Enregistrer les paramètres
                {/if}
            </Button>
        </div>
    </form>
{:else}
    <p class="error">Erreur interne! Donnes indisponibles!</p>
{/if}

<hr />

<form method="POST" action="?/pwd_chg" use:enhance>
    <fieldset id="pwd_chg">
        <legend>Reinitialisation mot de passe</legend>
        {#if form?.pwd_rst_missing}<p class="error">
                Manque de mot de passe!
            </p>{/if}
        {#if form?.pwd_rst_incorrect}<p class="error">
                Mot de passe incorrect!
            </p>{/if}
        {#if form?.pwd_rst_success}<p class="success">
                Changement réussi!
            </p>{/if}
        <table>
            <tbody>
                <tr>
                    <td><label for="old_pwd">Ancien mot de passe</label></td>
                    <td
                        ><input
                            name="old_pwd"
                            id="old_pwd"
                            type="password"
                        /></td
                    >
                </tr>
                <tr>
                    <td><label for="new_pwd">Nouveau mot de passe</label></td>
                    <td
                        ><input
                            bind:value={new_pwd_val}
                            name="new_pwd"
                            id="new_pwd"
                            type="password"
                        /></td
                    >
                </tr>
                <tr>
                    <td
                        ><label for="rep_pwd"
                            >Confirmer nouveau mot de passe</label
                        ></td
                    >
                    <td
                        ><input
                            bind:value={con_pwd_val}
                            id="rep_pwd"
                            type="password"
                        /></td
                    >
                </tr>
                <tr>
                    <td></td>
                    <td
                        ><input
                            type="submit"
                            value="Changer"
                            disabled={new_pwd_val != con_pwd_val}
                        /></td
                    >
                </tr>
            </tbody>
        </table>
    </fieldset>
</form>

<hr />

<form
    bind:this={delete_account_form}
    method="POST"
    action="?/delete_account"
    use:enhance
>
    <fieldset class="danger">
        <legend>Supprimer ce compte</legend>
        {#if form?.delete_failure}<p class="error">
                Erreur serveur: "{form.delete_failure}"
            </p>{/if}
        {#if form?.delete_success}<p class="success">Compte supprimé!</p>{/if}
        <p class="info">
            Pour supprimer votre compte, debloquez d'abbord le bouton "Supprimer
            ce compte" avec le bouton "Debloquer". Ensuite appuyez sur
            "Supprimer ce compte". Enfin confirmez que vous voulez supprimer
            votre compte.
        </p>
        <input
            type="button"
            value="Debloquer"
            onclick={() => {
                delete_account_btn.disabled = false;
            }}
        />
        <input
            bind:this={delete_account_btn}
            onclick={delete_account_now}
            type="button"
            value="Supprimer ce compte"
            disabled
        />
    </fieldset>
</form>

<hr />

{#if user?.admin}
    <form method="POST" action="?/create_account" use:enhance>
        <fieldset class="admin">
            <legend>Admin</legend>
            <fieldset>
                <legend>Créer un compte</legend>
                {#if form?.creation_failure}<p class="error">
                        Erreur serveur: "{form.creation_failure}"
                    </p>{/if}
                {#if form?.creation_success}<p class="success">
                        Creation réussie! login: {form.new_account_login}
                    </p>{/if}
                <table>
                    <tbody>
                        <tr>
                            <td><label for="create_prenom">prenom</label></td>
                            <td
                                ><input
                                    name="prenom"
                                    id="create_prenom"
                                    type="text"
                                /></td
                            >
                        </tr>
                        <tr>
                            <td><label for="create_nom">nom</label></td>
                            <td
                                ><input
                                    name="nom"
                                    id="create_nom"
                                    type="text"
                                /></td
                            >
                        </tr>
                        <tr>
                            <td
                                ><label for="create_grad_year"
                                    >année fin L3</label
                                ></td
                            >
                            <td
                                ><input
                                    name="grad_year"
                                    id="create_grad_year"
                                    type="number"
                                /></td
                            >
                        </tr>
                        <tr>
                            <td><label for="create_pwd">password</label></td>
                            <td
                                ><input
                                    bind:this={create_pwd}
                                    name="password"
                                    id="create_pwd"
                                    type="string"
                                    value={generate_password()}
                                /></td
                            >
                            <td
                                ><input
                                    type="button"
                                    onclick={() =>
                                        navigator.clipboard.writeText(
                                            create_pwd.value,
                                        )}
                                    value="copy"
                                /></td
                            >
                            <td
                                ><input
                                    type="button"
                                    onclick={() =>
                                        (create_pwd.value =
                                            generate_password())}
                                    value="regenerate"
                                /></td
                            >
                        </tr>
                        <tr>
                            <td></td>
                            <td><input type="submit" value="Créer" /></td>
                        </tr>
                    </tbody>
                </table>
                <p class="info">
                    Copiez le mot de passe, cliquez sur creer puis copiez le
                    login.
                </p>
            </fieldset>
        </fieldset>
    </form>
    <form method="POST" action="?/mass_create_accounts" use:enhance>
        <fieldset class="admin">
            <legend>Admin</legend>
            <fieldset>
                <legend>Créer des comptes à partir des emails</legend>
                {#if form?.creation_failure}<p class="error">
                        Erreur serveur: "{form.creation_failure}"
                    </p>{/if}
                {#if form?.creation_success}<p class="success">
                        Creation réussie! logins: {form.new_account_login}
                    </p>{/if}
                <table>
                    <tbody>
                        <tr>
                            <td
                                ><label for="create_emails"
                                    >emails (separate with ";")</label
                                ></td
                            >
                            <td
                                ><textarea
                                    name="emails"
                                    id="create_emails"
                                    rows={3}
                                    cols="40"
                                ></textarea></td
                            >
                        </tr>
                        <tr>
                            <td
                                ><label for="create_grad_year2"
                                    >année fin L3</label
                                ></td
                            >
                            <td
                                ><input
                                    name="grad_year"
                                    id="create_grad_year2"
                                    type="number"
                                /></td
                            >
                        </tr>
                        <tr>
                            <td></td>
                            <td><input type="submit" value="Créer" /></td>
                        </tr>
                    </tbody>
                </table>
                <p class="info">
                    Entrez des emails des personnes et l'année de leur L3
                </p>
            </fieldset>
        </fieldset>
    </form>
{/if}

<style>
    fieldset {
        margin-top: 20px;
    }
    form > fieldset {
        margin-top: 50px;
        margin-bottom: 50px;
        border: none;
    }
    form > fieldset > fieldset {
        border: none;
        background: linear-gradient(
            40deg,
            var(--behind-color),
            var(--background-color) 50% 100%
        );
    }
    form > fieldset > * {
        background-color: var(--background-color);
    }
    form > fieldset > legend {
        font-size: xx-large;
        font-weight: bold;
        text-decoration: underline wavy var(--behind-color);
    }
    form > fieldset > fieldset > legend {
        font-weight: bold;
    }
    input,
    textarea {
        width: 95%;
    }
    input:read-only[type~="text"],
    input:read-only[type~="date"],
    textarea:read-only {
        background: rgb(196, 196, 196);
    }
    input[type="checkbox"] {
        width: auto;
    }
    .admin {
        background-color: aquamarine;
    }
    .danger {
        background-color: rgb(255, 95, 95);
    }
    .danger legend {
        color: red;
        font-weight: bold;
    }
    .error {
        color: red;
    }
    .success {
        color: green;
    }
    .info {
        font-size: medium;
        width: 94%;
        background-color: var(--background-color);
        padding: 5px;
        border: solid 1px gray;
    }
    .info::before {
        content: "💡 ";
    }
    table {
        border-spacing: 7px;
        width: 100%;
    }
    table tr td:first-child {
        width: 100px;
        overflow: hidden;
        border-bottom: solid 1px var(--font-color);
    }
    table tr:last-child td:first-child {
        border: none;
    }

    #mettre_a_jour:enabled {
        background-color: rgb(196, 255, 196);
    }
    #mettre_a_jour:disabled {
        background-color: rgb(255, 147, 147);
    }
    #mettre_a_jour:enabled:hover {
        background-color: rgb(86, 255, 86);
    }
    .markdown-preview {
        overflow-y: auto;
    }
    hr {
        border-color: var(--foreground);
        opacity: 15%;
    }
    body {
        margin: 0;
        background-color: var(--background-color);
    }
    input,
    button,
    fieldset,
    textarea {
        border: solid 2px var(--foreground);
        border-radius: 0.2rem;
    }
    input,
    button,
    textarea {
        background-color: var(--background-color);
        color: var(--foreground);
    }
    input:hover,
    button:hover,
    fieldset:hover,
    textarea:hover {
        border-color: var(--accent-color);
    }
</style>
