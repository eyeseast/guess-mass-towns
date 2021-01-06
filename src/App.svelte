<script>
	import { onMount, setContext } from "svelte";
	import * as topojson from "topojson-client";

	import { guesses, queue } from "./stores.js";
	import Guesses from "./components/Guesses.svelte";
	import Intro from "./components/Intro.svelte";
	import PlaceMap from "./components/PlaceMap.svelte";

	export let name = "";
	export let url = "";

	export let current;
	export let guess;
	let topology;
	let places;
	let started = false;

	$: if (topology && name) {
		places = topojson.feature(topology, name);
		$queue = places.features;
	}

	$: bbox = topology?.bbox;

	$: console.log(current);

	onMount(async () => {
		topology = await fetch(url).then(r => r.json());
	});

	export function start() {
		started = true;
		current = queue.shift();
	}

	export function check() {
		return current.properties.id === guess.properties.id;
	}

	export function next() {
		guess = null;
		current = queue.shift();
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
		<PlaceMap {places} {bbox} on:click={e => (guess = e.detail)} />
	{/if}
</main>
