const router = require("express").Router()
const isSignedIn = require('../middleware/is-signed-in')
const isParent = require('../middleware/is-parent')
const isProvider = require('../middleware/is-provider')
const Enrollment = require('../models/Enrollment')

// View own enrollment history + provider can view all enrollments 
router.get('/', isSignedIn, async (req, res) => {
  if (req.session.user.role === 'provider') {
    const enrollments = await Enrollment.find().populate('activityId').populate('userId');

    const groupedEnrollments = enrollments.reduce((acc, oneEnrollment) => {
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
    
    return res.render('enrollments/provider-enrollments-view.ejs', { enrollments, groupedEnrollments });
  }

  const enrollments = await Enrollment.find({ userId: req.session.user._id }).populate('activityId');
  res.render('enrollments/enrollment-history.ejs', { enrollments });
});

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

//cancel enrollment
router.delete('/:id', isSignedIn, isParent, async (req,res)=>{
    const cancelledEnrollment = await Enrollment.findByIdAndDelete(req.params.id)
    res.redirect('/enrollments')
})


module.exports = router;
