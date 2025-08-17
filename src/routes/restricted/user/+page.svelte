<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidate } from "$app/navigation";
    import Banner from "$lib/components/Banner.svelte";
    import Markdown from "$lib/components/Markdown.svelte";
    import { generate_password } from "$lib/utils";
    import { Button } from "$lib/components/ui/button"
    import { Input } from "$lib/components/ui/input"
    import { Label } from "$lib/components/ui/label"
    import { Textarea } from "$lib/components/ui/textarea"
    import { Checkbox } from "$lib/components/ui/checkbox"
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card"
    import { Badge } from "$lib/components/ui/badge"
    import { X, Plus } from "@lucide/svelte"

    let delete_account_btn: HTMLInputElement;
    let user_agreed: boolean = false;

    export let data: import("./$types").PageData;

    export let form: import("./$types").ActionData;

    $: user = data.user;

    let settings: any;
    $: if (user) {
        settings = {
            ...user,
            admis: user.admis?.split(',').map((s: string) => s.trim()).filter(Boolean) ?? [],
            contact: user.contact?.split(',').map((s: string) => s.trim()).filter(Boolean) ?? [],
            nationalite: user.nationalite?.split(',').map((s: string) => s.trim()).filter(Boolean) ?? [],
            jobs: user.jobs?.split(',').map((s: string) => s.trim()).filter(Boolean) ?? [],
        };
    } else {
        settings = null;
    }

    let newUni = "";
    function addUni() {
        if (newUni && settings && !settings.admis.includes(newUni)) {
            settings.admis = [...settings.admis, newUni];
            newUni = "";
        }
    }
    function removeUni(index: number) {
        if(settings) {
            settings.admis.splice(index, 1);
            settings.admis = settings.admis;
        }
    }

    let newContact = "";
    function addContact() {
        if (newContact && settings && !settings.contact.includes(newContact)) {
            settings.contact = [...settings.contact, newContact];
            newContact = "";
        }
    }
    function removeContact(index: number) {
        if(settings) {
            settings.contact.splice(index, 1);
            settings.contact = settings.contact;
        }
    }

    let newNationalite = "";
    function addNationalite() {
        if (newNationalite && settings && !settings.nationalite.includes(newNationalite)) {
            settings.nationalite = [...settings.nationalite, newNationalite];
            newNationalite = "";
        }
    }
    function removeNationalite(index: number) {
        if(settings) {
            settings.nationalite.splice(index, 1);
            settings.nationalite = settings.nationalite;
        }
    }

    let newJob = "";
    function addJob() {
        if (newJob && settings && !settings.jobs.includes(newJob)) {
            settings.jobs = [...settings.jobs, newJob];
            newJob = "";
        }
    }
    function removeJob(index: number) {
        if(settings) {
            settings.jobs.splice(index, 1);
            settings.jobs = settings.jobs;
        }
    }

    let new_pwd_val: string;
    let con_pwd_val: string;

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

<h1>Donnes et parametres utilisateur</h1>

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

<form
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
</form>

<hr />

{#if user && settings}
<form
    method="POST"
    action="?/update_data"
    use:enhance={() => {
        return async ({ update }) => {
            update({ reset: false });
        };
    }}
    class="space-y-8"
>
    {#if form?.update_success}<p class="success">Mise a jour réussie!</p>{/if}
    {#if form?.update_failure}<p class="error">Erreur de mise à jour: "{form.update_failure}"</p>{/if}

    <input type="hidden" name="admis" value={settings.admis.join(',')} />
    <input type="hidden" name="contact" value={settings.contact.join(',')} />
    <input type="hidden" name="nationalite" value={settings.nationalite.join(',')} />
    <input type="hidden" name="jobs" value={settings.jobs.join(',')} />

    <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>Informations de base vous concernant</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <Label for="prenom">Prénom *</Label>
              <Input
                id="prenom"
                name="prenom"
                bind:value={settings.prenom}
                required
              />
            </div>
            <div class="space-y-2">
              <Label for="nom">Nom</Label>
              <Input
                id="nom"
                name="nom"
                bind:value={settings.nom}
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              bind:value={settings.email}
            />
          </div>

          <div class="space-y-2">
            <Label for="grad_year">Année de diplôme</Label>
            <Input
              id="grad_year"
              name="grad_year"
              type="number"
              min="1900"
              max="2100"
              bind:value={settings.grad_year}
            />
          </div>

          <div class="space-y-2">
            <Label for="choisi">Choix/Statut actuel</Label>
            <Input
              id="choisi"
              name="choisi"
              bind:value={settings.choisi}
              placeholder="ex: Programme de Master, Poste de travail, etc."
            />
          </div>
        </CardContent>
    </Card>

    <Card>
        <CardHeader>
          <CardTitle>Informations académiques</CardTitle>
          <CardDescription>Votre parcours académique et vos réussites</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <Label for="moyenneL2">Moyenne L2</Label>
              <Input
                id="moyenneL2"
                name="moyenneL2"
                type="number"
                step="0.01"
                min="0"
                max="20"
                bind:value={settings.moyenneL2}
                placeholder="ex: 15,5"
              />
            </div>
            <div class="space-y-2">
              <Label for="moyenneL3">Moyenne L3</Label>
              <Input
                id="moyenneL3"
                name="moyenneL3"
                type="number"
                step="0.01"
                min="0"
                max="20"
                bind:value={settings.moyenneL3}
                placeholder="ex: 16,2"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label>Universités acceptées</Label>
            <div class="flex gap-2">
              <Input
                bind:value={newUni}
                placeholder="Ajouter le nom d'une université"
                on:keypress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addUni()
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                on:click={addUni}
              >
                <Plus class="h-4 w-4" />
              </Button>
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              {#each settings.admis as uni, index (uni)}
                <Badge variant="secondary" class="flex items-center gap-1">
                  {uni}
                  <button
                    type="button"
                    on:click={() => removeUni(index)}
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

    <Card>
        <CardHeader>
          <CardTitle>Contact et profil</CardTitle>
          <CardDescription>Moyens de vous contacter et votre profil</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="space-y-2">
            <Label>Informations de contact</Label>
            <div class="flex gap-2">
              <Input
                bind:value={newContact}
                placeholder="Ajouter un moyen de contact (téléphone, réseaux sociaux, etc.)"
                on:keypress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addContact()
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                on:click={addContact}
              >
                <Plus class="h-4 w-4" />
              </Button>
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              {#each settings.contact as c, index (c)}
                <Badge variant="secondary" class="flex items-center gap-1">
                  {c}
                  <button
                    type="button"
                    on:click={() => removeContact(index)}
                    class="ml-1 hover:text-destructive"
                  >
                    <X class="h-3 w-3" />
                  </button>
                </Badge>
              {/each}
            </div>
          </div>

          <div class="space-y-2">
            <Label>Nationalité</Label>
            <div class="flex gap-2">
              <Input
                bind:value={newNationalite}
                placeholder="Ajouter une nationalité"
                on:keypress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addNationalite()
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                on:click={addNationalite}
              >
                <Plus class="h-4 w-4" />
              </Button>
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              {#each settings.nationalite as nat, index (nat)}
                <Badge variant="secondary" class="flex items-center gap-1">
                  {nat}
                  <button
                    type="button"
                    on:click={() => removeNationalite(index)}
                    class="ml-1 hover:text-destructive"
                  >
                    <X class="h-3 w-3" />
                  </button>
                </Badge>
              {/each}
            </div>
          </div>

          <div class="space-y-2">
            <Label>Emplois/Expérience professionnelle</Label>
            <div class="flex gap-2">
              <Input
                bind:value={newJob}
                placeholder="Ajouter un emploi ou une expérience professionnelle"
                on:keypress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addJob()
                  }
                }}
              />
              <Button type="button" variant="outline" size="icon" on:click={addJob}>
                <Plus class="h-4 w-4" />
              </Button>
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              {#each settings.jobs as job, index (job)}
                <Badge variant="secondary" class="flex items-center gap-1">
                  {job}
                  <button
                    type="button"
                    on:click={() => removeJob(index)}
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

    <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
          <CardDescription>Parlez de vous en utilisant le formatage Markdown</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="flex items-center space-x-2">
            <Checkbox
              id="public_description"
              name="public_description"
              bind:checked={settings.public_description}
            />
            <Label for="public_description">Rendre la description publique</Label>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="space-y-2">
              <Label for="description">Description (Markdown)</Label>
              <Textarea
                id="description"
                name="description"
                bind:value={settings.description}
                placeholder="Écrivez à propos de vous en utilisant le formatage Markdown..."
                class="min-h-[300px] font-mono text-sm"
              />
              <p class="text-xs text-muted-foreground">
                Vous pouvez utiliser le formatage Markdown : **gras**, *italique*, `code`, [liens](url), ![images](url),
                etc.
              </p>
            </div>
            <div class="space-y-2">
              <Label>Aperçu</Label>
              <div class="markdown-preview p-4 border rounded-md min-h-[300px]">
                {#if settings.description}
                    <Markdown markdown={settings.description} />
                {/if}
              </div>
            </div>
          </div>
        </CardContent>
    </Card>

    <Card>
        <CardContent class="pt-6">
          <div class="flex items-start space-x-2">
            <Checkbox
              id="legal_agreement"
              bind:checked={user_agreed}
              required
            />
            <Label for="legal_agreement" class="text-sm leading-relaxed">
              <u>J'ai pris connaissance</u> de la réglementation{" "}
              <a href="/reglementation" target="_blank" class="text-primary hover:underline" rel="noreferrer">
                ici
              </a>{" "}
              et <u>je donne mon accord</u> pour l'utilisation de mes données ci-dessus.
            </Label>
          </div>
        </CardContent>
    </Card>

    <div class="flex justify-end">
        <Button type="submit" size="lg" class="px-8" disabled={!user_agreed}>
          Enregistrer les paramètres
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
            on:click={() => {
                delete_account_btn.disabled = false;
            }}
        />
        <input
            bind:this={delete_account_btn}
            on:click={delete_account_now}
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
                                    on:click={() =>
                                        navigator.clipboard.writeText(
                                            create_pwd.value,
                                        )}
                                    value="copy"
                                /></td
                            >
                            <td
                                ><input
                                    type="button"
                                    on:click={() =>
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
        max-height: 50vh;
        overflow-y: scroll;
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
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        text-decoration: underline var(--behind-color);
    }
</style>
