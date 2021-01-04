<script>
	import { onMount } from "svelte";
	import * as topojson from "topojson-client";

	export let name = "";
	export let url = "";

	// remove these exports later
	export let topology;
	export let guesses = new Map();

	$: towns = topology
		? topojson.feature(topology, topology.objects.towns)
		: { features: [] };

	onMount(async () => {
		topology = await fetch(url).then((r) => r.json());
	});

	export function getTowns() {
		return towns;
	}

	export function guess(id, correct) {
		guesses.set(id, correct);
		guesses = guesses;
	}
</script>

<style>
	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	li.correct {
		color: green;
	}

	li.incorrect {
		color: red;
	}
</style>

<svelte:options accessors />

<main>
	<h1>{name}</h1>
	<ul class="towns">
		{#each towns.features as town}
			<li
				class:correct={guesses.get(town.properties.id)}
				class:incorrect={guesses.get(town.properties.id) === false}>
				{town.properties.name}
				<button on:click={(e) => guess(town.properties.id, true)}>Yes</button>
				<button on:click={(e) => guess(town.properties.id, false)}>No</button>
			</li>
		{/each}
	</ul>
</main>
