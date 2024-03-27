const { initializeApp, cert } = require('firebase-admin/app');
const firestore = require('firebase-admin/firestore');
const mes = require('firebase-admin/messaging');
const remote = require('firebase-admin/remote-config');


const serviceAccount = require('../letusmeet-702a5-firebase-adminsdk-sal9x-6734453872.json');

initializeApp({
    credential: cert(serviceAccount)
});
const fb = firestore.getFirestore();
const messaging = mes.getMessaging();
const remoteConfig = remote.getRemoteConfig();



console.log('🔥 Firebase Connected!');

module.exports = { fb, messaging, remoteConfig };