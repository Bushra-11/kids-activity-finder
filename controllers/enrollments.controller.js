const router = require("express").Router()
const isSignedIn = require('../middleware/is-signed-in')
const isParent = require('../middleware/is-parent')
const isProvider = require('../middleware/is-provider')
const Enrollment = require('../models/Enrollment')
const Activity = require('../models/Activity ')

router.get('/', isSignedIn, async (req, res) => {
  if (req.session.user.role === 'provider') {
    const enrollments = await Enrollment.find().populate('activityId').populate('userId');

    const providerEnrollments = enrollments.filter((oneEnrollment) =>
      oneEnrollment.activityId?.createdBy?.toString() === req.session.user._id.toString()
    );

    const groupedEnrollments = providerEnrollments.reduce((acc, oneEnrollment) => {
      const activityTitle = oneEnrollment.activityId?.title || 'Unknown';

      if (!acc[activityTitle]) {
        acc[activityTitle] = {
          capacity: oneEnrollment.activityId?.capacity,
          enrolledCount: oneEnrollment.activityId?.enrolledCount,
          entries: []
        };
      }

      acc[activityTitle].entries.push({
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

router.get('/:id', isSignedIn, isParent, async(req,res)=>{
    const enrollment = await Enrollment.findById(req.params.id).populate('activityId')
    res.render('enrollments/enrollment-details.ejs', {enrollment})
})

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
