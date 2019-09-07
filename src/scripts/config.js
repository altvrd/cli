const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const ora = require('ora');
const semver = require('semver');

const packageJson = require('../../package.json');

// TODO: This file can be improved and broken into smaller ones.
// Or even transformed into a class (would be better).

// Config file management

const CONFIG_FILE_NAME = 'altvrd.json';
const SPINNER = ora();

const _resolvePath = (filePath) => path.resolve(process.cwd(), filePath);

const configFilePath = _resolvePath(CONFIG_FILE_NAME);

const _writeToConfigFile = (data) =>
  fs.writeFileSync(configFilePath, JSON.stringify(data, null, 2));

const checkIsAtRightDirectory = () => {
  const resourcesExist = fs.existsSync(_resolvePath('resources'));
  if (!resourcesExist) {
    SPINNER.fail(
      `Please, execute ${packageJson.label} in your gamemode root ` +
        `directory (where there's a ${chalk.bold('resources')} folder).`
    );
    process.exit(1);
  }
};

const checkConfigFileExists = () => fs.existsSync(configFilePath);

const createConfigFile = () => {
  const defaultData = { resources: {} };
  _writeToConfigFile(defaultData);
};

const read = () => {
  const file = fs.readFileSync(configFilePath);
  return JSON.parse(file);
};

// Resource management

const _resourceFolderExists = (resource) =>
  fs.existsSync(path.resolve(process.cwd(), `./resources/${resource.folder}`));

const resolveInstallationFolder = (resourcePath) => {
  const existentResource = getResource(resourcePath);
  let folderName = resourcePath.replace(/\//, '@');
  if (existentResource && existentResource.hasFolder) {
    // If a folder already exists and, for some reason, was renamed, use it
    folderName = existentResource.data.folder;
  }
  return {
    absolutePath: path.resolve(process.cwd(), `./resources/${folderName}`),
    name: folderName
  };
};

const getResource = (name) => {
  // TODO: Check for similar names in case something was renamed
  // Maybe split and get the owner, then use meant() with all installed repos from the owner
  const configs = read();
  const resource = configs.resources[name];
  const value = { name, isInstalled: !!resource };
  if (resource) {
    value['data'] = resource;
    value['hasFolder'] = _resourceFolderExists(resource);
  }
  return value;
};

const checkIsInstalled = (name) => getResource(name).isInstalled;

const parseResourceData = (resourcePath) => {
  const [author, name] = resourcePath.split('/');
  return { author, name };
};

const shouldUpdate = (resource, suggestedVersion) => {
  if (!suggestedVersion) {
    // Resource does not use versioning, so it will always be downloaded
    return true;
  }
  return semver.gt(suggestedVersion, resource.data.version);
};

const writeResource = async (name, url, version, folder) => {
  const configs = await read();
  configs.resources[name] = { url };
  if (version) {
    configs.resources[name]['version'] = version;
  }
  if (folder) {
    configs.resources[name]['folder'] = folder;
  }
  _writeToConfigFile(configs);
};

const deleteResource = async (resource) => {
  const configs = await read();
  delete configs.resources[resource.name];
  _writeToConfigFile(configs);
};

const detectResourceAnomaly = (resource) => {
  if (!resource) return;
  if (resource.isInstalled && !resource.hasFolder) {
    SPINNER.warn(
      `${chalk.yellow.bold('WARNING:')} This resource is installed but its folder wasn't found. ` +
        `Please, if you rename a folder, make sure to rename it on ${chalk.bold('altvrd.json')} ` +
        `as well.`
    );
  }
};

// Execution

const checkAndCreate = async () => {
  SPINNER.start(`Reading ${CONFIG_FILE_NAME}...`);
  checkIsAtRightDirectory();
  const exists = await checkConfigFileExists();
  if (!exists) {
    SPINNER.stop();
    return inquirer
      .prompt([
        {
          type: 'confirm',
          name: 'createFile',
          message:
            `The configuration file ${CONFIG_FILE_NAME} doesn't exist in this directory. ` +
            'Do you want to create it?',
          default: true
        }
      ])
      .then(async ({ createFile }) => {
        if (!createFile) {
          SPINNER.info("We can't install resources without this file, operation was canceled.");
          process.exit(0);
        } else {
          await createConfigFile();
          SPINNER.succeed(`Created file ${CONFIG_FILE_NAME} succesfully.`);
        }
      });
  }
  SPINNER.stop();
};

module.exports = {
  checkAndCreate,
  read,
  exists: checkConfigFileExists,
  writeResource,
  deleteResource,
  getResource,
  utils: {
    checkIsInstalled,
    shouldUpdate,
    parseResourceData,
    resolveInstallationFolder,
    detectResourceAnomaly
  }
};
