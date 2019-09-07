const chalk = require('chalk');
const axios = require('axios');
const semver = require('semver');
const ora = require('ora');

const { DOWNLOAD_SOURCES } = require('../constants');

const searchLatestTag = (name, data) => data.find((release) => !release.draft);
const SPINNER = ora();

const fetchLatestRelease = (resourcePath) => {
  return axios
    .get(`https://api.github.com/repos/${resourcePath}/releases`)
    .then(({ data }) => {
      if (!data.length) {
        SPINNER.info("This resource doesn't use releases. Downloading from master.");
        return {
          from: DOWNLOAD_SOURCES.master,
          url: `https://github.com/${resourcePath}/archive/master.zip`
        };
      }
      SPINNER.info('This resource uses releases. Downloading the latest one.');
      const latest = searchLatestTag(resourcePath, data);
      if (!latest) {
        SPINNER.fail("We couldn't find a published release. Maybe the releases are all draft?");
        SPINNER.info('Will download from master branch.');
        return {
          from: DOWNLOAD_SOURCES.master,
          url: `https://github.com/${resourcePath}/archive/master.zip`
        };
      }
      const version = semver.coerce(latest.tag_name).version;
      SPINNER.stopAndPersist({
        symbol: '📥',
        text: `Found the latest release link (${version}), will download it and install.`
      });
      return {
        from: DOWNLOAD_SOURCES.release,
        url: latest.zipball_url,
        version
      };
    })
    .catch((err) => {
      if (err.response && err.response.status === 404) {
        SPINNER.fail(
          `We couldn't find any repository on GitHub with this path: ${chalk.bold(resourcePath)}`
        );
        SPINNER.fail(
          `Make sure the value is correct and use this format: ${chalk.bold('author/repo')}`
        );
        process.exit(1);
      }
      SPINNER.stop();
    });
};

module.exports = { fetchLatestRelease };
