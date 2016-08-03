import { app } from 'electron'
import mkdirp from 'mkdirp'
import path from 'path'
import async from 'async'
import child_process from 'child_process'
import { promisify, promisifyAll } from 'bluebird'
import plist from 'simple-plist'

import { memoizeAsync } from './utils'

promisifyAll(child_process, {multiArgs: true})
promisifyAll(plist)
const mkdirpAsync = promisify(mkdirp)

const USER_DATA_PATH = app.getPath('userData')

async function icnsToPng ({ icnsPath, outputPath, size = 512, depth = 32 }) {
  await mkdirpAsync(outputPath)
  let res = await child_process.execAsync(`icns2png -x -s ${size}x${size} -o "${outputPath}" "${icnsPath}"`)

  let {name} = path.parse(icnsPath)
  return path.join(outputPath, `${name}_${size}x${size}x${depth}.png`)
}

async function getApplicationInfo (appPath) {
  let plistPath = path.join(appPath, 'Contents/Info.plist')
  let {CFBundleName, CFBundleIconFile} = await plist.readFileAsync(plistPath)
  let name = CFBundleName || path.parse(appPath).name

  let iconPng = null

  if (CFBundleIconFile) {
    let icnsFilename = path.extname(CFBundleIconFile) === '.icns' ? CFBundleIconFile : `${CFBundleIconFile}.icns`
    let icnsPath = path.join(appPath, 'Contents/Resources', icnsFilename)

    iconPng = await icnsToPng({
      icnsPath,
      outputPath: path.join(USER_DATA_PATH, 'icons', name)
    })
  }

  return {
    name,
    iconPng,
    path: appPath
  }
}

const getApplicationInfoMemoized = memoizeAsync(getApplicationInfo)

export async function getApplications (applicationsPath = '/Applications') {
  let [stdout] = await child_process.execAsync(`find ${applicationsPath} -maxdepth 2 -name "*.app"`)
  let appDirs = stdout.split('\n').filter(s => s)
  return Promise.all(appDirs.map(getApplicationInfoMemoized))
}
