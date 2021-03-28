<script>
	import { guesses } from "../stores.js";

	export let current;
	export let places = { features: [] };

	let opened;

	$: index = places.features.reduce((m, f) => {
		m.set(f.id, f.properties.name);
		return m;
	}, new Map());
</script>

<style>
	.tray {
		z-index: 100;
		background-color: white;
		position: relative;
		margin: 2em auto;
		padding: 2em;
		max-width: 80%;
		transform: translate(0, 80vh);
		transition: transform 0.5s ease;
	}

	.tray.opened {
		transform: translate(0, 0);
	}
</style>

<div class="tray" class:opened>
	<button on:click={e => (opened = !opened)}>
		{#if opened}Close{:else}Open{/if}
	</button>
	{#if current}
		<div class="current">
			<p>
				Find {current.properties.name}
				<button>Show me</button>
			</p>
		</div>
	{/if}

	<div class="guesses">
		<ul>
			{#each [...$guesses] as [id, correct] (id)}
				<li>{index[id]}: {correct}</li>
			{/each}
		</ul>
	</div>
</div>
