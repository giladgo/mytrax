const rp = require('request-promise')
const Promise = require('bluebird')

const SPOTIFY_BASE_URI = 'https://api.spotify.com/v1'

// Needed scopes:
// user-library-read

module.exports = function(accessToken) {
	return { 
		spotifyRequest(url) {			
			const options = {
				uri: `${SPOTIFY_BASE_URI}/${url}`,
				headers: {
					'Authorization': 'Bearer ' + accessToken
				},
				json: true
			}
			
			return rp(options).then(response => {
				return response
			})
		},

		loadTracksFeatures(trackIds) {
			return this.spotifyRequest('audio-features/?ids=' + trackIds.join(','))
		},

		userTrackPage(page) {
			return this.spotifyRequest(`me/tracks?offset=${page * 50}&limit=50`)
		},

		loadUserTracks() {
			let page = 0
			let currentPromise = this.userTrackPage(page)
			let items = []
			const self = this // no arrow functions with generators :(
			return Promise.coroutine(function*() {
				while (true) {
					let currentResult = yield self.userTrackPage(page++)
					items = items.concat(currentResult.items)
					if (!currentResult.next) {
						break
					}
				}
			})().then(() => {
				return items
			})
		}
	}

}