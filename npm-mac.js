const fs = require('fs');

// 1. Read the original package.json
const jsonMeta = JSON.parse(fs.readFileSync('./package.json.orig'));

// 2. Extract the following fields only
// - engines
// - scripts
// - dependencies
// - devDependencies
const fields = ['engines', 'scripts', 'dependencies', 'devDependencies'];
const newPackageJSON = {};

fields.forEach((field) => {
  newPackageJSON[field] = jsonMeta[field];
});

// 3. Write the JSON to package.json
fs.writeFileSync('./package.json', JSON.stringify(newPackageJSON, null, 4));
