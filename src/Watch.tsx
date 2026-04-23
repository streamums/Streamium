import { useState, useEffect, useMemo } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star, ChevronDown, ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { getMovieDetail, getTVDetail, getTVSeason, img } from "@/lib/tmdb";
import { PROVIDERS, type Provider } from "@/lib/constants";
import { useContinueWatching } from "@/hooks/useContinueWatching";

function useSearchParams() {
  const [loc] = useLocation();
  return useMemo(() => {
    const qs = loc.includes("?") ? loc.split("?")[1] : "";
    return new URLSearchParams(qs);
  }, [loc]);
}

export function Watch() {
  const [movieMatch, movieParams] = useRoute("/movie/:id/watch");
  const [tvMatch, tvParams] = useRoute("/tv/:id/watch");
  const [, navigate] = useLocation();
  const sp = useSearchParams();

  const isMovie = !!movieMatch;
  const rawId = movieParams?.id || tvParams?.id;
  const id = Number(rawId);

  const [season, setSeason] = useState(Number(sp.get("season") || 1));
  const [episode, setEpisode] = useState(Number(sp.get("episode") || 1));
  const [providerId, setProviderId] = useState(() => {
    return localStorage.getItem("streamium_provider") || PROVIDERS[0].id;
  });
  const [starredIds, setStarredIds] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("streamium_starred") || "[]"); }
    catch { return []; }
  });
  const [showProviders, setShowProviders] = useState(false);

  const { data: movie } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieDetail(id),
    enabled: isMovie && !!id,
  });

  const { data: show } = useQuery({
    queryKey: ["tv", id],
    queryFn: () => getTVDetail(id),
    enabled: !isMovie && !!id,
  });

  const { data: seasonData } = useQuery({
    queryKey: ["tv", id, "season", season],
    queryFn: () => getTVSeason(id, season),
    enabled: !isMovie && !!id,
  });

  const { push } = useContinueWatching();

  const meta = isMovie ? movie : show;
  const title = meta ? (meta.title || meta.name) : "";
  const posterPath = meta?.poster_path || null;
  const backdropPath = meta?.backdrop_path || null;

  const episodes = seasonData?.episodes || [];
  const realSeasons = (show?.seasons || []).filter(
    (s: { season_number: number }) => s.season_number > 0
  );

  const provider = useMemo(
    () => PROVIDERS.find((p) => p.id === providerId) || PROVIDERS[0],
    [providerId]
  );

  const embedUrl = isMovie
    ? provider.getMovieUrl(id)
    : provider.getTvUrl(id, season, episode);

  const sortedProviders = useMemo(() => {
    const starred = PROVIDERS.filter((p) => starredIds.includes(p.id));
    const rest = PROVIDERS.filter((p) => !starredIds.includes(p.id));
    return [...starred, ...rest];
  }, [starredIds]);

  useEffect(() => {
    if (!title) return;
    push({
      id,
      mediaType: isMovie ? "movie" : "tv",
      title,
      posterPath,
      backdropPath,
      season: isMovie ? undefined : season,
      episode: isMovie ? undefined : episode,
    });
  }, [id, season, episode, isMovie, title]);

  const selectProvider = (p: Provider) => {
    setProviderId(p.id);
    localStorage.setItem("streamium_provider", p.id);
    setShowProviders(false);
  };

  const toggleStar = (pid: string) => {
    setStarredIds((prev) => {
      const next = prev.includes(pid) ? prev.filter((x) => x !== pid) : [...prev, pid];
      localStorage.setItem("streamium_starred", JSON.stringify(next));
      return next;
    });
  };

  const prevEpisode = () => {
    if (episode > 1) setEpisode((e) => e - 1);
    else if (season > 1) {
      const prevSeason = season - 1;
      setSeason(prevSeason);
      setEpisode(999);
    }
  };

  const nextEpisode = () => {
    const maxEp = episodes.length;
    if (maxEp > 0 && episode < maxEp) {
      setEpisode((e) => e + 1);
    } else if (realSeasons.length > 0 && season < realSeasons.length) {
      setSeason((s) => s + 1);
      setEpisode(1);
    }
  };

  const currentEp = episodes.find(
    (e: { episode_number: number }) => e.episode_number === episode
  );

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col pt-14">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
        <button
          onClick={() => navigate(isMovie ? `/movie/${id}` : `/tv/${id}`)}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-semibold text-sm truncate">{title}</h1>
          {!isMovie && (
            <p className="text-zinc-500 text-xs">
              Season {season}, Episode {episode}
              {currentEp?.name ? ` — ${currentEp.name}` : ""}
            </p>
          )}
        </div>

        {/* Provider selector button */}
        <div className="relative">
          <button
            onClick={() => setShowProviders((s) => !s)}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs px-3 py-1.5 rounded-md border border-zinc-700 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            {provider.name}
            <ChevronDown className={`w-3 h-3 transition-transform ${showProviders ? "rotate-180" : ""}`} />
          </button>

          {showProviders && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl min-w-[180px] max-h-72 overflow-y-auto">
              <p className="text-zinc-500 text-xs px-3 pt-2 pb-1">Providers (★ = starred)</p>
              {sortedProviders.map((p) => {
                const isStarred = starredIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-zinc-800 transition-colors ${
                      p.id === providerId ? "text-white bg-zinc-800" : "text-zinc-300"
                    }`}
                    onClick={() => selectProvider(p)}
                  >
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleStar(p.id); }}
                      className={`text-xs ${isStarred ? "text-yellow-400" : "text-zinc-600 hover:text-zinc-400"}`}
                    >
                      <Star className={`w-3 h-3 ${isStarred ? "fill-current" : ""}`} />
                    </button>
                    <span className="text-sm">{p.name}</span>
                    {p.id === providerId && (
                      <span className="ml-auto w-1.5 h-1.5 bg-[#e50914] rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Player */}
      <div className="w-full aspect-video bg-black">
        <iframe
          key={embedUrl}
          src={embedUrl}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          referrerPolicy="origin"
        />
      </div>

      {/* TV controls */}
      {!isMovie && (
        <div className="flex flex-col md:flex-row gap-4 px-4 py-4 border-t border-zinc-800">
          {/* Season + Episode navigation */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
              {realSeasons.map((s: { season_number: number }) => (
                <button
                  key={s.season_number}
                  onClick={() => { setSeason(s.season_number); setEpisode(1); }}
                  className={`shrink-0 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    season === s.season_number
                      ? "bg-[#e50914] text-white"
                      : "bg-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  S{s.season_number}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-auto md:ml-0">
              <button
                onClick={prevEpisode}
                className="flex items-center gap-1 bg-zinc-800 text-zinc-300 hover:text-white px-3 py-1.5 rounded text-xs transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Prev
              </button>
              <span className="text-zinc-400 text-xs">E{episode}</span>
              <button
                onClick={nextEpisode}
                className="flex items-center gap-1 bg-zinc-800 text-zinc-300 hover:text-white px-3 py-1.5 rounded text-xs transition-colors"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Episode list */}
          {episodes.length > 0 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar md:flex-1">
              {episodes.map((ep: { episode_number: number; name: string; still_path: string | null }) => (
                <button
                  key={ep.episode_number}
                  onClick={() => setEpisode(ep.episode_number)}
                  className={`shrink-0 flex flex-col items-start gap-1 p-2 rounded-lg text-left transition-colors ${
                    ep.episode_number === episode
                      ? "bg-zinc-700 ring-1 ring-[#e50914]"
                      : "bg-zinc-900 hover:bg-zinc-800"
                  }`}
                >
                  <div className="w-24 aspect-[16/9] bg-zinc-800 rounded overflow-hidden">
                    {ep.still_path && (
                      <img
                        src={img(ep.still_path, "w185")!}
                        alt={ep.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <span className="text-zinc-400 text-xs">E{ep.episode_number}</span>
                  <span className="text-white text-xs font-medium w-24 truncate">{ep.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Info below player */}
      {meta && (
        <div className="px-4 py-4 border-t border-zinc-800 max-w-2xl">
          {!isMovie && currentEp && (
            <p className="text-white font-semibold mb-1">{currentEp.name}</p>
          )}
          {!isMovie && currentEp?.overview && (
            <p className="text-zinc-400 text-sm leading-relaxed">{currentEp.overview}</p>
          )}
          {isMovie && (
            <p className="text-zinc-400 text-sm leading-relaxed">{meta.overview}</p>
          )}
          <p className="text-zinc-600 text-xs mt-3">
            If the player doesn't load, try switching to a different provider above.
          </p>
        </div>
      )}
    </div>
  );
}
