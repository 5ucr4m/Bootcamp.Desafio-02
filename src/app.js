const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

let repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, likes = 0 } = request.body;
  const id = uuid();

  const repository = { id, title, url, techs, likes };
  const array = [...repositories, repository];

  repositories = array;

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  let repository = repositories.find((repo) => repo.id === id);

  if (!repository) {
    return response.sendStatus(400);
  }

  if (!!title) repository = { ...repository, title };
  if (!!url) repository = { ...repository, url };
  if (!!techs) repository = { ...repository, techs };

  const array = repositories.map((repo) =>
    repo.id === id ? repository : repo
  );

  repositories = array;
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((repo) => repo.id === id);
  if (!repository) {
    return response.sendStatus(400);
  }

  const array = repositories.filter((repository) => repository.id !== id);

  repositories = array;
  return response.sendStatus(204);
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const finded = repositories.find((repo) => repo.id === id);

  if (!finded) {
    return response.sendStatus(400);
  }

  const repository = { ...finded, likes: finded.likes + 1 };

  const array = repositories.map((repo) =>
    repo.id === id ? repository : repo
  );

  repositories = array;
  return response.json(repository);
});

module.exports = app;
