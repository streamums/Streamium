import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Play, Plus, Check, Star, Clock, Calendar } from "lucide-react";
import { getMovieDetail, img } from "@/lib/tmdb";
import { useWatchlist } from "@/hooks/useWatchlist";
import { MediaRow } from "@/components/MediaRow";
import { Loader2 } from "lucide-react";

export function MovieDetail() {
  const [, params] = useRoute("/movie/:id");
  const [, navigate] = useLocation();
  const id = Number(params?.id);

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetail(id),
    enabled: !!id,
  });

  const { toggle, isInList } = useWatchlist();
  const inList = isInList(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center pt-14">
        <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
      </div>
    );
  }

  if (!movie) return null;

  const backdrop = img(movie.backdrop_path, "original");
  const poster = img(movie.poster_path, "w500");
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  const directors = (movie.credits?.crew || [])
    .filter((c: { job: string }) => c.job === "Director")
    .slice(0, 3);

  const cast = (movie.credits?.cast || []).slice(0, 12);
  const recommendations = (movie.recommendations?.results || []).slice(0, 14);
  const similar = (movie.similar?.results || []).slice(0, 14);

  const trailerKey = (movie.videos?.results || []).find(
    (v: { type: string; site: string }) => v.type === "Trailer" && v.site === "YouTube"
  )?.key;

  const watchlistItem = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    overview: movie.overview,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
    media_type: "movie" as const,
  };

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Backdrop */}
      <div className="relative w-full h-[50vw] min-h-[300px] max-h-[500px]">
        {backdrop && (
          <img
            src={backdrop}
            alt={movie.title}
            className="w-full h-full object-cover object-top"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent" />
      </div>

      {/* Detail content */}
      <div className="max-w-screen-xl mx-auto px-4 -mt-32 relative z-10 pb-12">
        <div className="flex gap-6 flex-col md:flex-row">
          {/* Poster */}
          {poster && (
            <div className="shrink-0">
              <img
                src={poster}
                alt={movie.title}
                className="w-36 md:w-48 rounded-lg shadow-2xl"
              />
            </div>
          )}

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
              {movie.title}
            </h1>

            {movie.tagline && (
              <p className="text-zinc-400 italic mb-3">{movie.tagline}</p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-zinc-400">
              {movie.release_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {movie.release_date.slice(0, 4)}
                </span>
              )}
              {runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {runtime}
                </span>
              )}
              {movie.vote_average > 0 && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {movie.vote_average.toFixed(1)}
                  <span className="text-zinc-500">/ 10</span>
                </span>
              )}
            </div>

            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((g: { id: number; name: string }) => (
                  <span
                    key={g.id}
                    className="border border-zinc-700 text-zinc-300 text-xs px-2.5 py-1 rounded-full"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <p className="text-zinc-300 text-sm leading-relaxed mb-5 max-w-2xl">
              {movie.overview}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() => navigate(`/movie/${id}/watch`)}
                className="flex items-center gap-2 bg-[#e50914] text-white font-semibold px-6 py-2.5 rounded-md hover:bg-[#c0070f] transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
                Watch Now
              </button>
              <button
                onClick={() => toggle(watchlistItem)}
                className="flex items-center gap-2 bg-zinc-800 text-white font-semibold px-5 py-2.5 rounded-md hover:bg-zinc-700 transition-colors border border-zinc-700"
              >
                {inList ? <Check className="w-4 h-4 text-green-400" /> : <Plus className="w-4 h-4" />}
                {inList ? "In Watchlist" : "Add to Watchlist"}
              </button>
              {trailerKey && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailerKey}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-zinc-800 text-white px-5 py-2.5 rounded-md hover:bg-zinc-700 transition-colors border border-zinc-700 text-sm"
                >
                  Trailer
                </a>
              )}
            </div>

            {/* Director */}
            {directors.length > 0 && (
              <p className="text-sm text-zinc-400">
                <span className="text-zinc-500">Director: </span>
                {directors.map((d: { name: string }) => d.name).join(", ")}
              </p>
            )}
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div className="mt-10">
            <h2 className="text-white font-semibold text-lg mb-4">Cast</h2>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {cast.map((person: { id: number; name: string; character: string; profile_path: string | null }) => (
                <div key={person.id} className="shrink-0 w-24 text-center">
                  <div className="w-24 h-24 rounded-full bg-zinc-800 overflow-hidden mb-2 mx-auto">
                    {person.profile_path ? (
                      <img
                        src={img(person.profile_path, "w185")!}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-2xl">
                        {person.name[0]}
                      </div>
                    )}
                  </div>
                  <p className="text-zinc-200 text-xs font-medium leading-tight">{person.name}</p>
                  <p className="text-zinc-500 text-xs leading-tight mt-0.5 line-clamp-2">
                    {person.character}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-10">
            <MediaRow title="Recommended" items={recommendations} mediaType="movie" />
          </div>
        )}
        {similar.length > 0 && (
          <div className="mt-4">
            <MediaRow title="Similar Movies" items={similar} mediaType="movie" />
          </div>
        )}
      </div>
    </div>
  );
}
