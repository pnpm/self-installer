'use strict'
const spawnSync = require('child_process').spawnSync
const path = require('path')
const fs = require('fs')
const got = require('got')
const unpackStream = require('unpack-stream')
const getNpmTarballUrl = require('get-npm-tarball-url').default
const cmdShim = require('cmd-shim')
const createResolver = require('@pnpm/npm-resolver').default
const tempy = require('tempy')
const semver = require('semver')
const which = require('which')

module.exports = installTo

function installTo (opts) {
  opts = opts || {}
  let execPath
  if (!opts.dest || !opts.binPath) {
    execPath = which.sync(process.argv[0])
  }
  const dest = opts.dest || path.join(execPath, '../../lib/node_modules/pnpm')
  const binPath = opts.binPath || path.dirname(execPath)
  const registry = opts.registry
  const version = opts.version

  const pnpmBin = path.join(dest, 'lib/bin/pnpm.js')
  const pnpxBin = path.join(dest, 'lib/bin/pnpx.js')

  const resolvePackage = createResolver({
    registry,
    rawNpmConfig: { registry },
    metaCache: new Map(),
    dryRun: true, // nothing will be written to the store
    store: tempy.directory(), // a silly hack because store is required
  })
  return resolvePackage({alias: 'pnpm', pref: version}, {registry})
    .then(res => {
      if (semver.gte(res.package.version, '1.33.0')) {
        return downloadTarball(res.resolution.tarball, res.package.version)
      }
      return resolvePackage({alias: '@pnpm/bundled', pref: res.package.version}, {registry})
        .then(bundledRes => downloadTarball(bundledRes.resolution.tarball, bundledRes.package.version))
        .catch(err => downloadTarball(res.resolution.tarball, res.package.version))
    })

  function downloadTarball (tarball, version) {
    console.log(`Downloading ${tarball}`)
    const stream = got.stream(tarball)
    return unpackStream.remote(stream, dest)
      .then(index => {
        return new Promise((resolve, reject) => {
          cmdShim(pnpmBin, path.join(binPath, 'pnpm'), (err) => {
            if (err) {
              reject(err)
              return
            }
            cmdShim(pnpxBin, path.join(binPath, 'pnpx'), (err) => {
              if (err) {
                reject(err)
                return
              }
              if (semver.lt(version, '1.33.0')) {
                const npmBin = path.join(dest, 'node_modules', 'not-bundled-npm', 'bin', 'npm-cli')
                spawnSync('node', [npmBin, 'rebuild', 'drivelist'], {cwd: dest, stdio: 'inherit'})
              }
              resolve()
            })
          })
        })
      })
  }
}
