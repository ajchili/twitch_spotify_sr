import express, { Request, Response } from 'express';
import { config } from 'dotenv';

config();

import { API as SpotifyAPI } from './lib/spotify';

const port = process.env.PORT || 8080;

const app = express();
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', async (req: Request, res: Response) => {
  res.status(200);
  res.render('index', { credentials: null });
});

app.get('/authorize', (req: Request, res: Response) => {
  const scopes = 'user-modify-playback-state';
  const redirectUri = `http://localhost:${port}/callback`;
  const params = [
    `client_id=${process.env.SPOTIFY_CLIENT_ID}`,
    `redirect_uri=${encodeURIComponent(redirectUri)}`,
    'response_type=code',
    `scope=${encodeURIComponent(scopes)}`,
    'show_dialog=true',
  ];
  const authUri = `https://accounts.spotify.com/authorize?${params.join('&')}`;
  res.redirect(authUri);
});

app.get('/callback', async (req: Request, res: Response) => {
  const code: string = req.query.code as string;
  try {
    const credentials = await SpotifyAPI.getUserCredentials(code);
    res.render('callback', { credentials });
  } catch (err) {
    res.redirect('/');
  }
});

app.get('/refreshToken', async (req: Request, res: Response) => {});

app.get('/search', async (req: Request, res: Response) => {
  if (req.query.query == undefined) {
    res.status(400);
    res.send('No query specified!');
    return;
  }
  try {
    const track = await SpotifyAPI.searchForTrack(req.query.query as string);
    res.json(track);
  } catch (err) {
    console.warn('/search', err);
    if (err === 'No track found!') {
      res.status(404);
      res.send('No track found!');
      return;
    }
    res.status(500);
    res.send('An unexpected error occurred!');
  }
});

app.listen(port);
