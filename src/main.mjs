import App from "./App.svelte";

const url = "data/towns.json";

const app = new App({
	target: document.body,
	props: {
		name: "towns",
		url,
	},
});

export default app;
