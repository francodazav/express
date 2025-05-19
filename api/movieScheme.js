import z from "zod";

const movieScheme = z.object({
  title: z.string({
    invalid_type_error: "Movie title must be a string",
    required_error: "It must have a title",
  }),
  genre: z.array(
    z.enum([
      "Action",
      "Drama",
      "Romance",
      "Thriller",
      "Crime",
      "Terror",
      "Fantasy",
      "Sci-fi",
      "Adventure",
    ])
  ),
  year: z.number().int().positive().min(1920).max(2025),
  director: z.string({
    invalid_type_error: "It has to be a string",
    required_error: "Movie must have an director",
  }),
  rate: z.number().min(0).max(10).default(0),
  poster: z.string().url(),
  duration: z.number().int().min(0),
});

export function validateMovie(input) {
  return movieScheme.safeParse(input);
}

export function validatePartialMovie(input) {
  return movieScheme.partial().safeParse(input);
  // partial() lo que hace es que todo lo que esta en el schema sea opcional
  // es decir que solo lo que voy a pasar lo va a validar y lo va a cambiar
}
