const express = require("express");
const crypto = require("node:crypto");
const movies = require("./movies.json");
const {
  validateMovie,
  validatePartialMovie,
} = require("../clase3/movieScheme");
const app = express();

app.disable("x-powered-by");

const PORT = process.env.PORT ?? 3000;

const ACEPTEP_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:8080",
  "http://localhost:3002",
  "http:movies.com",
];

app.use(express.json()); // Este middleware sirve para que lo que voy a usar en el POST ya esté guardado en el req.body

app.get("/", (req, res) => {
  const origin = req.headers.origin;
  if (ACEPTEP_ORIGINS.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.json({ message: "hola mundo" });
});

app.get("/movies", (req, res) => {
  const origin = req.headers.origin;
  if (ACEPTEP_ORIGINS.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  //Esto es para que no exista error CORS
  //Le estoy diciendo que le de acceso a todo lo que haga fetch a esta route de esta api
  //Donde tengo el * puedo poner una url en especifica que va a ser la unica
  //a la que le daria acceso a la api
  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some(
        (movieGenre) => movieGenre.toLowerCase() === genre.toLowerCase()
      )
    );
    res.json(filteredMovies);
  }
  res.status(200).json(movies);
});

app.get("/movies/:title", (req, res) => {
  const origin = req.headers.origin;
  if (ACEPTEP_ORIGINS.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  const { title } = req.params;
  const movie = movies.find((movie) => movie.title === title);
  if (movie) return res.json(movie);

  res.status(404).send("error 404");
});

app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);
  if (result.error) {
    return res.status(400).json({ message: " Error" }); //Status 400 es una bad request es decir que el cliente intento pedir o enviar algo que es invalido
  }
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.patch("/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body);

  if (result.error) return res.status(401).json({ message: "Wrong input" });
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (!movieIndex < 0)
    return res.status(404).json({ message: "Movie not found" });
  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  };
  movies[movieIndex] = updateMovie;

  return res.json(updateMovie);
});

app.delete("/movies/:id", (req, res) => {
  const { id } = req.params;

  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (!movieIndex < 0) {
    res.status(404).json("erro moviee not found");
  }
  movies.splice(movieIndex, 1);
  res.json(movies);
});

app.options("/movies/:id", (req, res) => {
  const origin = req.headers.origin;
  if (ACEPTEP_ORIGINS.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  }
  res.send(200);
});
//el option me sirve en el caso de que quiera hacer un delete/patch/put
//para hacer el cors

module.exports = app;
