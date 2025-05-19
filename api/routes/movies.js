import { Router } from "express";
import movies from "../movies.json" with {type : "json"}
import { validateMovie, validatePartialMovie } from "../movieScheme";

export const movieRouter = Router();

movieRouter.get("/",(req,res)=>{
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
})

movieRouter.get("/:title",(req,res)=>{
    const { title } = req.params;
  const movie = movies.find((movie) => movie.title === title);
  if (movie) return res.json(movie);

  res.status(404).send("error 404");
})

movieRouter.post("/",(req,res)=>{
    const result = validateMovie(req.body);
  if (result.error) {
    return res.status(400).json({ message: " Error" }); //Status 400 es una bad request es decir que el cliente intento pedir o enviar algo que es invalido
  }
  const newMovie = {
    id: randomUUID(),
    ...result.data,
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

movieRouter.patch("/:id",(req,res)=>{
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
})

movieRouter.delete("/:id",(req,res)=>{
    const { id } = req.params;

  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (!movieIndex < 0) {
    res.status(404).json("erro moviee not found");
  }
  movies.splice(movieIndex, 1);
  res.json(movies);
})