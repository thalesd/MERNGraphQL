const { dateToString } = require('../../helpers/date');
const { errorHandler } = require('../../helpers/error');

const { user, characters } = require('./mergers');

const Story = require('../../models/story');

const { remapStory } = require('./mergers');

module.exports = {
    stories: () => {
        return Story.find()
            .then(stories => {
                return stories.map(st => remapStory(st));
            })
            .catch(err => { console.log('----- DATABASE FETCH ERROR ----- \n' + err) })
            .catch(errorHandler)
    },
    createStory: ({ storyInput }, req) => {
        if (!req.isAuth) {
            throw new Error("User not Authenticated!");
        }
        const newStory = new Story({
            story: storyInput.story,
            characters: storyInput.characterIds,
            user: req.userId
        })

        return newStory.save()
            .then(result => {
                console.log('----- DATABASE SAVE SUCCESS ----- \n' + result);
                return remapStory(result);
            })
            .catch(err => { console.log('----- DATABASE SAVE ERROR -----\n' + err) })
            .catch(errorHandler);
    },
    deleteStory: ({ storyId }, req) => {
        if (!req.isAuth) {
            throw new Error("User not Authenticated!");
        }
        return Story.findById(storyId)
            .then(result => {
                return Story.deleteOne({ _id: result.id })
                    .then(deleteResult => {
                        console.log('----- DATABASE DELETE SUCCESS ----- \n' + deleteResult)
                        return remapStory(result);
                    })
            })
            .catch(errorHandler)
    }
}