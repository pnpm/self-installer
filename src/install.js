'use strict'
const path = require('path')
const installTo = require('./installTo')

installTo({
    dest: process.env.PNPM_DEST && path.resolve(process.env.PNPM_DEST),
    binPath: process.env.PNPM_BIN_DEST && path.resolve(process.env.PNPM_BIN_DEST),
    version: process.env.PNPM_VERSION || 'latest',
    registry: process.env.PNPM_REGISTRY || 'https://registry.npmjs.org/',
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
