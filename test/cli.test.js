import test from 'ava';
import execa from 'execa';
import path from 'path';

const cli = (args) => {
  const cliPath = path.resolve('./cli.js');
  return execa.commandSync(`node ${cliPath} ${args}`);
};

// TODO:
// exits on incompatible node versions
// executes install command correctly
// executes uninstall command correctly
// unit test every helper in config file
