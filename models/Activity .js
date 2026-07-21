const mongoose = require("mongoose");

const activitySchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  minAge: {
    type: Number,
    required: true
  },
  maxAge:{
    type: Number,
    required: true
  },
  tags: {
    type: [String]
  },
  price: {
    type: Number,
    required: true,
    min: 5,
    max: 500
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
    max: 30
  },
  enrolledCount: {
    type: Number,
    default: 0,
    max: 30
  },
  imageUrl: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

const Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;