const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE_URL = "https://api.themoviedb.org/3";

export const IMG_BASE = "https://image.tmdb.org/t/p/";

export function img(path: string | null, size = "w500") {
  if (!path) return null;
  return `${IMG_BASE}${size}${path}`;
}

async function get(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", API_KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${path}`);
  return res.json();
}

export const getTrending = (window: "day" | "week" = "week") =>
  get(`/trending/all/${window}`);

export const getPopularMovies = (page = 1) =>
  get("/movie/popular", { page: String(page) });

export const getTopRatedMovies = (page = 1) =>
  get("/movie/top_rated", { page: String(page) });

export const getUpcomingMovies = () => get("/movie/upcoming");

export const getNowPlayingMovies = () => get("/movie/now_playing");

export const getPopularTV = (page = 1) =>
  get("/tv/popular", { page: String(page) });

export const getTopRatedTV = (page = 1) =>
  get("/tv/top_rated", { page: String(page) });

export const getAiringTodayTV = () => get("/tv/airing_today");

export const getOnTheAirTV = () => get("/tv/on_the_air");

export const getMovieDetail = (id: number) =>
  get(`/movie/${id}`, { append_to_response: "credits,recommendations,videos,similar" });

export const getTVDetail = (id: number) =>
  get(`/tv/${id}`, { append_to_response: "credits,recommendations,videos,similar" });

export const getTVSeason = (id: number, season: number) =>
  get(`/tv/${id}/season/${season}`);

export const searchMulti = (query: string, page = 1) =>
  get("/search/multi", { query, page: String(page) });

export const searchMovies = (query: string) =>
  get("/search/movie", { query });

export const searchTV = (query: string) =>
  get("/search/tv", { query });

export const getMoviesByGenre = (genreId: number) =>
  get("/discover/movie", { with_genres: String(genreId), sort_by: "popularity.desc" });

export const getTVByGenre = (genreId: number) =>
  get("/discover/tv", { with_genres: String(genreId), sort_by: "popularity.desc" });

export type MediaType = "movie" | "tv";

export interface Media {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: MediaType;
  genre_ids?: number[];
}

export interface Episode {
  id: number;
  episode_number: number;
  season_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  runtime: number | null;
}

export interface Season {
  id: number;
  season_number: number;
  episode_count: number;
  name: string;
  poster_path: string | null;
}

export function getTitle(m: Media) {
  return m.title || m.name || "";
}

export function getYear(m: Media) {
  const date = m.release_date || m.first_air_date;
  return date ? date.slice(0, 4) : "";
}

export function getMediaType(m: Media): MediaType {
  return m.media_type || (m.title !== undefined ? "movie" : "tv");
}
