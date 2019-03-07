const fs = require('fs');

// 1. Read the original package.json
const jsonMeta = JSON.parse(fs.readFileSync('./package.json.orig'));

// 2. Extract the following fields
const fields = [
  'name',
  'displayName',
  'description',
  'version',
  'author',
  'publisher',
  'license',
  'homepage',
  'bugs',
  'repository',
  'engines',
  'main',
  'icon',
  'preview',
  'badges',
  'categories',
  'galleryBanner',
  'keywords',
  'activationEvents',
  'scripts',
  'dependencies',
  'devDependencies'
];
const newPackageJSON = {};

fields.forEach((field) => {
  newPackageJSON[field] = jsonMeta[field];
});

// 3. Write the JSON to package.json
fs.writeFileSync('./package.json', JSON.stringify(newPackageJSON, null, 4));
