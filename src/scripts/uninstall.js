const rimraf = require('rimraf');
const inquirer = require('inquirer');
const ora = require('ora');

const configFile = require('./config');

const SPINNER = ora();

const _deleteFolder = (path) => rimraf.sync(path);

const _confirmDeletion = async (resource) =>
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'deleteFolder',
        message: `Do you confirm the deletion of ${resource.name} folder?`,
        default: false
      }
    ])
    .then(({ deleteFolder }) => {
      if (!deleteFolder) {
        SPINNER.info('Operation canceled by the user.');
        process.exit(0);
      }
    });

const uninstallResource = async (resourcePath, args) => {
  await configFile.checkAndCreate();
  const resource = configFile.getResource(resourcePath);
  if (!resource.isInstalled) {
    SPINNER.fail(`The resource ${resource.name} isn't installed.`);
    process.exit(1);
  }
  if (resource.hasFolder && !args.force) {
    await _confirmDeletion(resource);
  }
  const folder = configFile.utils.resolveInstallationFolder(resource.name);
  _deleteFolder(folder.absolutePath);
  await configFile.deleteResource(resource);
  SPINNER.succeed(`The resource ${resource.name} was successfully uninstalled.`);
};

module.exports = uninstallResource;
