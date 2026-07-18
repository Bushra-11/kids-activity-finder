const mongoose = require('mongoose')

const enrollmentSchema = mongoose.Schema({
    childName:{
        type: String,
        required: true
    },
    priceAtEnrollment:{
        type: Number,
        required: true
    },
    status: { 
        type: String,
        enum: ["Active","Cancelled"],
        default: "Active"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    activityId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
        required: true
    }
}, { timestamps: true })


const Enrollment = mongoose.model("Enrollment",enrollmentSchema)

module.exports = Enrollment