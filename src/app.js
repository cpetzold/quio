import 'babel-polyfill'
import { app, screen, globalShortcut, BrowserWindow } from 'electron'

import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer'

const DEV = true
let window

function createWindow () {
  const {width: sw, height: sh} = screen.getPrimaryDisplay().workAreaSize

  const width = 600
  const height = 64

  window = new BrowserWindow({
    width,
    height,
    x: Math.round((sw / 2) - (width / 2)),
    y: Math.round(sh / 4),
    show: true,
    movable: false,
    center: false,
    frame: false,
    resizable: false,
    minimizable: false,
    maximizable: false,
    backgroundColor: '#fafafa'
  })

  window.on('blur', (e) => {
    window.hide()
  })

  window.loadURL(`file://${__dirname}/index.html`)

  if (DEV) {
    window.openDevTools()
    installExtension(REACT_DEVELOPER_TOOLS)
    installExtension(REDUX_DEVTOOLS)
  }
}

app.dock.hide()

app.on('ready', () => {
  globalShortcut.register('Command+Space', () => {
    if (window.isVisible()) {
      window.hide()
    }  else {
      window.show()
    }
  })

  createWindow()
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
