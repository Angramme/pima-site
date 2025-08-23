<script lang="ts">
	import Markdown from "$lib/components/Markdown.svelte";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";
	import {
		UserIcon,
		Mail,
		GraduationCap,
		Globe,
		Award,
		Briefcase,
		Calendar,
	} from "@lucide/svelte";

	type Profile = {
		prenom?: string;
		nom?: string;
		email?: string;
		contact?: string[];
		nationalite?: string[];
		login?: string;
		admin?: boolean;
		grad_year?: number;
		moyenneL2?: number | null;
		moyenneL3?: number | null;
		admis?: string[];
		choisi?: string;
		travails?: string[];
		description?: string | null;
		createdAt?: string | Date | null;
		updatedAt?: string | Date | null;
	};
	let {
		profile,
		showAdmin = false,
		expectedLogin,
		onGrantAdmin,
		onRevokeAdmin,
		onDelete,
	}: {
		profile: Profile;
		showAdmin?: boolean;
		expectedLogin?: string;
		onGrantAdmin?: (login: string) => void;
		onRevokeAdmin?: (login: string) => void;
		onDelete?: (login: string) => void;
	} = $props();

	let adminLoginConfirm = $state("");

	function formatDate(dateString: string | Date | null | undefined): string {
		if (!dateString) return "N/A";
		return new Date(dateString).toLocaleDateString("fr-FR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}
</script>

{#if profile}
	<div class="mx-auto space-y-6">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<div class="grid grid-cols-1 gap-6">
				<!-- Header Section -->
				<Card class="">
					<CardHeader class="pb-4">
						<div class="flex items-center gap-4">
							<div
								class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
							>
								<UserIcon class="w-8 h-8 text-primary" />
							</div>
							<div class="flex-1">
								<CardTitle class="text-2xl font-bold">
									{profile.prenom}
									{profile.nom}
									{#if profile.admin}
										<Badge
											href={null}
											variant="outline"
											class="ml-2"
										>
											Administrateur
										</Badge>
									{/if}
								</CardTitle>
								{#if profile.login}
									<p class="text-muted-foreground">@{profile.login}</p>
								{/if}
							</div>
						</div>
					</CardHeader>
				</Card>

				<!-- Contact Information -->
				<Card class="">
					<CardHeader class="">
						<CardTitle class="flex items-center gap-2">
							<Mail class="w-5 h-5" />
							Informations de Contact
						</CardTitle>
					</CardHeader>
					<CardContent class="space-y-3">
						{#if profile.email}
							<div>
								<p
									class="text-sm font-medium text-muted-foreground"
								>
									Email
								</p>
								<p class="text-sm">{profile.email}</p>
							</div>
						{/if}
						{#if profile.contact && profile.contact.length > 0}
							<div>
								<p
									class="text-sm font-medium text-muted-foreground"
								>
									Coordonnées
								</p>
								<div class="space-y-1">
									{#each profile.contact as contact}
										<p class="text-sm">{contact}</p>
									{/each}
								</div>
							</div>
						{/if}
						{#if profile.nationalite && profile.nationalite.length > 0}
							<div>
								<p
									class="text-sm font-medium text-muted-foreground mb-2"
								>
									Nationalité
								</p>
								<div class="flex flex-wrap gap-1">
									{#each profile.nationalite as nat}
										<Badge
											href={null}
											variant="outline"
											class="text-xs"
										>
											<Globe class="w-3 h-3 mr-1" />
											{nat}
										</Badge>
									{/each}
								</div>
							</div>
						{/if}
					</CardContent>
				</Card>

				<!-- Account Information -->
				<Card class="">
					<CardHeader class="">
						<CardTitle class="flex items-center gap-2">
							<Calendar class="w-5 h-5" />
							Informations du Compte
						</CardTitle>
					</CardHeader>
					<CardContent class="space-y-3">
						<div>
							<p
								class="text-sm font-medium text-muted-foreground"
							>
								Compte Créé
							</p>
							<p class="text-sm">{formatDate(profile.createdAt)}</p>
						</div>
						<div>
							<p
								class="text-sm font-medium text-muted-foreground"
							>
								Dernière Mise à Jour
							</p>
							<p class="text-sm">{formatDate(profile.updatedAt)}</p>
						</div>
					</CardContent>
				</Card>
			</div>

			<div class="grid grid-cols-1 gap-6">
				<!-- Academic Information -->
				<Card class="">
					<CardHeader class="">
						<CardTitle class="flex items-center gap-2">
							<GraduationCap class="w-5 h-5" />
							Informations Académiques
						</CardTitle>
					</CardHeader>
					<CardContent class="space-y-3">
						<div>
							<p
								class="text-sm font-medium text-muted-foreground"
							>
								Année de Diplôme
							</p>
							<p class="text-sm">{profile.grad_year}</p>
						</div>

						{#if profile.moyenneL2 !== null || profile.moyenneL3 !== null}
							<div>
								<p
									class="text-sm font-medium text-muted-foreground mb-2"
								>
									Moyennes Académiques
								</p>
								<div class="space-y-1">
									{#if profile.moyenneL2 !== null}
										<div class="flex justify-between">
											<span class="text-sm">Moyenne L2 :</span>
											<Badge
												href={null}
												variant="secondary"
												class=""
											>{profile.moyenneL2}/20</Badge>
										</div>
									{/if}
									{#if profile.moyenneL3 !== null}
										<div class="flex justify-between">
											<span class="text-sm">Moyenne L3 :</span>
											<Badge
												href={null}
												variant="secondary"
												class=""
											>{profile.moyenneL3}/20</Badge>
										</div>
									{/if}
								</div>
							</div>
						{/if}

						{#if profile.admis && profile.admis.length > 0}
							<div>
								<p
									class="text-sm font-medium text-muted-foreground mb-2"
								>
									Programmes Admis
								</p>
								<div class="space-y-1">
									{#each profile.admis as program}
										<Badge
											href={null}
											variant="outline"
											class="mr-1 mb-1"
										>
											<Award class="w-3 h-3 mr-1" />
											{program}
										</Badge>
									{/each}
								</div>
							</div>
						{/if}

						<div>
							<p
								class="text-sm font-medium text-muted-foreground"
							>
								Programme Choisi
							</p>
							<Badge
								href={null}
								variant="outline"
								class="mt-1"
							>
								<Award class="w-3 h-3 mr-1" />
								{profile.choisi}
							</Badge>
						</div>
					</CardContent>
				</Card>

				<!-- Professional Experience -->
				{#if profile.travails && profile.travails.length > 0}
					<Card class="">
						<CardHeader class="">
							<CardTitle class="flex items-center gap-2">
								<Briefcase class="w-5 h-5" />
								Expérience Professionnelle
							</CardTitle>
						</CardHeader>
						<CardContent class="">
							<div class="flex flex-wrap gap-2">
								{#each profile.travails as job}
									<Badge
										href={null}
										variant="outline"
										class=""
									>
										{job}
									</Badge>
								{/each}
							</div>
						</CardContent>
					</Card>
				{/if}
			</div>
		</div>

		<!-- Description -->
		<Card class="">
			<CardHeader class="">
				<CardTitle class="">À Propos</CardTitle>
			</CardHeader>
			<CardContent class="">
				<div class="prose prose-sm max-w-none dark:prose-invert">
					<Markdown markdown={(profile.description ?? "") as string} />
				</div>
			</CardContent>
		</Card>

		{#if showAdmin}
			<Card class="">
				<CardHeader class="">
					<CardTitle class="">Admin</CardTitle>
				</CardHeader>
				<CardContent class="space-y-3">
					<div class="space-y-1">
						<label class="text-sm text-muted-foreground">Entrez le login de l'utilisateur pour confirmer</label>
						<input type="text" class="border-input bg-background ring-offset-background placeholder:text-muted-foreground shadow-xs h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base outline-none" bind:value={adminLoginConfirm} placeholder={expectedLogin ?? profile.login ?? ''} />
					</div>
					<div class="flex gap-2">
						<button
							type="button"
							class="inline-flex items-center rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
							onclick={() => onGrantAdmin && onGrantAdmin(adminLoginConfirm)}
							disabled={profile.admin === true || (expectedLogin ?? profile.login ?? '') !== adminLoginConfirm}
						>
							Donner admin
						</button>
						<button
							type="button"
							class="inline-flex items-center rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
							onclick={() => onRevokeAdmin && onRevokeAdmin(adminLoginConfirm)}
							disabled={!profile.admin || (expectedLogin ?? profile.login ?? '') !== adminLoginConfirm}
						>
							Retirer admin
						</button>
						<button
							type="button"
							class="inline-flex items-center rounded-md bg-destructive text-white px-3 py-2 text-sm hover:bg-destructive/90"
							onclick={() => onDelete && onDelete(adminLoginConfirm)}
							disabled={profile.admin === true || (expectedLogin ?? profile.login ?? '') !== adminLoginConfirm}
						>
							Supprimer cet utilisateur
						</button>
					</div>
				</CardContent>
			</Card>
		{/if}
	</div>
{/if}


