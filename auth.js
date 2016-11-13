const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Promise = require('bluebird')

const config = {
	clientId: '36c469e58856439fbb2e0e7d03a596e3',
	clientSecret: 'f5bc1772c410485280ddb39068b9f717',
	authorizationUrl: 'https://accounts.spotify.com/authorize',
	tokenUrl: 'https://accounts.spotify.com/api/token',
	useBasicAuthorizationHeader: true
}

const options = {
    client_id: '36c469e58856439fbb2e0e7d03a596e3',
    client_secret: 'f5bc1772c410485280ddb39068b9f717',
    scopes: ["user-library-read"] 
}


module.exports.auth = function() {
	let authWindow = new BrowserWindow({ width: 1024, height: 768, show: false, 'node-integration': false });
	let authUrl = 'https://accounts.spotify.com/authorize?'
	authUrl = authUrl + 'response_type=token&redirect_uri=urn:ietf:wg:oauth:2.0:oob&client_id=' + options.client_id + '&scope=' + options.scopes.join('%20');
	authWindow.loadURL(authUrl)
	authWindow.show()
	
	return new Promise((resolve, reject) => {
		
		function handleCallback (url) {
		  var raw_code = /access_token=([^&]*)/.exec(url) || null;
		  var code = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
		  var error = /\?error=(.+)$/.exec(url);

		  if (code || error) {
		    // Close the browser if code found or error
		    authWindow.destroy();
		  }
			
		  if (code) {
				resolve(code)
		  } else if (error) {
		    reject(error)
		  }
		}

		authWindow.webContents.on('will-navigate', function (event, url) {
		  handleCallback(url);
		});

		authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
		  handleCallback(newUrl);
		});

		// Reset the authWindow on close
		authWindow.on('close', function() {
		    authWindow = null;
		}, false);
		
	})
	
	
}