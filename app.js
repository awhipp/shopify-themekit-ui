const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

var window = null;

// Wait until the app is ready
app.once('ready', () => {
  window = new BrowserWindow({
    "width": 800,  "height": 700, "show": false, "transparent": true
  });

  // Load a URL in the window to the local index.html path
  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Show window when page is ready
  window.once('ready-to-show', () => { window.show() });
});
