// share data and guesses across components
import { shuffle } from "lodash-es";

import { writable, derived } from "svelte/store";

function createGuessStore() {
	const { update, subscribe } = writable(new Map());

	return {
		guess(id, correct) {
			update(s => s.set(id, correct));
		},

		subscribe,
	};
}

function createQueue(places = []) {
	const { set, update, subscribe } = writable(shuffle(places));

	return {
		subscribe,
		set($places) {
			set(shuffle($places));
		},
		shift() {
			let val;
			update($places => {
				val = $places.shift();
			});
			return val;
		},

		unshift(...items) {
			let len;
			update($places => {
				len = $places.unshift(...items);
			});
			return len;
		},

		push(...items) {
			let len;
			update($places => {
				len = $places.push(...items);
			});
			return len;
		},

		pop() {
			let val;
			update($places => {
				val = $places.pop();
			});
			return val;
		},
	};
}

export const guesses = createGuessStore();
export const queue = createQueue([]);
