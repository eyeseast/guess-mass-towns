<script>
	import { onMount, setContext } from "svelte";
	import * as topojson from "topojson-client";

	import { guesses } from "./stores.js";
	import PlaceMap from "./components/PlaceMap.svelte";

	export let name = "";
	export let url = "";

	// remove these exports later
	export let topology = null;
	export let places = { features: [] };

	$: if (topology && name) {
		places = topojson.feature(topology, name);
	}

	$: bbox = topology?.bbox;

	$: unguessed = places.features.filter(f => !$guesses.has(f.properties.id));

	onMount(async () => {
		topology = await fetch(url).then(r => r.json());
	});
</script>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
	}
</style>

<svelte:options accessors />

<main>
	{#if places && bbox}
		<PlaceMap {places} {bbox} />
	{/if}
</main>
