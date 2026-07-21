const router = require("express").Router()
const isSignedIn = require('../middleware/is-signed-in')
const isParent = require('../middleware/is-parent')
const isProvider = require('../middleware/is-provider')
const Enrollment = require('../models/Enrollment')
const Activity = require('../models/Activity ')

// View own enrollment history + provider can view all enrollments 
router.get('/', isSignedIn, async (req, res) => {
  if (req.session.user.role === 'provider') {
    const enrollments = await Enrollment.find().populate('activityId').populate('userId');

    // so the provider gets his enrollments only
    const providerEnrollments = enrollments.filter((oneEnrollment) =>
      oneEnrollment.activityId?.createdBy?.toString() === req.session.user._id.toString()
    );

    const groupedEnrollments = providerEnrollments.reduce((acc, oneEnrollment) => {
      const activityTitle = oneEnrollment.activityId?.title || 'Unknown';

      if (!acc[activityTitle]) {
        acc[activityTitle] = [];
      }

      acc[activityTitle].push({
        childName: oneEnrollment.childName,
        'createdAt': oneEnrollment.createdAt
      });

      return acc;
    }, {});

    return res.render('enrollments/provider-enrollments-view.ejs', { enrollments: providerEnrollments, groupedEnrollments });
  }

  const enrollments = await Enrollment.find({ userId: req.session.user._id }).populate('activityId');
  res.render('enrollments/enrollment-history.ejs', { enrollments });
});

// Enroll child in activity
router.post('/:activityId', isSignedIn, isParent, async(req,res)=>{
    const activity = await Activity.findById(req.params.activityId)

    if (!activity || activity.enrolledCount >= activity.capacity) {
        return res.redirect(`/activities/${req.params.activityId}`)
    }

    const enrollChild = await Enrollment.create({
        childName: req.body.childName,
        priceAtEnrollment: req.body.priceAtEnrollment,
        status: req.body.status,
        userId: req.session.user._id,
        activityId: req.params.activityId
    })

    activity.enrolledCount += 1
    await activity.save({ validateModifiedOnly: true })

    res.redirect(`/activities/${req.params.activityId}`)
})

// view enrollment details
router.get('/:id', isSignedIn, isParent, async(req,res)=>{
    const enrollment = await Enrollment.findById(req.params.id).populate('activityId')
    res.render('enrollments/enrollment-details.ejs', {enrollment})
})

//cancel enrollment
router.delete('/:id', isSignedIn, isParent, async (req,res)=>{
    const cancelledEnrollment = await Enrollment.findByIdAndDelete(req.params.id)

    if (cancelledEnrollment && cancelledEnrollment.status === 'Active') {
        const activity = await Activity.findById(cancelledEnrollment.activityId)
        if (activity) {
            activity.enrolledCount -= 1
            await activity.save({ validateModifiedOnly: true })
        }
    }
    res.redirect('/enrollments')
})


module.exports = router;
