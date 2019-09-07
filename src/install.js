const chalk = require('chalk');
const ora = require('ora');

const { checkNodeVersion, checkNewestVersion } = require('./version');
const installResource = require('./scripts/install');
const { fetchLatestRelease } = require('./scripts/fetch');
const configFile = require('./scripts/config');

const SPINNER = ora();

const install = async (resourcePath, args) => {
  await checkNodeVersion();
  await checkNewestVersion();
  await configFile.checkAndCreate().then(() => {
    // Lowercase the resource path so it won't conflict
    runInstall(resourcePath.toLowerCase(), args);
  });
};

// TODO: Move this to scripts/install.js
const runInstall = (resourcePath, args) => {
  SPINNER.info(`Fetching ${resourcePath} from GitHub.`);
  fetchLatestRelease(resourcePath).then((data) => {
    const resource = configFile.getResource(resourcePath);
    if (resource.isInstalled) {
      const shouldUpdate = configFile.utils.shouldUpdate(resource, data.version);
      if (!shouldUpdate && !args.force) {
        SPINNER.succeed(
          `You already have the latest version of ${chalk.bold(resource.name)} installed.`
        );
        process.exit(0);
      }
    }
    if (args.dryRun) {
      // TODO: Package information
      process.exit(0);
    }
    installResource(resourcePath, data, args);
  });
};

module.exports = install;
