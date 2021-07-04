import { Request, Response } from 'express';
import { API as SpotifyAPI } from '../lib/spotify';

export const authorizerHandler = (req: Request, res: Response) => {
  const showDialog = req.query.show_dialog === 'false' ? 'false' : 'true';
  const scopes = 'user-read-playback-state user-modify-playback-state';
  const params = [
    `client_id=${process.env.SPOTIFY_CLIENT_ID}`,
    `redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}`,
    'response_type=code',
    `scope=${encodeURIComponent(scopes)}`,
    `show_dialog=${showDialog}`,
  ];
  const authUri = `https://accounts.spotify.com/authorize?${params.join('&')}`;
  res.redirect(authUri);
};

export const callbackHandler = async (req: Request, res: Response) => {
  const code: string = req.query.code as string;
  try {
    const credentials = await SpotifyAPI.getUserCredentials(code);
    res.render('callback', { credentials });
  } catch (err) {
    console.warn('/callback', err);
    res.redirect('/');
  }
};
