const router = require("express").Router()
const isSignedIn = require('../middleware/is-signed-in')
const isParent = require('../middleware/is-parent')
const Enrollment = require('../models/Enrollment')

// View own enrollment history
router.get('/', isSignedIn, isParent, async (req,res)=>{
    const allEnrollments = await Enrollment.find({ userId: req.session.user._id }).populate('activityId')
    res.render('enrollments/enrollment-history.ejs', {enrollments: allEnrollments})
})

// Enroll child in activity
router.post('/:activityId', isSignedIn, isParent, async(req,res)=>{
    const enrollChild = await Enrollment.create({
        childName: req.body.childName,
        priceAtEnrollment: req.body.priceAtEnrollment,
        status: req.body.status,
        userId: req.session.user._id,
        activityId: req.params.activityId
    })

    res.redirect(`/activities/${req.params.activityId}`)
})

// view enrollment details
router.get('/:id', isSignedIn, isParent, async(req,res)=>{
    const enrollment = await Enrollment.findById(req.params.id).populate('activityId')
    res.render('enrollments/enrollment-details.ejs', {enrollment})
})


module.exports = router;
