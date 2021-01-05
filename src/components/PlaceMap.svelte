<script>
	import mapboxgl from "mapbox-gl";
	import { onMount, afterUpdate } from "svelte";

	mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

	export let places = { features: [] };
	export let bbox;

	let container;
	let map;

	$: if (map && places.features.length) {
		map.getSource("places")?.setData(places);
	}

	onMount(() => {
		map = new mapboxgl.Map({
			container,
			style: "mapbox://styles/mapbox/streets-v11",
			bounds: bbox,
		});

		map.on("load", onLoad);

		window.map = map;
	});

	function onLoad() {
		map.addSource("places", { type: "geojson", data: places });

		map.addLayer({
			id: "places-lines",
			type: "line",
			source: "places",
			layout: {
				"line-join": "round",
				"line-cap": "round",
			},
			paint: {
				"line-color": "#888",
				"line-width": 0.5,
			},
		});

		map.addLayer({
			id: "places-fill",
			type: "fill",
			source: "places",
			paint: {
				"fill-color": "blue",
				"fill-opacity": 0,
			},
		});

		// Change the cursor to a pointer when the mouse is over the states layer.
		map.on("mouseenter", "places-fill", () => {
			map.getCanvas().style.cursor = "pointer";
		});

		// Change it back to a pointer when it leaves.
		map.on("mouseleave", "places-fill", () => {
			map.getCanvas().style.cursor = "";
		});

		map.on("click", "places-fill", onClick);
	}

	function onClick(e) {
		const [place] = e.features;

		console.log(place?.properties?.name);
	}
</script>

<style>
	.map {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 100%;
	}
</style>

<div class="map" bind:this={container} />