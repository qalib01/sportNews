const { google } = require('googleapis');
const { errorMessages } = require('../../statusMessages/errorMessages');
const apiKey = 'AIzaSyCdNhvQXstVUgKMji-ZQ1llQj5FCScPYps';

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

async function main() {
    try {
      const channelId = 'UCnpg9_1SoNxQHZiaUgX09FQ'; // Replace with your channel ID
        let subscribers = await getYouTubeStatistics(channelId);
        subscribers = formatNumberWithK(subscribers);
        console.log(`Channel has ${subscribers} subscribers.`);
    } catch (error) {
        console.error('Error:', error);
    }
}
main()

// const youTubeSubscribers = formatYoutubeSubscribers(subscribers);
// console.log(youTubeSubscribers);

// module.exports = youTubeSubscribers;