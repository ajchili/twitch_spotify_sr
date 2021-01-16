class Bot {
  command = 'ssr';
  channel = window.localStorage.getItem('botChannelName') || '';
  name = window.localStorage.getItem('botName') || '';
  OAuthPassword = window.localStorage.getItem('botOAuthPassword') || '';
  client = null;
  spotify;
  constructor() {
    window.addEventListener('beforeunload', () => {
      this.disconnectFromTwitch();
    });
  }
  async _makeRequest(channel, sender, query) {
    try {
      const request = await fetch(`/search?query=${query}`);
      if (request.status === 404) {
        this.client.say(
          channel,
          `@${sender} "${query}" was not found on Spotify!`
        );
        return;
      }
      const song = await request.json();
      const addRequest = await this.spotify.addSongToQueue(song.id);
      if (addRequest.status === 403) {
        this.client.say(
          channel,
          `Unable to add @${sender}'s song to the queue, please double check that Spotify is open and playing!`
        );
        return;
      }
      this.client.say(
        channel,
        `@${sender} "${song.artist} - ${song.name}" was added to the queue.`
      );
    } catch (err) {
      this.client.say(
        channel,
        `An unexpected error occurred when trying to add @${sender}'s song to the queue!`
      );
    }
  }
  _sayMessageUsage(channel, sender) {
    this.client.say(
      channel,
      `@${sender} Usage: !ssr band - song`
    );
  }
  _setupMessageHandler() {
    this.client.on('message', (channel, tags, message, self) => {
      const sender = tags['display-name'];
      const trimmedMessage = message.trim();
      const query = trimmedMessage.substr(5);
      if (trimmedMessage.startsWith(`!${this.command}`)) {
        if (query.length > 0) {
          this._makeRequest(channel, sender, query);
        } else {
          this._sayMessageUsage(channel, sender);
        }
      }
    });
  }
  connectToSpotify(token, refreshToken) {
    this.spotify = new Spotify(token, refreshToken);
  }
  connectToTwitch() {
    if (
      this.channel.length === 0 ||
      this.name.length === 0 ||
      this.OAuthPassword.length === 0
    ) {
      console.warn('Connection failed! Missing bot credentials!');
      return;
    } else if (this.client !== null) {
      console.warn('Connection failed! A client already exists!');
      return;
    }

    this.client = new tmi.Client({
      options: { debug: true },
      connection: {
        secure: true,
        reconnect: true,
      },
      identity: {
        username: this.name,
        password: this.OAuthPassword,
      },
      channels: [this.channel],
    });

    this.client.connect();

    this._setupMessageHandler();

    document.querySelector('span#status').classList = 'badge bg-success';
    document.querySelector('span#status').textContent = 'Connected';
  }
  disconnectFromTwitch() {
    if (this.client === null) {
      return;
    }

    document.querySelector('span#status').classList = 'badge bg-danger';
    document.querySelector('span#status').textContent = 'Disconnected';

    this.client.disconnect();
    this.client = null;
  }
}
