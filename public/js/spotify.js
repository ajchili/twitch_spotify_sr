class Spotify {
  token;
  refreshToken;
  _refreshInterval;
  constructor(token, refreshToken, expiresIn = 3600) {
    this.token = token;
    this.refreshToken = refreshToken;
    const refreshIn = expiresIn * 1000 * 0.9;
    this._refreshInterval = setInterval(this.refreshCredentials, refreshIn);
  }
  async addSongToQueue(uri) {
    return fetch(
      `https://api.spotify.com/v1/me/player/queue?uri=${uri}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
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
    const request = await fetch(`/refreshToken?token=${this.refreshToken}`);
    const json = await request.json();
    this.token = json.access_token;
    this.refreshToken = json.refresh_token;
  }
}
