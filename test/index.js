'use strict'
const test = require('tape')
const tempy = require('tempy')
const fs = require('fs')
const path = require('path')
const isExecutable = require('isexe')
const isWindows = require('is-windows')()
const execa = require('execa')

const exeExtension = isWindows ? '.cmd' : ''
const installScript = require.resolve('@pnpm/self-installer')

test('installation to custom destination', t => {
  const dest = tempy.directory()
  const binPath = path.join(dest, 'bin')
  fs.mkdirSync(binPath)
  const env = {
    PNPM_DEST: dest,
    PNPM_BIN_DEST: binPath,
  }
  execa('node', [installScript], {env, stdout: 'inherit'})
    .then(() => {
      t.ok(isExecutable.sync(path.join(binPath, `pnpm${exeExtension}`)), 'pnpm is executable')
      t.ok(isExecutable.sync(path.join(binPath, `pnpx${exeExtension}`)), 'pnpx is executable')
      t.end()
    })
    .catch(t.end)
})

test('installation to custom destination of a specific version', t => {
  const dest = tempy.directory()
  const binPath = path.join(dest, 'bin')
  fs.mkdirSync(binPath)
  const env = {
    PNPM_DEST: dest,
    PNPM_BIN_DEST: binPath,
    PNPM_VERSION: '1.24.0',
  }
  execa('node', [installScript], {env, stdout: 'inherit'})
    .then(() => {
      t.ok(isExecutable.sync(path.join(binPath, `pnpm${exeExtension}`)), 'pnpm is executable')
      t.ok(isExecutable.sync(path.join(binPath, `pnpx${exeExtension}`)), 'pnpx is executable')
      t.equal(require(path.join(dest, 'package.json')).version, '1.24.0', 'correct version of pnpm installed')
      t.end()
    })
    .catch(t.end)
})
