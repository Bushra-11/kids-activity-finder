const router = require("express").Router()
const Activity = require('../models/Activity ')
const Review = require('../models/Review')
const Favorite = require('../models/Favorite')
const isSignedIn = require('../middleware/is-signed-in')
const isProvider = require("../middleware/is-provider")


// list all activities
router.get('/',async (req,res)=>{
    const allActivities = await Activity.find()
    res.render('activity/all-activities.ejs', { allActivities })
})

//create activity
router.get('/new',isSignedIn,isProvider,(req,res)=>{
    res.render('activity/create-activity.ejs')
})

router.post('/',isSignedIn,isProvider,async (req,res)=>{
    const createdActivity = await Activity.create({
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        minAge: req.body.minAge,
        maxAge: req.body.maxAge,
        tags: req.body.tags.split(',').map(tag => tag.trim()),
        price: req.body.price,
        capacity: req.body.capacity,
        imageUrl: req.body.imageUrl,
        createdBy: req.session.user
    })
    res.redirect('/activities')
})

// Recommended for you
router.get('/recommendations', async (req,res)=>{
    const { age, interests } = req.query
    const searched = Boolean(age || interests)
    let recommendedActivities = []

    if (searched) {
        const childAge = age ? Number(age) : null
        const interestList = interests ? interests.split(',').map(i => i.trim().toLowerCase()).filter(Boolean) : []
        const allActivities = await Activity.find()

        recommendedActivities = allActivities
            .map(activity => {
                let score = 0

                if (childAge) {
                    if (childAge >= activity.minAge && childAge <= activity.maxAge) {
                        score += 2
                    }
                }

                if (interestList.length) {
                    const activityWords = [activity.category, ...activity.tags].map(w => w.toLowerCase())
                    const matchedInterests = interestList.filter(interest =>
                        activityWords.some(word => word.includes(interest) || interest.includes(word))
                    )
                    score += matchedInterests.length
                }

                return { activity, score }
            })
            .filter(({ score }) => score > 0)
            .sort((a, b) => b.score - a.score)
            .map(({ activity }) => activity)
    }

    res.render('activity/recommendations.ejs', { recommendedActivities, searched, age, interests })
})

//Show Activity Details
router.get('/:id', async (req,res)=>{
    const activity = await Activity.findById(req.params.id)
    const reviews = await Review.find({ activityId: req.params.id }).populate('userId')

    let isFavorited = false
    if (req.session.user && req.session.user.role === 'parent') {
        const favorite = await Favorite.findOne({ userId: req.session.user._id, activityId: req.params.id })
        isFavorited = Boolean(favorite)
    }

    res.render('activity/activity-details.ejs', {activity, reviews, isFavorited})
})

//edit Activity
router.get('/:id/edit', isSignedIn, isProvider,async (req,res)=>{
    const activity = await Activity.findById(req.params.id)
    res.render('activity/edit-activity.ejs',{activity})
})

router.put('/:id',isSignedIn, isProvider,async (req,res)=>{
    await Activity.findByIdAndUpdate(req.params.id,{
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        minAge: req.body.minAge,
        maxAge: req.body.maxAge,
        tags: req.body.tags.split(',').map(tag => tag.trim()),
        price: req.body.price,
        capacity: req.body.capacity,
        imageUrl: req.body.imageUrl,
    })
    res.redirect(`/activities/${req.params.id}`);
})

//delete Activity
router.delete('/:id', isSignedIn, isProvider,async (req,res)=>{
    await Activity.findByIdAndDelete(req.params.id)
    res.redirect(`/activities`);

})

module.exports = router;