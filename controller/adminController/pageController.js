const db = require("../../models/index");
const { sequelize } = require("../../models/index");
// const { getTwitterFormattedFollowers } = require("../globalController/getTwitterStatistics");
const { getYouTubeFormattedSubscribers } = require("../globalController/getYouTubeStatistics");
const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();
const axios = require('axios');


const HomePage = async (req, res, next) => {
  let youTubeSubscribers = await getYouTubeFormattedSubscribers(process.env.YOUTUBE_CHANNEL_ID);
  // let twitterFollowers = await getTwitterFormattedFollowers('@Galib22703428');
  // console.log(twitterFollowers);

//   const client = new TwitterApi({
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


  // Replace these values with your own
  const accessToken = process.env.FACEBOOK_CLIENT_TOKEN;
  const groupId = process.env.FACEBOOK_GROUP_ID;

  const getGroupMembers = async (groupId, accessToken) => {
    try {
      const url = `https://graph.facebook.com/v19.0/${groupId}/members?access_token=${accessToken}`;

      let members = [];
      let response = await axios.get(url);
      console.log('response', response);

      while (response.data && response.data.data) {
        members = members.concat(response.data.data);

        if (response.data.paging && response.data.paging.next) {
            response = await axios.get(response.data.paging.next);
        } else {
            break;
        }
      }

      return members;
    } catch (error) {
        console.error('Error fetching group members:', error.response.data);
    }
  };

  (async () => {
      const members = await getGroupMembers(groupId, accessToken);
      console.log(members);
      members.forEach(member => {
          console.log(`Name: ${member.name}, ID: ${member.id}`);
      });
  })();


  
  let socialMediaStatistics = {youTubeSubscribers};


  res.render("admin/dashboard", {
    title: "Admin Dashboard",
    key: "home",
    socialMediaStatistics,
  });
};

const usersPage = async (req, res, next) => {
  let users = await db.users.findAll({
    order: [["createdAt", "ASC"]],
  });
  res.render("admin/users/users", {
    title: "İstifadəçilər",
    key: "users",
    users,
  });
};

const newsPage = async (req, res, next) => {
  let tags = await db.tags.findAll({
    where: {
      status: true,
    },
    order: [["createdAt", "ASC"]],
  });
  let categories = await db.categories.findAll({
    where: {
      status: true,
    },
    order: [["createdAt", "ASC"]],
  });
  res.render("admin/news/news", {
    title: "Xəbərlər",
    key: "news",
    tags,
    categories,
  });
};

const tagsPage = async (req, res, next) => {
  let tags = await db.tags.findAll({
    order: [["createdAt", "ASC"]],
  });
  res.render("admin/news/tags", {
    title: "Taglar",
    key: "tags",
    tags,
  });
};

const categoriesPage = async (req, res, next) => {
  let categories = await db.categories.findAll({
    order: [["createdAt", "ASC"]],
  });
  res.render("admin/news/categories", {
    title: "Kateqoriyalar",
    key: "categories",
    categories,
  });
};

const subCategoriesPage = async (req, res, next) => {
  let subCategories = await db.sub_categories.findAll({
    include: [
      {
        model: sequelize.model("categories"),
        as: "category",
      },
    ],
    order: [["createdAt", "ASC"]],
  });

  let categories = await db.categories.findAll();
  res.render("admin/news/sub_categories", {
    title: "Alt Kateqoriayalar",
    key: "subCategories",
    subCategories,
    categories,
  });
};

const socialMediasPage = async (req, res, next) => {
  let socialMedias = await db.social_medias.findAll();
  let platformMedias = await db.platform_medias.findAll({
    include: [
      {
        model: sequelize.model("social_medias"),
        as: "social_media",
      },
    ],
  });
  res.render("admin/items/social_medias", {
    title: "Sosial medialar",
    key: "socialMedias",
    socialMedias,
    platformMedias,
  });
};

module.exports = {
  HomePage,
  usersPage,
  newsPage,
  tagsPage,
  categoriesPage,
  subCategoriesPage,
  socialMediasPage,
};