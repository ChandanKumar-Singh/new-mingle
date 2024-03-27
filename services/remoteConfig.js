
const { remoteConfig } = require('../config/fb');
const fs = require('fs');

const getTemplate = async () => {
    remoteConfig.getTemplate()
        .then(function (template) {
            console.log('ETag from server: ' + template.etag);
            var templateStr = JSON.stringify(template);
            fs.writeFileSync('config.json', templateStr);
        })
        .catch(function (err) {
            console.error('Unable to get template');
            console.error(err);
        });
}


const updateRemoteConfig = async (key, value) => {
    try {
        const data = await remoteConfig.publishTemplate(
            remoteConfig.createTemplateFromJSON({ [key]: value })
        );
        console.log('Published template', data);
        return data;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getTemplate,
    updateRemoteConfig
}

