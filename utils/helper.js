const fs = require('fs');
const { default: mongoose } = require('mongoose');
const path = require('path');
const sharp = require('sharp');


module.exports = {
    camelize: async (obj) => {
        try {
            const camelcaseKeys = (await import('camelcase-keys')).default;
            return camelcaseKeys(JSON.parse(JSON.stringify(obj)), { deep: true });
        } catch (error) {
            throw error;
        }
    },

    generateAgentId: async () => {
        try {
            const year = 1526;
            const random = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
            const agentId = `MVD${year}${random}`;
            return agentId;
        } catch (error) {
            console.error(error);
            throw new ErrorHandler(SERVER_ERROR, error);
        }
    },

    asyncCall: async (fn, next, ...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            next(error)
        }
    },

    validateEmail: (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailRegex.test(email);
    },

    pushList: (list, item, unique) => {
        /// if item is  list, push it to list other wise return concatenated list
        console.log('pushList', list, item, unique);
        if (Array.isArray(item)) {
            if (unique && list.includes(item)) return list;
            if (unique) return list = [...new Set([...list, ...item])];
            return list = [...list, ...item]
        } else {
            if (unique && list.includes(item)) return list;
            return list = [...list, item];
        }

    },

    // addRemoveInList: (list, item) => {
    //     console.log('addRemoveInList', list, item);
    //     /// check list and items are schema object ids
    //     const isObjectId = item instanceof mongoose.Types.ObjectId || (Array.isArray(item) && item.every(i => i instanceof mongoose.Types.ObjectId));
    //     console.log('isObjectId', isObjectId);
    //     if (Array.isArray(item)) {
    //         if (isObjectId) {
    //             if (list.map(i => i.toString()).includes(item.toString())) return list.filter((i) => i.toString() !== item.toString());
    //             return [...list, ...item.filter((i) => !list.map(i => i.toString()).includes(i.toString()))];
    //         }
    //         if (list.includes(item)) return list.filter((i) => i !== item);
    //         return list = [...list, ...item.filter((i) => !list.includes(i))];
    //     } else {
    //         if (isObjectId) {
    //             if (list.map(i => i.toString()).includes(item.toString())) return list.filter((i) => i.toString() !== item.toString());
    //             return [...list, item];
    //         }
    //         if (list.includes(item)) return list.filter((i) => i !== item);
    //         return list = [...list, item];
    //     }
    // },

    addRemoveInList: (list, item) => {
        console.log('addRemoveInList', list, item);
        const isObjectId = (obj) => obj instanceof mongoose.Types.ObjectId; // Helper function to check if an item is an object ID
        console.log('isObjectId', isObjectId);
        
        if (Array.isArray(item)) {
            if (isObjectId(item[0])) {
                const stringifiedList = list.map(i => i.toString());
                const stringifiedItem = item.map(i => i.toString());
                if (stringifiedList.some(i => stringifiedItem.includes(i))) {
                    return list.filter(i => !stringifiedItem.includes(i.toString()));
                }
                return [...list, ...item.filter(i => !stringifiedList.includes(i.toString()))];
            }
            if (list.includes(item)) return list.filter(i => i !== item);
            return [...list, ...item.filter(i => !list.includes(i))];
        } else {
            if (isObjectId(item)) {
                if (list.map(i => i.toString()).includes(item.toString())) return list.filter(i => i.toString() !== item.toString());
                return [...list, item];
            }
            if (list.includes(item)) return list.filter(i => i !== item);
            return [...list, item];
        }
    },
    /// function to correct urls 
    // 'http://192.168.29.226:3000/public\\images\\profile_pic\\1711170794969.png'
    urlCorrector: (url) => {
        return url.replace(/\\/g, '/');
    },


    resizeAndSaveImage: async (inputFilePath, outputFilePath, renamePath, width, height) => {
        try {
            renamePath = renamePath ?? true;
            width = width ?? 100;
            height = height ?? 100;
            let res = sharp(inputFilePath)
                .resize({
                    width: width,
                    height: height,
                    fit: sharp.fit.inside, // Maintain aspect ratio
                    withoutEnlargement: true // Don't enlarge the image if its dimensions are already less than specified dimensions
                });
            if (res && outputFilePath) {
                if (renamePath) {
                    let sizedName = `${width}x${height}`;
                    let ext = path.extname(outputFilePath);
                    outputFilePath = outputFilePath.replace(ext, `_${sizedName}${ext}`);
                }
                res = await res.toFile(outputFilePath);
            }
            return outputFilePath;
        } catch (error) {
            console.error('Error resizing and saving image:', error);
            throw error;
        }
    }

}