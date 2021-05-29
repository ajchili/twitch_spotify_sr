import express, { Request, Response } from 'express';
import { config } from 'dotenv';

config();

import * as AuthenticationHandler from './handlers/authentication';
import * as SpotifyHandler from './handlers/spotify';

const port = process.env.PORT || 8080;

const app = express();
app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', async (_: Request, res: Response) => {
  res.status(200);
  res.render('index', { credentials: null });
});

app.get('/authorize', AuthenticationHandler.authorizerHandler);
app.get('/callback', AuthenticationHandler.callbackHandler);
app.get('/search', SpotifyHandler.searchHandler);

app.listen(port);
