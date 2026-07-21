const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  role:{
    type: String,
    enum: ["parent","provider"],
    default: "parent"
    
  },
  interests:{
    type: [String],
  },
  childAge:{
    type: Number,
    min: 1,
    max: 13
  },
  favorites:{
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Activity"
  }
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;
