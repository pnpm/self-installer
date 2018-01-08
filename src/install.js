'use strict'
const path = require('path')
const installTo = require('./installTo')

const dest = process.env.PNPM_DEST
  ? path.resolve(process.env.PNPM_DEST)
  : path.join(process.execPath, '../../lib/node_modules/pnpm')
const binPath = process.env.PNPM_BIN_DEST
  ? path.resolve(process.env.PNPM_BIN_DEST)
  : path.dirname(process.execPath)

installTo(dest, binPath, process.env.PNPM_VERSION || 'latest')
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
