const express = require("express");
const path = require("path");
const cors = require("cors");
const passport = require("passport");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

require("./config/passport");

app.use("/users", require("./routes/users"));
app.use("/posts", require("./routes/posts"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve("..", "client", "build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve("..", "client", "build", "index.html"))
  );
} else if (process.env.NODE_ENV === "development") {
  const corsOptions = {
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
}

module.exports = app;
