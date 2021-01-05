<script>
	import { fade } from "svelte/transition";

	export let disabled = false;
</script>

<style>
	.intro {
		z-index: 100;
		position: relative;
		background-color: white;
		margin: 2em auto;
		width: 66%;
		padding: 2em;
	}
</style>

<div class="intro" transition:fade>
	<h2>Learn Massachusetts Geography</h2>
	<p>
		There are 351 towns in Massachusetts. This is a guessing game to help learn where
		they are.
	</p>

	<p>
		Given the name of a town, try to find it on the map. Click a place and see if you're
		right.
	</p>

	<button {disabled} on:click>Start</button>
</div>
