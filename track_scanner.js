// scan tracks from spotify's server
// and save them to the local db
const { app } = require('electron')
const Promise = require('bluebird')

let spotify = require('./spotify')
const Datastore = require('nedb')
const path = require('path')
console.log(app.getPath('userData'))
const db = new Datastore({ filename: path.join(app.getPath('userData'), 'mytrax.db'), autoload: true })

function saveTrack(track) {
	console.log(`Saving ${track.track.artists[0].name} - ${track.track.name}`)
	return db.insertAsync(track)
}

function clearAllTracks() {
	console.log('clearing all tracks...')
	return db.removeAsync({}, { multi: true }).then((numRemoved) => {
		console.log(`removed ${numRemoved} tracks`)
	})
}

module.exports = {
	scanTracks(accessToken) {
		return clearAllTracks().then(() => {
			spotify = spotify(accessToken)
			return spotify.loadUserTracks().then(tracks => {
				return Promise.map(tracks, saveTrack)
			}).then(() => {
				console.log('done!')
			})
		})
	}
}