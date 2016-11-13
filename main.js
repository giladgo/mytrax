const { app } = require('electron')

const Datastore = require('nedb')
const Promise = require('bluebird')
Promise.promisifyAll(Datastore.prototype)

const trackScanner = require('./track_scanner')

// Module to control application life.
const auth = require('./auth')
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  auth.auth().then((accessToken) => {
		console.log('Got access token', accessToken)
    return trackScanner.scanTracks(accessToken)
  }).catch(console.error)
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})