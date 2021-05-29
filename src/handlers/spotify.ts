import { Request, Response } from 'express';
import { API as SpotifyAPI } from '../lib/spotify';

export const searchHandler = async (req: Request, res: Response) => {
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
};
