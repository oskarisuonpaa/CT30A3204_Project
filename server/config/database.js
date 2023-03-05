const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/database");

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

const questionSchema = mongoose.Schema(
  {
    user: { type: String, required: true },
    title: { type: String, required: true },
    question: { type: String, required: true },
    code: String,
    score: { type: Number, default: 0 },
    upvotedBy: [String],
    downvotedBy: [String],
    comments: [mongoose.Schema.Types.ObjectId],
  },
  { timestamps: true }
);

const commentSchema = mongoose.Schema(
  {
    user: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
const Question = mongoose.model("Question", questionSchema);
const Comment = mongoose.model("Comment", commentSchema);

module.exports = { User, Question, Comment };
