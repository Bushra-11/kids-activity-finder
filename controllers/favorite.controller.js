const router = require("express").Router()
const isSignedIn = require('../middleware/is-signed-in')
const isParent = require('../middleware/is-parent')
const Favorite = require('../models/Favorite')

// parent view his own favorite
router.get('/', isSignedIn, isParent, async (req, res) => {
    const favorites = await Favorite.find({ userId: req.session.user._id }).populate('activityId')
    res.render('favorite/favorite.ejs', { favorites })
})

// Add activity to favorites
router.post('/:activityId', isSignedIn, isParent, async (req, res) => {
    const existingFavorite = await Favorite.findOne({
        userId: req.session.user._id,
        activityId: req.params.activityId
    })

    if (!existingFavorite) {
        await Favorite.create({
            userId: req.session.user._id,
            activityId: req.params.activityId
        })
    }

    res.redirect(`/activities/${req.params.activityId}`)
})

// Remove activity from favorites
router.delete('/:activityId', isSignedIn, isParent, async (req, res) => {
    await Favorite.findOneAndDelete({
        userId: req.session.user._id,
        activityId: req.params.activityId
    })

    res.redirect('/favorites')
})

module.exports = router;
