// See https://kit.svelte.dev/docs/types#app

import type { User } from "@prisma/client";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: { // verify is is consistent with hooks.server.js
				id: string,
				prenom: string,
				nom: string | null,
				admin: boolean,
				login: string,
				sleeping: true,
			} | null
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
