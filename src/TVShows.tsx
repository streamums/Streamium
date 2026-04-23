import { useQuery } from "@tanstack/react-query";
import { getPopularTV, getTopRatedTV, getAiringTodayTV, getOnTheAirTV } from "@/lib/tmdb";
import { MediaRow } from "@/components/MediaRow";
import { HeroSection } from "@/components/HeroSection";

export function TVShows() {
  const { data: popular } = useQuery({
    queryKey: ["tv", "popular"],
    queryFn: () => getPopularTV(),
  });
  const { data: topRated } = useQuery({
    queryKey: ["tv", "toprated"],
    queryFn: () => getTopRatedTV(),
  });
  const { data: airingToday } = useQuery({
    queryKey: ["tv", "airing"],
    queryFn: () => getAiringTodayTV(),
  });
  const { data: onTheAir } = useQuery({
    queryKey: ["tv", "ontheair"],
    queryFn: () => getOnTheAirTV(),
  });

  const heroItems = (popular?.results || []).slice(0, 6).map((m: { media_type?: string }) => ({
    ...m,
    media_type: "tv" as const,
  }));

  return (
    <div className="min-h-screen bg-[#09090b]">
      {heroItems.length > 0 && <HeroSection items={heroItems} />}
      <div className="max-w-screen-xl mx-auto py-6 mt-2">
        <MediaRow title="Popular TV Shows" items={popular?.results || []} mediaType="tv" />
        <MediaRow title="Airing Today" items={airingToday?.results || []} mediaType="tv" />
        <MediaRow title="On The Air" items={onTheAir?.results || []} mediaType="tv" />
        <MediaRow title="Top Rated" items={topRated?.results || []} mediaType="tv" />
      </div>
    </div>
  );
}
