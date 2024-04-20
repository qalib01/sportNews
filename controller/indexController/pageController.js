const db = require('../../models/index');
const { sequelize } = require('../../models/index');
const moment = require('moment-timezone');
const { Op } = require('sequelize');
// moment.locale('az');


const getHomePage = async (req, res, next) => {
    // Calculate the date 7 days ago from today
    const sevenDaysAgo = moment().subtract(7, 'days').toDate();
    try {
        let allTags = await db.tags.findAll({
            order: [
                ['createdAt', 'ASC']
            ],
            attributes: ['name', 'key'],
            where: {
                status: true
            }
        });
        let allNews = await db.news.findAll({
            include: [
                {
                    model: sequelize.model('categories'),
                    as: 'category',
                    where: {
                        status: true
                    },
                    attributes: ['name', 'key', 'description'],
                },
                {
                    model: sequelize.model('news_tags'),
                    as: 'news_tags',
                    include: [
                        {
                            model: sequelize.model('tags'),
                            as: 'tag',
                            attributes: ['name', 'key', 'description'],
                        },
                    ],
                },
                {
                    model: sequelize.model('news_views'),
                    as: 'news_view',
                    attributes: ['viewsCounts']
                },
            ],
            where: {
                status: true,
                sharedAt: {
                    [Op.lt]: moment().tz('Asia/Baku'),
                },
            },
            order: [
                ['createdAt', 'DESC']
            ],
            attributes: ['title', 'key', 'img', 'createdAt', 'isHeadNews'],
        });

        let headNews = allNews.filter(news => news.isHeadNews === true).slice(0,5);

        // Filter trending news within the last 7 days based on views
        const trendNews = allNews.filter(news => {
            let totalViews = 0;
            if (news.news_view) {
                totalViews = news.news_view.viewsCounts;
            }
            return totalViews > 0 && moment(news.createdAt).isAfter(sevenDaysAgo);
        }).sort((a, b) => {
            let viewsA = 0;
            let viewsB = 0;
            if (a.news_view) {
                viewsA = a.news_view.viewsCounts;
            }
            if (b.news_view) {
                viewsB = b.news_view.viewsCounts;
            }
            return viewsB - viewsA;
        }).slice(0, 6);


        // Check if newsWithTagCounts is undefined or empty
        if (!allNews || allNews.length === 0) {
            res.json([]); // Return an empty array if no news articles are found
            return;
        }

        // Count the number of news articles per category
        const categoryCounts = {};
        allNews.forEach(news => {
            const categoryName = news.category ? news.category.name : null;
            const categoryKey = news.category ? news.category.key : null;
            if (categoryName) {
                if (!categoryCounts[categoryName]) {
                    categoryCounts[categoryName] = { count: 1, categoryKey };
                } else {
                    categoryCounts[categoryName].count++;
                }
            }
        });

        // Sort the categories by the number of news articles in descending order
        const sortedCategories = Object.entries(categoryCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3); // Select only the top 3 categories

        // Process the data to calculate total count of tags per category
        const categoryArray = sortedCategories.map(([categoryName]) => {
            const categoryNews = allNews.filter(news => news.category && news.category.name === categoryName);
            const categoryTags = {};
        
            categoryNews.forEach(news => {
                news.news_tags.forEach(news_tag => {
                    const tagName = news_tag.tag ? news_tag.tag.name : null;
                    const tagKey = news_tag.tag ? news_tag.tag.key : null;
                    // console.log(tagName);
                    // console.log(categoryTags);
                    if (tagName) {
                        if (!categoryTags[tagName]) {
                            categoryTags[tagName] = { count: 0, key: tagKey, news: [] }; // Initialize count, key, and news array
                        }
                        if (categoryTags[tagName].count < 6) { // Limit to 6 news articles per tag
                            categoryTags[tagName].count++; // Increment count
                            categoryTags[tagName].news.push(news); // Add news article to the tag's news array
                        }
                    }
                });
            });
            
        
            const tags = Object.entries(categoryTags)
                .sort((a, b) => b[1].count - a[1].count) // Sort by count values in descending order
                .slice(0, 3) // Limit to 3 tags per category
                .map(([tagName, { count, key, news }]) => ({ name: tagName, count, key, news })); // Include name, count, key, and news array for each tag
                
            const [, { categoryKey }] = sortedCategories.find(([name]) => name === categoryName);
        
            return {
                name: categoryName,
                key: categoryKey,
                tags: tags.map(tag => ({
                    ...tag,
                    news: tag.news.map(news => ({
                        // id: news.id,
                        title: news.title,
                        key: news.key,
                        img: news.img,
                        // content: news.content,
                        // tags: news.news_tags.map(news_tag => ({
                        //     name: news_tag.tag.name,
                        //     key: news_tag.tag.key
                        // })),
                        createdAt: news.createdAt
                    }))
                }))
            };
        });
        

        const youTubeVideoLink = await db.platform_medias.findOne({
            where: {
                status: true,
            },
            include: [
                {
                    model: sequelize.model('social_medias'),
                    as: 'social_media',
                    where: {
                        type: 'media_stream',
                    }
                }
            ]
        })

        res.render('index', {
            title: 'Ana səhifə',
            name: 'Ana səhifə',
            key: 'home',
            allTags,
            trendNews,
            allNews,
            headNews,
            categoryArray,
            youTubeVideoLink,
        });
    } catch (error) {
        console.error('Error in fetching homepage data:', error);
        next(error);
    }
}

const getAboutPage = async (req, res, next) => {
    res.render('about', {
        title: 'Haqqımızda',
        name: 'Haqqımızda',
        key: 'about',
    });
}

const getLoginPage = async (req, res, next) => {
    res.render('login', {
        title: 'Giriş',
        name: 'Giriş',
        key: 'login',
    });
}

module.exports = { getHomePage, getAboutPage, getLoginPage }