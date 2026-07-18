const router = require("express").Router()
const Activity = require('../models/Activity ')
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
        ageRange: req.body.ageRange,
        tags: req.body.tags.split(',').map(tag => tag.trim()),
        price: req.body.price,
        capacity: req.body.capacity,
        imageUrl: req.body.imageUrl,
        createdBy: req.session.user
    })
    res.redirect('/activities')
})

//Show Activity Details
router.get('/:id', async (req,res)=>{
    const activity = await Activity.findById(req.params.id)
    res.render('activity/activity-details.ejs', {activity})
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
        ageRange: req.body.ageRange,
        tags: req.body.tags.split(',').map(tag => tag.trim()),
        price: req.body.price,
        capacity: req.body.capacity,
        imageUrl: req.body.imageUrl,
    })
    res.redirect(`/activities/${req.params.id}`);
})

module.exports = router;