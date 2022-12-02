const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");

// middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.static("./public"));

// routes
app.post("/url/:id", (req, res) => {
  // TODO :get a short url by id
  res.json({
    message: "bhagg 🏹",
  });
});

app.get("/:id", (req, res) => {
  // TODO : redirect to url
  res.json({
    message: "bhagg 🏹",
  });
});

app.post("/url", (req, res) => {
  // TODO : create a short url
  res.json({
    message: "bhagg 🏹",
  });
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
