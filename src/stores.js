// share data and guesses across components

import { writable } from "svelte/store";

function createGuessStore() {
	const { update, subscribe } = writable(new Map());

	return {
		guess(id, correct) {
			update(s => s.add(id, correct));
		},

		subscribe,
	};
}

export const guesses = createGuessStore();
