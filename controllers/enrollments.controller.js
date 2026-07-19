const router = require("express").Router()

// View own enrollment history
router.get('/', (req,res)=>{
    res.render('enrollments/enrollment-history.ejs')
})


module.exports = router;
