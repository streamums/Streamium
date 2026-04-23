export interface Provider {
  id: string;
  name: string;
  getMovieUrl: (tmdbId: number) => string;
  getTvUrl: (tmdbId: number, season: number, episode: number) => string;
}

export const PROVIDERS: Provider[] = [
  {
    id: "vidsrc",
    name: "VidSrc",
    getMovieUrl: (id) => `https://vidsrc.to/embed/movie/${id}`,
    getTvUrl: (id, s, e) => `https://vidsrc.to/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "embedsu",
    name: "Embed.su",
    getMovieUrl: (id) => `https://embed.su/embed/movie/${id}`,
    getTvUrl: (id, s, e) => `https://embed.su/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "autoembed",
    name: "AutoEmbed",
    getMovieUrl: (id) => `https://player.autoembed.cc/embed/movie/${id}`,
    getTvUrl: (id, s, e) =>
      `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "superembed",
    name: "SuperEmbed",
    getMovieUrl: (id) =>
      `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    getTvUrl: (id, s, e) =>
      `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
  },
  {
    id: "vidsrcin",
    name: "VidSrc.in",
    getMovieUrl: (id) => `https://vidsrc.in/embed/movie?tmdb=${id}`,
    getTvUrl: (id, s, e) =>
      `https://vidsrc.in/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    id: "vidsrcxyz",
    name: "VidSrc.xyz",
    getMovieUrl: (id) => `https://vidsrc.xyz/embed/movie?tmdb=${id}`,
    getTvUrl: (id, s, e) =>
      `https://vidsrc.xyz/embed/tv?tmdb=${id}&season=${s}&episode=${e}`,
  },
  {
    id: "2embed",
    name: "2Embed",
    getMovieUrl: (id) => `https://www.2embed.cc/embed/${id}`,
    getTvUrl: (id, s, e) =>
      `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
  },
  {
    id: "filmxy",
    name: "FilmXY",
    getMovieUrl: (id) =>
      `https://www.filmxy.vip/embed/movie/${id}`,
    getTvUrl: (id, s, e) =>
      `https://www.filmxy.vip/embed/tv/${id}?season=${s}&episode=${e}`,
  },
  {
    id: "smashystream",
    name: "SmashyStream",
    getMovieUrl: (id) =>
      `https://player.smashy.stream/movie/${id}`,
    getTvUrl: (id, s, e) =>
      `https://player.smashy.stream/tv/${id}?s=${s}&e=${e}`,
  },
  {
    id: "moviesapi",
    name: "MoviesAPI",
    getMovieUrl: (id) =>
      `https://moviesapi.club/movie/${id}`,
    getTvUrl: (id, s, e) =>
      `https://moviesapi.club/tv/${id}-${s}-${e}`,
  },
  {
    id: "nontonger",
    name: "NontonGer",
    getMovieUrl: (id) =>
      `https://www.NontonGer.vip/embed/movie/${id}`,
    getTvUrl: (id, s, e) =>
      `https://www.NontonGer.vip/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "vidlink",
    name: "VidLink",
    getMovieUrl: (id) =>
      `https://vidlink.pro/movie/${id}`,
    getTvUrl: (id, s, e) =>
      `https://vidlink.pro/tv/${id}/${s}/${e}`,
  },
  {
    id: "111movies",
    name: "111Movies",
    getMovieUrl: (id) =>
      `https://111movies.com/movie/${id}`,
    getTvUrl: (id, s, e) =>
      `https://111movies.com/tv/${id}/${s}/${e}`,
  },
  {
    id: "vidsrcpro",
    name: "VidSrc Pro",
    getMovieUrl: (id) =>
      `https://vidsrc.pro/embed/movie/${id}`,
    getTvUrl: (id, s, e) =>
      `https://vidsrc.pro/embed/tv/${id}/${s}/${e}`,
  },
];

export const MOVIE_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 53, name: "Thriller" },
];

export const TV_GENRES = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 9648, name: "Mystery" },
  { id: 10768, name: "War & Politics" },
];
