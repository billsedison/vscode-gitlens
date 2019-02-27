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

// 4. Write the JSON to package.json
fs.writeFileSync('./package.json', JSON.stringify(newPackageJSON, null, 2));

// // 5. Run npm command
// const { spawnSync } = require('child_process');
// let cmd;
// if (process.argv.length === 3) {
//   cmd = spawnSync('npm', [process.argv[2]]);
// } else {
//   cmd = spawnSync('npm', [process.argv[2], process.argv[3]]);
// }
// console.log(cmd.stdout.toString());
// console.error(cmd.stderr.toString());

// // 6. Rename the original package.json back to package.json
// fs.renameSync('./package.json.orig', './package.json');