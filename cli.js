#!/usr/bin/env node
'use strict';

const program = require('commander');

const { validateProvider, SUPPORTED_PROVIDERS } = require('./src/validators');
const installResource = require('./src/install');
const uninstallResource = require('./src/uninstall');
const packageJson = require('./package.json');

program.version(packageJson.version);
program.name('altvrd');
program.usage('<command> [options]');

// Install
program
  .command('install <author/repo>')
  .alias('i')
  .description('Installs a resource with the given name')
  .option(
    '-f, --force',
    'skips the check if the resource is already installed (DANGER: if it is, its folder ' +
      'will be deleted!)'
  )
  .option('-d, --dry-run', 'just check the resource info, not actually downloading it')
  .option(
    `-p, --provider <${SUPPORTED_PROVIDERS.join('|')}>`,
    'download the resource from other providers',
    validateProvider,
    'github'
  )
  .action(installResource);

// Remove
program
  .command('uninstall <author/repo>')
  .alias('u')
  .description('Uninstalls an existing resource (and delete the folder from resources).')
  .option('-f, --force', 'skips the check and deletes the resource folder without confirmation.')
  .action(uninstallResource);

program.parse(process.argv);

if (process.argv.length < 3) {
  program.help();
}
