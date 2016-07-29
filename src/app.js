import {
  app,
  globalShortcut,
  BrowserWindow,
} from 'electron';

let window;

function createWindow() {
  window = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false
  });

  window.loadURL('./index.html');

  window.on('blur', (e) => {
    window.hide();
  });
}

app.dock.hide();

app.on('ready', () => {
  globalShortcut.register('Command+Space', () => {
    if (window.isVisible()) {
      window.hide();
    }  else {
      window.show();
    }
  });

  createWindow();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
