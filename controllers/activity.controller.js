const router = require("express").Router()
const Activity = require('../models/Activity ')
const isSignedIn = require('../middleware/is-signed-in')


router.get('/',async (req,res)=>{
    const allActivities = await Activity.find()
    res.render('activity/all-activities.ejs', { allActivities })
})


module.exports = router;