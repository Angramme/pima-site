<script>
    import UserProfileModal from "./UserProfileModal.svelte";
    import Markdown from "./Markdown.svelte";
    import Rolldown from "./Rolldown.svelte";

    /** @type {Partial<import('@prisma/client').User>} */
    export let user;
    /** @type {Partial<import('@prisma/client').User> | undefined} */
    export let me;

    let showModal = false;

    /** @param {string | undefined | null} str */
    const toProperCase = (str) => {
        if (!str) return "";
        return str
            .toLowerCase()
            .split(/([ -])/g)
            .map(
                (/** @type {string} */ word) =>
                    word.charAt(0).toUpperCase() + word.slice(1)
            )
            .join("");
    };
</script>

{#if showModal}
    <UserProfileModal {user} {me} on:close={() => (showModal = false)}>
        <div class="user-profile">
            <div class="profile-header">
                <h2>
                    {toProperCase(user.prenom)}
                    {#if me}{toProperCase(user.nom)}{/if}
                </h2>
                {#if user.grad_year}
                    <div class="l3">L3 {user.grad_year}</div>
                {/if}
            </div>
            <div class="profile-details">
                <div class="profile-card">
                    <h4>Contact</h4>
                    <p>Email: {user.email}</p>
                    <p>Contact: {user.contact}</p>
                    <p>Nationalité: {user.nationalite}</p>
                </div>
                <div class="profile-card">
                    <h4>Parcours</h4>
                    <p>Admis: {user.admis}</p>
                    <p>Choisi: {user.choisi}</p>
                    <p>Moyenne L2: {user.moyenneL2}</p>
                    <p>Moyenne L3: {user.moyenneL3}</p>
                </div>
                <div class="profile-card description">
                    <h4>Description</h4>
                    <Markdown markdown={user.description ?? ""} />
                </div>
                <div class="profile-card">
                    <h4>Travails</h4>
                    <p>{user.travails}</p>
                </div>
            </div>
        </div>
    </UserProfileModal>
{/if}

<div class="conseil-card">
    <div class="conseil-header">
        <h3>
            <button
                class="link-button"
                on:click={() => (showModal = me ? true : false)}
            >
                {toProperCase(user.prenom)}
                {#if me}{toProperCase(user.nom)}{/if}
            </button>
        </h3>
        <span class="details">
            {#if user.grad_year}
                PIMA {user.grad_year - 3}-{user.grad_year}
            {/if}
        </span>
    </div>

    <Rolldown closed_height="10vh">
        <Markdown markdown={user.description ?? ""} />
    </Rolldown>
</div>

<style>
    .conseil-card {
        background-color: color-mix(in srgb, var(--background-color) 90%, white);
        border: 1px solid #eee;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        padding: 20px;
        margin-bottom: 1.5rem;
        display: flex;
        flex-direction: column;
    }
    .conseil-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 1rem;
    }
    .link-button {
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        font: inherit;
        color: inherit;
        text-decoration: wavy underline var(--accent-color);
        cursor: pointer;
        text-align: left;
    }
    .conseil-header h3 {
        margin: 0;
    }
    .details {
        font-size: 80%;
        color: #888;
    }
    .user-profile .profile-header {
		margin-bottom: 2rem;
	}
	.user-profile .profile-header h2 {
		margin: 0 0 10px 0;
	}
	.user-profile .profile-details {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
	}
	.user-profile .profile-card {
		background-color: color-mix(in srgb, var(--background-color) 50%, transparent);
		padding: 1rem;
		border-radius: 10px;
	}
	.user-profile .profile-card h4 {
		margin-top: 0;
	}
	.description {
		grid-column: 1 / -1;
	}
</style>
