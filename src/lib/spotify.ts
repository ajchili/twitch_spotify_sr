import fetch from 'node-fetch';

export interface Song {
  artist: string;
  id: string;
  name: string;
}

export interface UserCredentials {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface User {
  display_name?: string;
  id?: string;
  images?: { url?: string }[];
}

export class API {
  private static clientId = process.env.SPOTIFY_CLIENT_ID;
  private static clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  private static token = Buffer.from(
    `${API.clientId}:${API.clientSecret}`
  ).toString('base64');
  public static getCredentials = async (): Promise<string> => {
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    const request = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${API.token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    const json = await request.json();
    return json['access_token'];
  };
  public static getUserCredentials = async (
    code: string
  ): Promise<UserCredentials> => {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', process.env.REDIRECT_URI);
    const request = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${API.token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    if (!request.ok) {
      throw new Error('Unable to authenticate!');
    }
    const json = await request.json();
    return json as UserCredentials;
  };
  public static refreshUserCredentials = async (
    refreshToken: string
  ): Promise<UserCredentials> => {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);
    const request = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${API.token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    if (!request.ok) {
      throw new Error('Unable to authenticate!');
    }
    const json = await request.json();
    return json as UserCredentials;
  };
  public static searchForTrack = async (query: string): Promise<Song> => {
    const credentials = await API.getCredentials();
    const q = encodeURI(query);
    const url = `https://api.spotify.com/v1/search?q=${q}&type=track&limit=1`;
    const request = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${credentials}`,
      },
    });
    const json = await request.json();
    if ((json.tracks.items || []).length === 0) {
      throw 'No track found!';
    }
    const song: Song = {
      artist: json.tracks.items[0].artists
        .map((artist: any) => artist.name)
        .join(' '),
      id: json.tracks.items[0].uri,
      name: json.tracks.items[0].name,
    };
    return song;
  };
}
