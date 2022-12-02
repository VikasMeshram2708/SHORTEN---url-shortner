const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const yup = require("yup");
const idgen = require("idgen");
const monk = require("monk");
const db = monk(process.env.MONGO_URI);
const urls = db.get("urls");
// urls.createIndex("name");
urls.createIndex("slug");
// const { nanoid } = require("nanoid");
// nanoid();

// Schema
const schema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    // .matches(/[a-z0-9_-]/i),
    .matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
});

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

app.get("/:id", async (req, res, next) => {
  // TODO : redirect to url
  const { id: slug } = req.params;
  try {
    const url = await urls.findOne({ slug });
    if (url) {
      res.redirect(url.url);
    }
    res.redirect(`/?error=${slug} not found`);
  } catch (error) {
    res.redirect("/?error=Link not found");
  }
});

app.post("/url", async (req, res, next) => {
  // TODO : create a short url
  let { slug, url } = req.body;
  try {
    await schema.validate({
      slug,
      url,
    });
    if (!slug) {
      slug = idgen(5);
    } else {
      // make sure it's no existing
      const existing = await urls.findOne({ slug });
      if (existing) {
        throw new Error("Slug in use ... 🍔");
      }
    }
    slug = slug.toLowerCase();
    console.log(slug);
    // const secret = idgen(10).toLocaleLowerCase();
    const newUrl = {
      url,
      slug,
    };
    const created = await urls.insert(newUrl);
    res.json(created);
  } catch (error) {
    // if (error.message.startsWith("E11000")) {
    //   error.message = "Slug in use ... 🍔";
    // }
    next(error);
  }
});

// error handler
app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? "🍰" : error.stack,
  });
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
