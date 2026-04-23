import { useQuery } from "@tanstack/react-query";
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies, getNowPlayingMovies } from "@/lib/tmdb";
import { MediaRow } from "@/components/MediaRow";
import { HeroSection } from "@/components/HeroSection";

export function Movies() {
  const { data: popular } = useQuery({
    queryKey: ["movies", "popular"],
    queryFn: () => getPopularMovies(),
  });
  const { data: topRated } = useQuery({
    queryKey: ["movies", "toprated"],
    queryFn: () => getTopRatedMovies(),
  });
  const { data: upcoming } = useQuery({
    queryKey: ["movies", "upcoming"],
    queryFn: () => getUpcomingMovies(),
  });
  const { data: nowPlaying } = useQuery({
    queryKey: ["movies", "nowplaying"],
    queryFn: () => getNowPlayingMovies(),
  });

  const heroItems = (popular?.results || []).slice(0, 6).map((m: { media_type?: string }) => ({
    ...m,
    media_type: "movie" as const,
  }));

  return (
    <div className="min-h-screen bg-[#09090b]">
      {heroItems.length > 0 && <HeroSection items={heroItems} />}
      <div className="max-w-screen-xl mx-auto py-6 mt-2">
        <MediaRow title="Popular Movies" items={popular?.results || []} mediaType="movie" />
        <MediaRow title="Now Playing" items={nowPlaying?.results || []} mediaType="movie" />
        <MediaRow title="Top Rated" items={topRated?.results || []} mediaType="movie" />
        <MediaRow title="Upcoming" items={upcoming?.results || []} mediaType="movie" />
      </div>
    </div>
  );
}
