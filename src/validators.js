const chalk = require('chalk');
const ora = require('ora');

const { ensureNoSlash } = require('./utils/general');
const packageJson = require('../package.json');

const SUPPORTED_PROVIDERS = ['github'];
const SPINNER = ora();

const newIssueUrl = () => `➡️  ${ensureNoSlash(packageJson.repository)}/issues/new/`;

const validateProvider = (provider) => {
  if (!SUPPORTED_PROVIDERS.includes(provider)) {
    const options = SUPPORTED_PROVIDERS.join(', ');
    SPINNER.fail(
      `The provider ${chalk.bold(provider)} isn't supported, the command won't run. ` +
        `Please, use one of the options: ${chalk.white(options)}`
    );
    SPINNER.fail(
      `If you believe this provider should be supported, ` +
        `feel free to open an issue here:\n${newIssueUrl()}`
    );
    process.exit(1);
  }
  return provider;
};

module.exports = { validateProvider, SUPPORTED_PROVIDERS };
