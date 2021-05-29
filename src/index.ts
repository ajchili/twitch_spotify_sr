import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import { config } from 'dotenv';

config();

import * as AuthenticationHandler from './handlers/authentication';
import * as SpotifyHandler from './handlers/spotify';
import * as StatisticsHandler from './handlers/statistics';
import { ChannelActivityMonitor } from './lib/channelActivity';

const port = process.env.PORT || 8080;

const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', async (_: Request, res: Response) => {
  res.status(200);
  res.render('index', { credentials: null });
});

app.get('/channels/active', (_: Request, res: Response) => {
  res.status(200);
  res.render('activeChannels', {
    channels: ChannelActivityMonitor.instance.activeChannels,
  });
});

app.get('/authorize', AuthenticationHandler.authorizerHandler);
app.get('/callback', AuthenticationHandler.callbackHandler);
app.get('/search', SpotifyHandler.searchHandler);
app.get('/health', StatisticsHandler.healthCheck);
app.post('/channels/active', StatisticsHandler.updateChannelActivity);

app.listen(port);
