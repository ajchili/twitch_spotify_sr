class StatisticsManager {
  async updateServerStatistics(event) {
    const body = {
      channel: window.localStorage.getItem('botChannelName'),
      event,
    };
    console.log(body);
    await fetch('/channels/active', {
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  }
}
