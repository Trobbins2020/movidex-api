require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const movies = require("./data/movies-data-small.json");
// const movies = require("./data/movies-data.json");

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(helmet());

app.use((req, res, next) => {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");
  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

app.get("/movie", (req, res) => {
  let result = movies;
  const { genre, country, avg_vote } = req.query;
  if (genre) {
    result = result.filter((e) =>
      e.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }

  if (country) {
    result = result.filter((e) =>
      e.country.toLowerCase().includes(country.toLowerCase())
    );
  }

  if (avg_vote) {
    result = result.filter((e) => Number(avg_vote) <= Number(e.avg_vote));
  }

  res.json(result);
});

app.listen(8080, () => {
  console.log(`Server listening at http://localhost:8080/movie`);
});
