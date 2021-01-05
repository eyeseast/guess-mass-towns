<script>
	import { onMount, setContext } from "svelte";
	import * as topojson from "topojson-client";

	import { guesses, queue } from "./stores.js";
	import Intro from "./components/Intro.svelte";
	import PlaceMap from "./components/PlaceMap.svelte";

	export let name = "";
	export let url = "";

	let topology;
	let places;
	let started = false;
	let current;

	$: if (topology && name) {
		places = topojson.feature(topology, name);
		$queue = places.features;
	}

	$: bbox = topology?.bbox;

	onMount(async () => {
		topology = await fetch(url).then(r => r.json());
	});

	export function start() {
		started = true;
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
		<Intro disabled={!places} on:click={start} />
	{/if}
	{#if places && bbox}
		<PlaceMap {places} {bbox} />
	{/if}
</main>
