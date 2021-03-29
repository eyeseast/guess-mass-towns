<svelte:options accessors />

<script>
	import { onMount, setContext } from "svelte";
	import * as topojson from "topojson-client";

	import { current, guess, guesses, queue, saveStore } from "./stores.js";
	import Guesses from "./components/Guesses.svelte";
	import Intro from "./components/Intro.svelte";
	import PlaceMap from "./components/PlaceMap.svelte";

	export const ui = {};
	export let name = "";
	export let url = "";

	export let topology = null;
	export let places = null;

	let started = false;

	$: if (topology && name) {
		places = topojson.feature(topology, name);
	}

	$: if (places && places.features) {
		$queue = places.features;
	}
	$: bbox = topology?.bbox;

	setContext("guess-mass-towns", {
		getMap: () => ui.map,
	});

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
		$current = queue.shift();
	}

	export function check() {
		guesses.guess($current.id, $current.id === $guess.id);
	}

	export function next() {
		$guess = null;
		$current = queue.shift();
	}

	export function getQueue() {
		return $queue;
	}

	export function getGuess() {
		return $guess;
	}

	export function getGuesses() {
		return $guesses;
	}

	export function getCurrent() {
		return $current;
	}
</script>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>

<main>
	{#if !started}
		<Intro bind:this={ui.intro} disabled={!$queue} on:click={start} />
	{:else}
		<Guesses bind:this={ui.guesses} {places} />
	{/if}
	{#if places && bbox}
		<PlaceMap bind:this={ui.map} {places} {bbox} />
	{/if}
</main>
