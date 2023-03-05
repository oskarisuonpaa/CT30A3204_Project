const express = require("express");
const { default: mongoose } = require("mongoose");
const passport = require("passport");
const { Question, Comment } = require("../config/database");
const router = express.Router();

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user;
    const { title, question, code } = req.body;

    const questionObject = await Question.create({
      user: user.username,
      title: title,
      question: question,
      code: code ? code : null,
    });

    return res.status(201).send({
      message: "Question created!",
      question: questionObject._id.toString(),
    });
  }
);

router.put(
  "/upvote/:questionID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user;
    const questionID = mongoose.Types.ObjectId(req.params.questionID);

    const question = await Question.findById(questionID);

    if (question.upvotedBy.includes(user.username)) {
      return res.status(403).send({ error: "User can upvote only ones!" });
    } else if (question.downvotedBy.includes(user.username)) {
      question.downvotedBy.splice(
        question.downvotedBy.indexOf(user.username),
        1
      );
      question.upvotedBy.push(user.username);
      question.score += 2;
      question.save();
    } else {
      question.upvotedBy.push(user.username);
      question.score += 1;
      question.save();
    }

    return res.status(200).send({ message: "Score updated!" });
  }
);

router.put(
  "/downvote/:questionID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user;
    const questionID = mongoose.Types.ObjectId(req.params.questionID);

    const question = await Question.findById(questionID);

    if (question.downvotedBy.includes(user.username)) {
      return res.status(403).send({ error: "User can downvote only ones!" });
    } else if (question.upvotedBy.includes(user.username)) {
      question.upvotedBy.splice(question.upvotedBy.indexOf(user.username), 1);
      question.downvotedBy.push(user.username);
      question.score -= 2;
      question.save();
    } else {
      question.downvotedBy.push(user.username);
      question.score -= 1;
      question.save();
    }

    return res.status(200).send({ message: "Score updated!" });
  }
);

router.post(
  "/comment/:questionID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const questionID = mongoose.Types.ObjectId(req.params.questionID);
    const user = req.user;
    const { content } = req.body;

    const comment = await Comment.create({
      user: user.username,
      content: content,
    });

    const question = await Question.findById(questionID);

    question.comments.push(comment);

    await question.save();

    return res.status(201).send({ message: "Comment added!" });
  }
);

router.get("/", async (req, res) => {
  const questions = [];
  const questionsInDB = await Question.find();

  if (questionsInDB) {
    questionsInDB.forEach((question) => {
      questions.push({
        title: question.title,
        user: question.user,
        score: question.score,
        id: question._id,
      });
    });
  }

  return res.send(questions);
});

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const questionID = mongoose.Types.ObjectId(req.params.id);
    const user = req.user;

    const question = await Question.findById(questionID);

    if (question) {
      if (question.user === user.username || user.isAdmin) {
        await question.comments.forEach((comment) => {
          Comment.findByIdAndDelete(comment);
        });
        await Question.findByIdAndDelete(questionID);
        return res.status(200).send({ message: "Question deleted!" });
      }
      return res.status(401).send({ error: "Not authorized!" });
    }
    return res.status(400).send({ error: "Question not found!" });
  }
);

router.delete(
  "/:id/:commentID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id);
    const commentID = mongoose.Types.ObjectId(req.params.commentID);
    const user = req.user;

    const comment = await Comment.findById(commentID);

    if (comment) {
      if (comment.user === user.username || user.isAdmin) {
        await Comment.findByIdAndDelete(commentID);
        await Question.findByIdAndUpdate(id, {
          $pull: {
            comments: commentID,
          },
        });
        return res.status(200).send({ message: "Comment deleted!" });
      }
      return res.status(401).send({ error: "Not authorized!" });
    }
    return res.status(400).send({ error: "Comment not found!" });
  }
);

router.get("/:questionID", async (req, res) => {
  const questionID = mongoose.Types.ObjectId(req.params.questionID);
  const comments = [];

  const question = await Question.findById(questionID);

  for (let i = 0; i < question.comments.length; i++) {
    const comment = await Comment.findById(question.comments[i]);
    comments.push({
      user: comment.user,
      id: comment._id,
      content: comment.content,
      date: comment.createdAt,
    });
  }

  return res.status(200).send({
    question: {
      user: question.user,
      title: question.title,
      question: question.question,
      code: question.code,
      date: question.createdAt,
      score: question.score,
    },
    comments: comments,
  });
});

module.exports = router;
