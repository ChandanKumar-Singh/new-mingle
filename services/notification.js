const { messaging } = require("../config/fb");

const notificationTopics = {
    NEW_USER: 'newuser',
    FIRST_PROFILE: 'firstprofile',
    NEW_FEED: 'newfeed',
    NEW_COMMENT: 'newcomment',
    NEW_LIKE: 'newlike',
    NEW_FOLLOWER: 'newfollower',
    NEW_MESSAGE: 'newmessage',
    NEW_STORY: 'newstory',
    NEW_SOUND: 'newsound',



    TEST_USER: 'testuser'
}

const userFollowersTopic = (userId) => `user_${userId}_followers`;
const userMessagesTopic = (userId) => `user_${userId}_messages`;

const getTitle = (type, name) => {
    switch (type) {
        case notificationTopics.NEW_USER:
            return `${name} joined the app`;
        case notificationTopics.NEW_FEED:
            return `${name} added a new feed`;
        case notificationTopics.NEW_COMMENT:
            return `${name} commented on your feed`;
        case notificationTopics.NEW_LIKE:
            return `${name} liked your feed`;
        case notificationTopics.NEW_FOLLOWER:
            return `${name} started following you`;
        case notificationTopics.NEW_MESSAGE:
            return `${name} sent you a message`;
        case notificationTopics.NEW_STORY:
            return `${name} added a new story`;
        case notificationTopics.NEW_SOUND:
            return `${name} added a new sound`;
        default:
            return 'New Notification';
    }
}

const getBody = (type, name) => {
    switch (type) {
        case notificationTopics.NEW_USER:
            return `Welcome him to our community! 😉`;
        case notificationTopics.NEW_FEED:
            return `${name} added a new feed`;
        case notificationTopics.NEW_COMMENT:
            return `${name} commented on your feed`;
        case notificationTopics.NEW_LIKE:
            return `${name} liked your feed`;
        case notificationTopics.NEW_FOLLOWER:
            return `${name} started following you`;
        case notificationTopics.NEW_MESSAGE:
            return `${name} sent you a message`;
        case notificationTopics.NEW_STORY:
            return `${name} added a new story`;
        case notificationTopics.NEW_SOUND:
            return `${name} added a new sound`;
        default:
            return 'New Notification';
    }
}






const subscribeToTopic = async (topic, token) => {
    messaging.subscribeToTopic(token, topic).then((response) => {
        console.log('Successfully subscribed to topic:', response);
        return response;
    }
    ).catch((error) => {
        console.log('Error subscribing to topic:', error);
    });
}

const unsubscribeFromTopic = async (token, topic) => {
    try {
        await messaging.unsubscribeFromTopic(token, topic);
        console.log(`Unsubscribed from ${topic} topic`);
    } catch (error) {
        console.log(`Error unsubscribing from ${topic} topic: ${error}`);
    }
}

const sendNotification = async (to, title, body, data) => {
    try {
        const tokens = Array.isArray(to) ? to : [to];
        const message = {
            tokens,
            notification: {
                title,
                body
            },
            data
        };
        const response = await messaging.sendEachForMulticast(message);
        console.log('Successfully sent message:', response);
    } catch (error) {
        console.log('Error sending message:', error);
    }
}

const sendNotificationToTopic = async (topic, title, body, data) => {
    try {
        const message = {
            topic,
            notification: {
                title,
                body
            },
            data
        };
        const response = await messaging.send(message);
        console.log('Successfully sent message:', response);
    } catch (error) {
        console.log('Error sending message:', error);
    }
}

module.exports = {
    subscribeToTopic,
    unsubscribeFromTopic,
    sendNotification,
    sendNotificationToTopic,
    notificationTopics,
    userFollowersTopic,
    userMessagesTopic,
    getTitle,
    getBody

}
