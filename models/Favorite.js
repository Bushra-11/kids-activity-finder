const mongoose = require('mongoose')


const favoriteSchema = mongoose.Schema({
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


const Favorite = mongoose.model("Favorite",favoriteSchema)

module.exports = Favorite