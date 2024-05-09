const db = require("../../models/index");
const { sequelize } = require("../../models/index");

const HomePage = async (req, res, next) => {
    const apiKey = "Bearer diOBjI6lkCjBuZ9Kb0tE24HdZ_1MBa9l7mKUeU57";
    const email = "sportsporter555@gmail.com";
    let analytics;

    const graphqlQuery = `
        query {
            viewer {
                zones(filter: { zoneTag: "908bc97b28168b52fed201cab792c3e0" }) {
                    httpRequests1dGroups(limit: 10, orderBy: [date_DESC], filter: { date_geq: "2024-05-01" }) {
                        dimensions {
                            date
                        }
                        sum {
                            requests,
                        }
                        uniq {
                            uniques,
                        }
                    }
                }
            }
        }
    `;

    const endpoint = "https://api.cloudflare.com/client/v4/graphql";

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Auth-Email": email,
                "Authorization": apiKey,
            },
            body: JSON.stringify({ query: graphqlQuery }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        analytics = responseData.data.viewer.zones[0].httpRequests1dGroups;
    } catch (error) {
        res.status(500).json( errorMessages.UNEXPECTED_ERROR );
        next();
    }

    res.render("admin/dashboard", {
        title: "Admin Dashboard",
        key: "home",
        analytics,
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

// curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \ -H "Authorization: Bearer diOBjI6lkCjBuZ9Kb0tE24HdZ_1MBa9l7mKUeU57" \ -H "Content-Type:application/json"
// {"result":{"id":"c72fb7347b92eb8e0ee7a32d0fc30d1d","status":"active"},"success":true,"errors":[],"messages":[{"code":10000,"message":"This API Token is valid and active","type":null}]}curl: (3) URL rejected: Bad hostname
// curl: (3) URL rejected: Bad hostname
