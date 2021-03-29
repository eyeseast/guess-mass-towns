<script>
	import mapboxgl from "mapbox-gl";
	import { onMount, afterUpdate, createEventDispatcher } from "svelte";
	import { current, guess } from "../stores.js";

	mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

	export let places = { features: [] };
	export let bbox;

	let container;
	let map;
	let hoveredStateId = null;

	const dispatch = createEventDispatcher();

	$: if (map && places.features.length) {
		map.getSource("places")?.setData(places);
	}

	onMount(() => {
		map = new mapboxgl.Map({
			container,
			style: "mapbox://styles/mapbox/streets-v11",
			bounds: bbox,
			maxZoom: 12,
		});

		map.on("load", onLoad);

		map.addControl(new mapboxgl.NavigationControl());

		window.map = map;

		return () => {
			map.remove();
		};
	});

	export function show() {
		if (!$current) return;
		const { coordinates } = $current.geometry;
		const bbox = coordinates[0].reduce(
			(bounds, coord) => bounds.extend(coord),
			new mapboxgl.LngLatBounds()
		);

		map.fitBounds(bbox, { padding: 300 });
	}

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
				"fill-opacity": [
					"case",
					["boolean", ["feature-state", "hover"], false],
					0.6,
					0.3,
				],
			},
		});

		// Change the cursor to a pointer when the mouse is over the places-fill layer.
		map.on("mousemove", "places-fill", e => {
			map.getCanvas().style.cursor = "pointer";

			const [place] = e.features;

			if (hoveredStateId !== null) {
				map.setFeatureState({ source: "places", id: hoveredStateId }, { hover: false });
			}
			hoveredStateId = place.id;
			map.setFeatureState({ source: "places", id: place.id }, { hover: true });
		});

		// Change it back to a pointer when it leaves.
		map.on("mouseleave", "places-fill", e => {
			map.getCanvas().style.cursor = "";

			if (hoveredStateId !== null) {
				map.setFeatureState({ source: "places", id: hoveredStateId }, { hover: false });
			}
			hoveredStateId = null;
		});

		map.on("click", "places-fill", onClick);
	}

	function onClick(e) {
		const [place] = e.features;

		console.log(place?.properties?.name);

		$guess = place;
		dispatch("click", place);
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
