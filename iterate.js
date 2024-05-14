const pkg = require('./package.json');
const fs = require('fs');

function iterateVersion(v) {
  let [major, minor, patch] = v.split('.');
  patch++;
  return [major, minor, patch].map((x) => parseInt(x));
}

function writePackageJson() {
  const [major, minor, patch] = iterateVersion(pkg.version);
  pkg.version = `${major}.${minor}.${patch}`;
  fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
}

writePackageJson();
