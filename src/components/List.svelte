<script>
	import { guesses } from "../stores.js";
	export let places = { features: [] };
</script>

<style>
	li.correct {
		color: green;
	}

	li.incorrect {
		color: red;
	}
</style>

<ul class="towns">
	{#each places.features as town}
		<li
			class:correct={$guesses.get(town.properties.id)}
			class:incorrect={$guesses.get(town.properties.id) === false}>
			{town.properties.name}
		</li>
	{/each}
</ul>
