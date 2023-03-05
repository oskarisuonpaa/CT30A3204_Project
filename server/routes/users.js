const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../config/database");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (await User.exists({ username: username })) {
    return res.status(400).send({ error: "User already exists!" });
  }

  const user = await User.create({
    username: username,
    password: bcrypt.hashSync(password),
  });

  return res.status(201).send({ message: "User created!" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username });

  if (!user) {
    return res.status(400).send({ username: "User not found!" });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(400).send({ password: "Incorrect password!" });
  }

  return res.status(200).send({
    user: { username: user.username, admin: user.isAdmin },
    token:
      "Bearer " +
      jwt.sign({ username: user.username }, process.env.SECRET, {
        expiresIn: "30d",
      }),
  });
});

module.exports = router;
