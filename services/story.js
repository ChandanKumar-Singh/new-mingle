const { ErrorHandler } = require("../helper");
const { Story } = require("../models");
const { addRemoveInList } = require("../utils/helper");

const addStory = async (req, res) => {
    console.log('addStory', req.body);
    const { story, postType, duration, bgColor, caption, thumbnail } = req.body;
    let media = req.media;
    let _story = new Story({
        postType,
        url: story ?? media,
        userId: req.user.id,
        duration,
        bgColor,
        caption,
        thumbnail
    });
    
    _story = (await _story.save()).populate('userId', 'fullname profilePicture smallProfilePicture email ');
    return _story;
};

const getFilterdStories = async (userId, query, iQuery) => {
    let total = await Story.countDocuments(iQuery);
    // let stories = await Story.find(iQuery).populate('userId', 'fullname profilePicture smallProfilePicture email ').skip(query.skip).limit(query.limit).sort(query.sort);
    let stories = await Story.aggregate([
        {
            $match: iQuery
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            profilePicture: 1,
                            smallProfilePicture: 1,
                            email: 1

                        }
                    }
                ]

            },
        },
        {
            $unwind: "$user"
        },
        {
            $addFields: {
                isLiked: { $in: [userId, "$likes"] },
                isSeen: { $in: [userId, "$seenBy"] },

            },
        },
        {
            $graphLookup: {
                from: "users",
                startWith: "$seenBy",
                connectFromField: "seenBy",
                connectToField: "_id",
                as: "seenBy",

            }
        },
        {
            $group: {
                _id: "$userId",
                fullname: { $first: "$user.fullName" },
                profilePicture: { $first: "$user.profilePicture" },
                smallProfilePicture: { $first: "$user.smallProfilePicture" },
                email: { $first: "$user.email" },
                stories: { $push: "$$ROOT" }
            }
        },
        {
            $addFields: {
                stories: {
                    $map: {
                        input: "$stories",
                        as: "story",
                        in: {
                            $mergeObjects: [
                                "$$story",
                                { createdAt: { $toDate: "$$story.createdAt" } }
                            ]
                        },
                    }
                }
                ,
            }
        },
        {
            $skip: query.skip
        },
        {
            $limit: query.limit
        },
        {
            $sort: { "_id": 1, "stories.createdAt": 1, "user.createAt": -1 }
        },
        // {
        //     $sort: query.sort
        // }
    ]);
    // stories = stories.map(story => {
    //     let seenList = story.seenBy.map(seen => seen._id.toString());
    //     let likeList = story.likes.map(like => like._id.toString());
    //     story.isSeen = seenList.includes(userId.toString());
    //     story.isLiked = likeList.includes(userId.toString());
    //     return story;
    // });
    return {
        total,
        stories
    };
}

const likeStory = async (userId, storyId) => {
    let story = await Story.findById(storyId).populate('userId', 'fullname profilePicture smallProfilePicture email ');
    story.likes = addRemoveInList(story.likes, userId);
    let isLiked = story.likes.includes(userId);
    story = await (await story.save({ new: true })).populate('likes', 'fullName smallProfilePicture profilePicture');
    story.isLiked = isLiked;
    story.isSeen = true;
    return { isLiked, story };
}


module.exports = {
    addStory,
    getFilterdStories,
    likeStory,
};