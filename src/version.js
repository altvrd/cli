const chalk = require('chalk');
const semver = require('semver');
const ora = require('ora');
const latestVersion = require('latest-version');
const boxen = require('boxen');

const packageJson = require('../package.json');

const checkNodeVersion = async () => {
  if (!semver.satisfies(process.version, '>=7.0.0')) {
    console.log(
      chalk.yellow(
        `You use Node ${process.version} and ${packageJson.label} requires Node >=7.0.0.\n` +
          `Please, upgrade it to use this tool correctly.`
      )
    );
    process.exit(1);
  }
};

const checkNewestVersion = async () => {
  const spinner = ora(
    `Checking version of ${chalk.bold(packageJson.name)}, this won't take long.`
  ).start();
  const lv = await latestVersion(packageJson.name);
  spinner.stop();
  if (lv !== packageJson.version) {
    const warning =
      `${chalk.bold.green(`New version available for ${packageJson.label}!`)}\n` +
      `${packageJson.version} -> ${chalk.green(lv)}\n` +
      `Update it with ${chalk.bold(`npm i -g ${packageJson.name}`)}`;
    console.log(boxen(warning, { padding: 1, align: 'center' }));
  }
};

module.exports = { checkNewestVersion, checkNodeVersion };
