'use strict'
const path = require('path')
const installTo = require('./installTo')

installTo({
    dest: process.env.PNPM_DEST && path.resolve(process.env.PNPM_DEST),
    binPath: process.env.PNPM_BIN_DEST && path.resolve(process.env.PNPM_BIN_DEST),
    version: process.env.PNPM_VERSION || getDefaultVersion(),
    registry: process.env.PNPM_REGISTRY || 'https://registry.npmjs.org/',
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

function getDefaultVersion () {
  const nodeMajor = require('semver').major(process.version)
  if (nodeMajor < 4) throw new Error('pnpm requires at least Node.js v4')
  if (nodeMajor < 6) return 'latest-1'
  if (nodeMajor < 8) return 'latest-2'
  if (nodeMajor < 10) return 'latest-3'
  if (nodeMajor < 12) return 'latest-5'
  return 'latest'
}
