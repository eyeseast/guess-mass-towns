#!/usr/bin/env node

/*
Read a feature collection by filename and add an ID property on each feature.
Write to STDOUT.

node add-feature-id.js geom.json id > geom-with-id.json
*/

const { readFile } = require("fs/promises");

async function main() {
	const [filename, property = "id"] = process.argv.slice(2, 4);

	const fc = await readFile(filename).then(JSON.parse);

	fc.features.forEach(feature => {
		feature.id = feature.properties[property];
		delete feature.properties[property];
	});

	process.stdout.write(JSON.stringify(fc));
}

if (module === require.main) {
	main().catch(console.error);
}
