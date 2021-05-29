export interface ChannelActivity {
  event: string;
  time: Date;
}

export class ChannelActivityMonitor {
  private static INSTANCE: ChannelActivityMonitor =
    new ChannelActivityMonitor();
  private _activeChannels: Map<string, ChannelActivity> = new Map<
    string,
    ChannelActivity
  >();
  private constructor() {}
  static get instance(): ChannelActivityMonitor {
    return ChannelActivityMonitor.INSTANCE;
  }
  get activeChannels(): String[] {
    const activeChannels: string[] = [];
    this._activeChannels.forEach((value: ChannelActivity, key: string) => {
      if (value.time.getTime() >= new Date().getTime() - 5 * 60 * 1000) {
        activeChannels.push(key);
      }
    });
    return activeChannels;
  }
  public updateChannelActivity(
    channelName: string,
    activity: ChannelActivity
  ): void {
    this._activeChannels.set(channelName, activity);
  }
}
