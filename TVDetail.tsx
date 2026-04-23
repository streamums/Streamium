import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Play, Plus, Check, Star, Calendar, ChevronDown } from "lucide-react";
import { getTVDetail, getTVSeason, img } from "@/lib/tmdb";
import { useWatchlist } from "@/hooks/useWatchlist";
import { MediaRow } from "@/components/MediaRow";
import { Loader2 } from "lucide-react";

export function TVDetail() {
  const [, params] = useRoute("/tv/:id");
  const [, navigate] = useLocation();
  const id = Number(params?.id);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [expanded, setExpanded] = useState(false);

  const { data: show, isLoading } = useQuery({
    queryKey: ["tv", id],
    queryFn: () => getTVDetail(id),
    enabled: !!id,
  });

  const { data: season } = useQuery({
    queryKey: ["tv", id, "season", selectedSeason],
    queryFn: () => getTVSeason(id, selectedSeason),
    enabled: !!id && !!selectedSeason,
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

  if (!show) return null;

  const backdrop = img(show.backdrop_path, "original");
  const poster = img(show.poster_path, "w500");

  const realSeasons = (show.seasons || []).filter(
    (s: { season_number: number }) => s.season_number > 0
  );

  const cast = (show.credits?.cast || []).slice(0, 12);
  const recommendations = (show.recommendations?.results || []).slice(0, 14);
  const similar = (show.similar?.results || []).slice(0, 14);

  const trailerKey = (show.videos?.results || []).find(
    (v: { type: string; site: string }) => v.type === "Trailer" && v.site === "YouTube"
  )?.key;

  const episodes = (season?.episodes || []);
  const displayedEpisodes = expanded ? episodes : episodes.slice(0, 8);

  const watchlistItem = {
    id: show.id,
    name: show.name,
    poster_path: show.poster_path,
    backdrop_path: show.backdrop_path,
    overview: show.overview,
    vote_average: show.vote_average,
    first_air_date: show.first_air_date,
    media_type: "tv" as const,
  };

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Backdrop */}
      <div className="relative w-full h-[50vw] min-h-[300px] max-h-[500px]">
        {backdrop && (
          <img src={backdrop} alt={show.name} className="w-full h-full object-cover object-top" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent" />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 -mt-32 relative z-10 pb-12">
        <div className="flex gap-6 flex-col md:flex-row">
          {poster && (
            <div className="shrink-0">
              <img src={poster} alt={show.name} className="w-36 md:w-48 rounded-lg shadow-2xl" />
            </div>
          )}

          <div className="flex-1">
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">{show.name}</h1>

            {show.tagline && <p className="text-zinc-400 italic mb-3">{show.tagline}</p>}

            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-zinc-400">
              {show.first_air_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {show.first_air_date.slice(0, 4)}
                </span>
              )}
              {show.number_of_seasons && (
                <span>{show.number_of_seasons} Season{show.number_of_seasons > 1 ? "s" : ""}</span>
              )}
              {show.vote_average > 0 && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {show.vote_average.toFixed(1)}
                </span>
              )}
              {show.status && (
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  show.status === "Returning Series"
                    ? "border-green-800 text-green-400"
                    : "border-zinc-700 text-zinc-400"
                }`}>
                  {show.status}
                </span>
              )}
            </div>

            {show.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {show.genres.map((g: { id: number; name: string }) => (
                  <span key={g.id} className="border border-zinc-700 text-zinc-300 text-xs px-2.5 py-1 rounded-full">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="text-zinc-300 text-sm leading-relaxed mb-5 max-w-2xl">{show.overview}</p>

            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={() =>
                  navigate(`/tv/${id}/watch?season=${selectedSeason}&episode=1`)
                }
                className="flex items-center gap-2 bg-[#e50914] text-white font-semibold px-6 py-2.5 rounded-md hover:bg-[#c0070f] transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
                Watch S{selectedSeason}E1
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
          </div>
        </div>

        {/* Season selector + Episodes */}
        {realSeasons.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <h2 className="text-white font-semibold text-lg">Episodes</h2>
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {realSeasons.map((s: { season_number: number; name: string }) => (
                  <button
                    key={s.season_number}
                    onClick={() => { setSelectedSeason(s.season_number); setExpanded(false); }}
                    className={`shrink-0 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      selectedSeason === s.season_number
                        ? "bg-[#e50914] text-white"
                        : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
                    }`}
                  >
                    S{s.season_number}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {displayedEpisodes.map(
                (ep: {
                  episode_number: number;
                  name: string;
                  overview: string;
                  still_path: string | null;
                  runtime: number | null;
                  air_date: string;
                }) => (
                  <button
                    key={ep.episode_number}
                    onClick={() =>
                      navigate(
                        `/tv/${id}/watch?season=${selectedSeason}&episode=${ep.episode_number}`
                      )
                    }
                    className="flex gap-3 bg-zinc-900 hover:bg-zinc-800 rounded-lg p-3 text-left transition-colors group/ep"
                  >
                    {/* Thumbnail */}
                    <div className="shrink-0 w-28 aspect-[16/9] bg-zinc-800 rounded overflow-hidden relative">
                      {ep.still_path ? (
                        <img
                          src={img(ep.still_path, "w300")!}
                          alt={ep.name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/ep:opacity-100 bg-black/40 transition-opacity">
                        <Play className="w-6 h-6 text-white fill-current" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-zinc-300 text-xs text-zinc-500 mb-0.5">
                        E{ep.episode_number}
                        {ep.runtime ? ` · ${ep.runtime}m` : ""}
                      </p>
                      <p className="text-white text-sm font-medium leading-tight truncate">{ep.name}</p>
                      <p className="text-zinc-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                        {ep.overview}
                      </p>
                    </div>
                  </button>
                )
              )}
            </div>

            {episodes.length > 8 && (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="mt-4 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm mx-auto"
              >
                {expanded ? "Show less" : `Show all ${episodes.length} episodes`}
                <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>
        )}

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

        {recommendations.length > 0 && (
          <div className="mt-10">
            <MediaRow title="Recommended" items={recommendations} mediaType="tv" />
          </div>
        )}
        {similar.length > 0 && (
          <div className="mt-4">
            <MediaRow title="Similar Shows" items={similar} mediaType="tv" />
          </div>
        )}
      </div>
    </div>
  );
}
