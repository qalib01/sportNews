const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

// const client = new TwitterApi({
//     appKey: process.env.TWITTER_API_APP_KEY,
//     appSecret: process.env.TWITTER_API_APP_SECRET,
//     accessToken: process.env.TWITTER_API_ACCESS_TOKEN,
//     accessSecret: process.env.TWITTER_API_ACCESS_SECRET,
// });

// const roClient = client.readOnly;

// const getFollowers = async (username) => {
//     try {
//         const user = await roClient.v2.userByUsername(username);
//         const userId = user.data.id;

//         let followers = [];
//         let paginationToken = null;

//         do {
//             const response = await roClient.v2.followers(userId, { pagination_token: paginationToken, max_results: 1000 });
//             followers = followers.concat(response.data);
//             paginationToken = response.meta.next_token;
//         } while (paginationToken);

//         followers.forEach(follower => {
//             console.log(follower.username);
//         });

//     } catch (error) {
//         console.error('Error fetching followers:', error);
//     }
// };

// // Replace 'target_username' with the Twitter username whose followers you want to fetch
// getFollowers('target_username');

let getTwitterUserData = async () => {
    const twitterClient = new TwitterApi(process.env.TWITTER_API_BEARER_TOKEN);
    const readOnlyClient = twitterClient.readOnly;
    const user = await readOnlyClient.v2.userByUsername('plhery');
    console.log(user);
}
// getTwitterUserData()



// const { TwitterApi } = require('twitter-api-v2');
// require('dotenv').config();

// const client = new TwitterApi({
//     appKey: process.env.TWITTER_API_APP_KEY,
//     appSecret: process.env.TWITTER_API_APP_SECRET,
//     accessToken: process.env.TWITTER_API_ACCESS_TOKEN,
//     accessSecret: process.env.TWITTER_API_ACCESS_SECRET,
// });

// async function getTwitterFormattedFollowers(username) {
//     try {
//         const user = await client.v2.userByUsername(username, {
//             'user.fields': 'public_metrics'
//         });
//         const followersCount = user.data.public_metrics.followers_count;
//         const formattedFollowersCount = formatNumberWithK(followersCount);
//         console.log(`${username} has ${formattedFollowersCount} followers.`);
//         return formattedFollowersCount;
//     } catch (error) {
//         console.error('Error fetching followers count:', error);
//     }
// }

// // AAAAAAAAAAAAAAAAAAAAAN%2FetwEAAAAAyttnRgXROZSyq3ozJHA1drSGmNQ%3Dzij7mklxLEau4hBZeGPxDHBnBWnHR00n2zXWCUmwMHvl9rBQ1t

// function formatNumberWithK(number) {
//     if (number >= 1000) {
//         return (number / 1000).toFixed(1) + 'K';
//     }
//     return number.toString();
// }

// module.exports = { getTwitterFormattedFollowers };