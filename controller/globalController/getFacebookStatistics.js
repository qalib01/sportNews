const axios = require('axios');
require('dotenv').config();

// Replace these values with your own
const accessToken = process.env.FACEBOOK_CLIENT_TOKEN;
const groupId = process.env.FACEBOOK_GROUP_ID;

const getGroupMembers = async (groupId, accessToken) => {
    try {
        const url = `https://graph.facebook.com/v19.0/${groupId}/members?access_token=${accessToken}`;

        let members = [];
        let response = await axios.get(url);

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
    members.forEach(member => {
        console.log(`Name: ${member.name}, ID: ${member.id}`);
    });
})();
