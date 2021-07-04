class Spotify {
  token;
  refreshToken;
  _refreshInterval;
  constructor(token, refreshToken, expiresIn = 3600) {
    this.token = token;
    this.refreshToken = refreshToken;
    const refreshIn = expiresIn * 1000 * 0.9;
    console.log(refreshIn);
    this._refreshInterval = setInterval(this.refreshCredentials, refreshIn);
  }
  async addSongToQueue(uri) {
    return fetch(`https://api.spotify.com/v1/me/player/queue?uri=${uri}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }
  async getCurrentSong() {
    const request = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    switch (request.status) {
      case 200:
        const json = await request.json();
        const name = json['item']['name'];
        const artist = json['item']['artists'][0]['name'];
        const spotifyURL = json['item']['external_urls']['spotify'];
        return `${name} by ${artist}. You can listen to it at ${spotifyURL}`;
      case 204:
        return 'No song is being played in Spotify.';
      default:
        console.warn(response);
        return 'Unable to get currently playing song in Spotify';
    }
  }
  async getMe() {
    const request = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return await request.json();
  }
  async refreshCredentials() {
    window.location = '/authorize?show_dialog=false'
    return;
    // TODO: Fix this
    console.log('refreshing');
    const request = await fetch(
      `/refreshToken?refresh_token=${this.refreshToken}`
    );
    const json = await request.json();
    this.token = json.access_token;
    this.refreshToken = json.refresh_token;
  }
}
