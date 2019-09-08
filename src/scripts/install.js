const chalk = require('chalk');
const ora = require('ora');
const inquirer = require('inquirer');
const axios = require('axios');
const rimraf = require('rimraf');
const unzipper = require('unzipper');
const tmp = require('tmp');
const fs = require('fs');

const configFile = require('./config');

const SPINNER = ora();

const createDirectoryIfDoesNotExist = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
};

const deleteDirectory = (resource) => rimraf.sync(resource.data.folder);

const installZipFiles = async (installationFolder, response) => {
  // Creates a temporary file to write response data
  const tempFile = tmp.fileSync({ prefix: 'altvrd-', postfix: '.zip' });
  fs.writeFileSync(tempFile.name, response.data);
  // Opens the file with unzipper
  const zipped = await unzipper.Open.file(tempFile.name);
  zipped.files.forEach((file) => {
    // Replace the path to make the files go to root directory
    file.path = file.path
      .split('/')
      .slice(1)
      .join('/');
    const output = `${installationFolder}/${file.path}`;
    if (file.type === 'Directory') {
      createDirectoryIfDoesNotExist(output);
      return;
    }
    file.buffer().then((buffer) => {
      fs.writeFileSync(output, buffer);
    });
  });
};

const installFromMaster = async (installationFolder, response) => {
  createDirectoryIfDoesNotExist(installationFolder);
  await installZipFiles(installationFolder, response);
};

const installFromRelease = async (installationFolder, response) => {
  createDirectoryIfDoesNotExist(installationFolder);
  await installZipFiles(installationFolder, response);
};

const _checkResponseIsZip = (response) => {
  if (response.headers['content-type'] !== 'application/zip') {
    SPINNER.fail(
      `${chalk.bold('Something wrong happened')}. This request didn't return a .zip file. ` +
        `Maybe the repository is empty?`
    );
    process.exit(1);
  }
};

const downloadAndUnzip = async (resourcePath, data, folder) => {
  const { url, from } = data;
  return await axios
    .get(url, { responseType: 'arraybuffer' })
    .then((response) => {
      _checkResponseIsZip(response);
      if (from === 'release') {
        SPINNER.start(`Installing the latest release (${data.version})`);
        installFromRelease(folder, response);
      } else if (from === 'master') {
        SPINNER.start('Installing from master branch');
        installFromMaster(folder, response);
      }
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
};

const confirmDeletion = async (resource) => {
  SPINNER.warn(
    `${chalk.bold.yellow(
      'WARNING:'
    )} In order to update this resource, we need to remove its folder.`
  );
  SPINNER.warn('Please, save any modifications you may have made and confirm the deletion below.');
  return inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'deleteFolder',
        message: 'Do you confirm the deletion?',
        default: false
      }
    ])
    .then(async ({ deleteFolder }) => {
      if (!deleteFolder) {
        SPINNER.info('Operation canceled by the user.');
        process.exit(0);
      }
      await deleteDirectory(resource);
      SPINNER.stop();
    });
};

const installedMessage = (resource, data) => {
  let name = resource.name;
  let end = 'was successfully installed';
  if (data.version) {
    // If the resource has version, add the new version to the name
    name += `@${data.version}`;
  } else {
    // If it doesn't, just say it's the latest one
    end += ' to the latest version';
  }
  return `${chalk.bold(name)} ${end}.`;
};

const installResource = async (resourcePath, data, args) => {
  const resource = configFile.getResource(resourcePath);
  if (resource.isInstalled) {
    await configFile.utils.detectResourceAnomaly(resource, args);

    if (resource.hasFolder && !args.force) {
      await confirmDeletion(resource);
    }
  }
  SPINNER.start('Downloaded the resource. Installing it.');
  const folder = configFile.utils.resolveInstallationFolder(resourcePath);
  await downloadAndUnzip(resource.name, data, folder.absolutePath);
  await configFile.writeResource(resource.name, data.url, data.version, folder.name);
  SPINNER.stopAndPersist({
    text: installedMessage(resource, data),
    symbol: '✨'
  });
  SPINNER.info(
    `Add "${folder.name}" to your .cfg file (under ${chalk.bold('resources')}) section to use it.`
  );
};

module.exports = installResource;
