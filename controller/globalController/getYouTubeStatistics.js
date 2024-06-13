const { google } = require('googleapis');
require("dotenv").config();

const apiKey = process.env.GOOGLE_API_KEY;

const youtube = google.youtube({
    version: 'v3',
    auth: apiKey,
});

async function getYouTubeStatistics(channelId) {
    try {
        const response = await youtube.channels.list({
            part: 'statistics',
            id: channelId,
        });

        const channel = response.data.items[0];
        const subscribersCount = channel.statistics.subscriberCount;
        return subscribersCount;
    } catch (error) {
        console.error('Cannot get YouTube stats:', error);
        throw error;
    }
}

function formatNumberWithK(number) {
    if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'K';
    }
    return number.toString();
}

// let subscribers = await getYouTubeStatistics('UCnpg9_1SoNxQHZiaUgX09FQ');

async function getYouTubeFormattedSubscribers(channelId) {
    const subscribersCount = await getYouTubeStatistics(channelId);
    return formatNumberWithK(subscribersCount);
}

module.exports = { getYouTubeFormattedSubscribers };