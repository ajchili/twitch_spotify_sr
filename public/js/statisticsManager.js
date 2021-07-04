class StatisticsManager {
  async updateServerStatistics(event) {
    const body = {
      channel: window.localStorage.getItem('botChannelName'),
      event,
    };
    await fetch('/channels/active', {
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  }
}
