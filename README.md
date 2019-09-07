<p align="center">
	<img src="https://i.imgur.com/4b33Qbj.png" width="600">
	<h3 align="center">Download resources like it's 2019.</h3>
</p>
<p align="center">
	<a href="https://travis-ci.com/altvrd/cli"><img src="https://travis-ci.com/altvrd/cli.svg?branch=master"></a>
	<a href="http://commitizen.github.io/cz-cli/"><img src="https://camo.githubusercontent.com/6080f52144977b8b2b20e42408379ce68371aafd/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f636f6d6d6974697a656e2d667269656e646c792d627269676874677265656e2e737667"></a>
</p>
<p align="center">
	<h6 align="center">THIS TOOL IS IN BETA. <a href="#always-in-beta-">READ HERE</a>.</h6>
</p>

## Introduction

To install new [alt:V resources](https://altv.mp) into your project nowadays is a 100% manual process that can give you a lot of headaches if done incorrectly. **alt:V Resource Downloader** comes with the mission to bridge the gap between developers and server owners to make collaboration in our community easier, and help with this process.

alt:V Resource Downloader is NOT maintained, affiliated or sponsored by alt:V team. Any requests or bugs should be addressed in this repository's issues section or talking directly to `vanessa#7275`, and nowhere else.

## (Always in) Beta ⚡

This tool has some improvements to be done and wasn't tested in all possible platforms. If you want to help this project to develop further, suggestions and bug reports on the [Issues](https://github.com/altvrd/cli/issues/) section are appreciated!

## Installation

Use it with npx (doesn't get installed on your computer):

```bash
npx altvrd --help
npx altvrd i altmp/ls-gangwar
```

Or, if you wish, install it globally:

```bash
npm i -g altvrd
altvrd --help
```

## Usage

```bash
altvrd install altmp/ls-gangwar
# or altvrd i altmp/ls-gangwar

altvrd uninstall altmp/ls-gangwar
# or altvrd u altmp/ls-gangwar
```

###### If you rename folders once they're installed, don't forget to rename the `folder` option on the [altvrd configuration file](#what-is-altvrdjson). This tool isn't smart enough - yet! - to detect renames (but it is to detect anomalies, so you'll receive a warning nevertheless).

## Available commands

Use `altvrd [command] -h` to check what options each command has.

- `install <author/repo>` - Installs a resource using the author username and repository slug.
- `uninstall <author/repo>` - Uninstalls a resource.

## How to publish my resource?

1.  Publish your resource on GitHub (GitLab and Bitbucket support coming soon!)
1.  Use [releases](https://help.github.com/en/articles/creating-releases) and [semantic versioning](https://semver.org/) for the tool to detect updates correctly (optional, but if you don't the tool will always download from `master` branch)
1.  Keep your resource at root level (don't nest it)

    > We have plans to implement a way for developers to specify what folder to install

1.  Add this badge to your resource's README to show some support!

    ![altvrd friendly](https://img.shields.io/badge/altvrd-friendly-50753A)

    ```markdown
    ![altvrd friendly](https://img.shields.io/badge/altvrd-friendly-50753A)
    ```

1.  Add it to our [awesome-altv-resources](https://github.com/altvrd/awesome-altv-resources) list :sparkles: (optional)

## What is `altvrd.json`?

It's the file we use to keep your resources updated. Every time you install a new resource, we will check if it's already installed and tell you if it's needed to be updated or not. Here's an example:

```js
{
  "resources": {
	// This resource uses releases (it has `version` filled)
    "john-doe/my-awesome-resource": {
		// useful to determine if it needs to be updated
		"version": "1.2.1",
		// the folder name, useful to make sure a given resource isn't installed twice
		"folder": "john-doe@my-awesome-resource",
		// the latest version url
		"url": "https://api.github.com/repos/john-doe/my-awesome-resource/zipball/v1.2.1"
	},
	// This resource doesn't use releases, so it will always be downloaded from master
	"team-stuyk-alt-v/altv-extended": {
		"folder": "team-stuyk-alt-v@altv-extended",
		"url": "https://github.com/team-stuyk-alt-v/altV-Extended/archive/master.zip"
	}
  }
}
```

## Credits

alt:V Resource Downloader is inspired by [fvm-installer](https://github.com/qlaffont/fvm-installer), a resource installer for FiveM.
