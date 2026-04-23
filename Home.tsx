import { useQuery } from "@tanstack/react-query";
import {
  getTrending,
  getPopularMovies,
  getTopRatedMovies,
  getPopularTV,
  getTopRatedTV,
  getAiringTodayTV,
  getNowPlayingMovies,
} from "@/lib/tmdb";
import { HeroSection } from "@/components/HeroSection";
import { MediaRow } from "@/components/MediaRow";
import { useContinueWatching } from "@/hooks/useContinueWatching";
import { useLocation } from "wouter";
import { img } from "@/lib/tmdb";
import { Play, X } from "lucide-react";

export function Home() {
  const [, navigate] = useLocation();
  const { list: continueList, remove } = useContinueWatching();

  const { data: trending } = useQuery({
    queryKey: ["trending"],
    queryFn: () => getTrending("week"),
  });

  const { data: popularMovies } = useQuery({
    queryKey: ["movies", "popular"],
    queryFn: () => getPopularMovies(),
  });

  const { data: topRatedMovies } = useQuery({
    queryKey: ["movies", "toprated"],
    queryFn: () => getTopRatedMovies(),
  });

  const { data: nowPlaying } = useQuery({
    queryKey: ["movies", "nowplaying"],
    queryFn: () => getNowPlayingMovies(),
  });

  const { data: popularTV } = useQuery({
    queryKey: ["tv", "popular"],
    queryFn: () => getPopularTV(),
  });

  const { data: topRatedTV } = useQuery({
    queryKey: ["tv", "toprated"],
    queryFn: () => getTopRatedTV(),
  });

  const { data: airingToday } = useQuery({
    queryKey: ["tv", "airing"],
    queryFn: () => getAiringTodayTV(),
  });

  const trendingItems = trending?.results || [];
  const heroItems = trendingItems.filter(
    (m: { media_type?: string }) => m.media_type !== "person"
  );

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Hero */}
      {heroItems.length > 0 && <HeroSection items={heroItems} />}

      {/* Content */}
      <div className="max-w-screen-xl mx-auto py-6 mt-2">
        {/* Continue Watching */}
        {continueList.length > 0 && (
          <section className="mb-8 px-4 md:px-0">
            <h2 className="text-white font-semibold text-lg mb-3">Continue Watching</h2>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {continueList.map((entry) => {
                const poster = img(entry.posterPath, "w342");
                return (
                  <div
                    key={entry.id}
                    className="shrink-0 w-36 md:w-44 group/cw relative cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/${entry.mediaType}/${entry.id}/watch${
                          entry.season ? `?season=${entry.season}&episode=${entry.episode}` : ""
                        }`
                      )
                    }
                  >
                    <div className="aspect-[16/9] bg-zinc-800 rounded-md overflow-hidden relative">
                      {poster ? (
                        <img src={poster} alt={entry.title} className="w-full h-full object-cover" />
                      ) : null}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/cw:opacity-100 transition-opacity">
                        <Play className="w-8 h-8 text-white fill-current" />
                      </div>
                    </div>
                    <p className="text-zinc-300 text-xs mt-1.5 truncate">{entry.title}</p>
                    {entry.season && (
                      <p className="text-zinc-500 text-xs">S{entry.season} E{entry.episode}</p>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); remove(entry.id); }}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover/cw:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <MediaRow title="Trending This Week" items={heroItems} />
        <MediaRow title="Popular Movies" items={popularMovies?.results || []} mediaType="movie" />
        <MediaRow title="Now Playing" items={nowPlaying?.results || []} mediaType="movie" />
        <MediaRow title="Popular TV Shows" items={popularTV?.results || []} mediaType="tv" />
        <MediaRow title="Airing Today" items={airingToday?.results || []} mediaType="tv" />
        <MediaRow title="Top Rated Movies" items={topRatedMovies?.results || []} mediaType="movie" />
        <MediaRow title="Top Rated TV Shows" items={topRatedTV?.results || []} mediaType="tv" />
      </div>
    </div>
  );
}
