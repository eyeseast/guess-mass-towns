// share data and guesses across components
import { shuffle } from "lodash-es";

import { writable } from "svelte/store";

export function saveStore(
	store,
	key,
	{ storage = sessionStorage, serialize = JSON.stringify, deserialize = JSON.parse }
) {
	if (!store || !key) return;

	const saved = storage.getItem(key);
	if (saved) {
		store.set(deserialize(saved));
	}

	return store.subscribe($value => {
		storage.setItem(key, serialize($value));
	});
}

function createGuessStore(initial = new Map()) {
	const { set, update, subscribe } = writable(initial);

	return {
		guess(id, correct) {
			update(s => s.set(id, correct));
		},
		set,
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
				return $places;
			});
			return val;
		},

		unshift(...items) {
			let len;
			update($places => {
				len = $places.unshift(...items);
				return $places;
			});
			return len;
		},

		push(...items) {
			let len;
			update($places => {
				len = $places.push(...items);
				return $places;
			});
			return len;
		},

		pop() {
			let val;
			update($places => {
				val = $places.pop();
				return $places;
			});
			return val;
		},
	};
}

export const current = writable();
export const guess = writable();
export const guesses = createGuessStore();
export const queue = createQueue();
