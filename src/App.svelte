<script>
	import { onMount, setContext } from "svelte";
	import * as topojson from "topojson-client";

	import { guesses, queue, saveStore } from "./stores.js";
	import Guesses from "./components/Guesses.svelte";
	import Intro from "./components/Intro.svelte";
	import PlaceMap from "./components/PlaceMap.svelte";

	export let name = "";
	export let url = "";

	export let current;
	export let guess;
	export let topology;
	export let places;
	let started = false;

	$: if (topology && name) {
		places = topojson.feature(topology, name);
	}

	$: if (places && places.features) {
		$queue = places.features;
	}
	$: bbox = topology?.bbox;

	onMount(async () => {
		saveStore(guesses, "$guesses", {
			serialize: g => JSON.stringify([...g]),
			deserialize: g => new Map(JSON.parse(g || "null")),
		});

		topology = await fetch(url).then(r => r.json());

		window.queue = queue;

		return () => {};
	});

	export function start() {
		started = true;
		current = queue.shift();
	}

	export function check() {
		guesses.guess(current.properties.id, current.properties.id === guess.properties.id);
	}

	export function next() {
		guess = null;
		current = queue.shift();
	}

	export function getQueue() {
		return $queue;
	}
</script>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>

<svelte:options accessors />

<main>
	{#if !started}
		<Intro disabled={!$queue} on:click={start} />
	{:else}
		<Guesses {places} {current} />
	{/if}
	{#if places && bbox}
		<PlaceMap {places} {bbox} {current} {guess} on:click={e => (guess = e.detail)} />
	{/if}
</main>
