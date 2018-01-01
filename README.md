# @pnpm/self-installer

> Installs pnpm

<!--@shields('npm', 'travis')-->
[![npm version](https://img.shields.io/npm/v/@pnpm/self-installer.svg)](https://www.npmjs.com/package/@pnpm/self-installer) [![Build Status](https://img.shields.io/travis/pnpm/self-installer/master.svg)](https://travis-ci.org/pnpm/self-installer)
<!--/@-->

## Usage

Use [unpkg](https://unpkg.com/) to access the installation script and set up pnpm:

    curl -L https://unpkg.com/@pnpm/self-installer | node

The above script will install the latest version of pnpm but you may also install
a specific version:

    curl -L https://unpkg.com/@pnpm/self-installer@1.16.2 | node

You can also use a semver range:

    curl -L https://unpkg.com/@pnpm/self-installer@1 | node

Or a tag:

    curl -L https://unpkg.com/@pnpm/self-installer@next | node

**NOTE:** Installation by version or range works from `1.16.2` only.

## License

[MIT](./LICENSE) © [Zoltan Kochan](https://www.kochan.io/)
