const { checkNodeVersion, checkNewestVersion } = require('./version');
const uninstallResource = require('./scripts/uninstall');

const uninstall = async (resourcePath, args) => {
  await checkNodeVersion();
  await checkNewestVersion();
  // Lowercase the resource path so it won't conflict
  uninstallResource(resourcePath.toLowerCase(), args);
};

module.exports = uninstall;
