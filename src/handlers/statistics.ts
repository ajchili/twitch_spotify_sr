import { Request, Response } from 'express';
import {
  ChannelActivity,
  ChannelActivityMonitor,
} from '../lib/channelActivity';

export const healthCheck = (_: Request, res: Response) => {
  res.status(200).send();
};

export const updateChannelActivity = (req: Request, res: Response) => {
  const { channel = '', event = '' } = req.body;
  if (!channel || !event) {
    res.status(400).send();
  }
  const channelActivity = {
    event,
    time: new Date(),
  };
  ChannelActivityMonitor.instance.updateChannelActivity(
    channel,
    channelActivity
  );
  res.status(200).send();
};
