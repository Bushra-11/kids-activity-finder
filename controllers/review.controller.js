const router = require("express").Router()
const Review = require('../models/Review')
const isSignedIn = require('../middleware/is-signed-in')
const isParent = require('../middleware/is-parent')

// create review on an activity
router.post('/:activityId', isSignedIn, isParent, async (req, res) => {
    await Review.create({
        rating: req.body.rating,
        comment: req.body.comment,
        userId: req.session.user._id,
        activityId: req.params.activityId
    })
    res.redirect(`/activities/${req.params.activityId}`)
})

router.get('/:id/edit',isSignedIn,isParent, async (req,res)=>{
    const review = await Review.findById(req.params.id)
    res.render('review/edit-reviews.ejs',{review})
})

router.put('/:id',isSignedIn,isParent, async (req,res)=>{
    const review = await Review.findByIdAndUpdate(req.params.id,{
        rating: req.body.rating,
        comment: req.body.comment
    })
    res.redirect(`/activities/${review.activityId}`)
})

module.exports = router;
