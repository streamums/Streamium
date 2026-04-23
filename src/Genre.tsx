import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getMoviesByGenre, getTVByGenre } from "@/lib/tmdb";
import { MOVIE_GENRES, TV_GENRES } from "@/lib/constants";
import { MediaCard } from "@/components/MediaCard";
import { Loader2 } from "lucide-react";

export function Genre() {
  const [movieMatch, movieParams] = useRoute("/genre/movie/:id");
  const [tvMatch, tvParams] = useRoute("/genre/tv/:id");

  const isMovie = !!movieMatch;
  const genreId = Number(isMovie ? movieParams?.id : tvParams?.id);
  const genres = isMovie ? MOVIE_GENRES : TV_GENRES;
  const genre = genres.find((g) => g.id === genreId);

  const { data, isLoading } = useQuery({
    queryKey: ["genre", isMovie ? "movie" : "tv", genreId],
    queryFn: () => (isMovie ? getMoviesByGenre(genreId) : getTVByGenre(genreId)),
    enabled: !!genreId,
  });

  const items = data?.results || [];

  return (
    <div className="min-h-screen bg-[#09090b] pt-20 px-4 pb-12">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-6">
          <p className="text-zinc-500 text-sm mb-1">{isMovie ? "Movies" : "TV Shows"}</p>
          <h1 className="text-white text-3xl font-bold">{genre?.name || "Genre"}</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {items.map((item: { id: number }) => (
              <MediaCard
                key={item.id}
                item={item as any}
                mediaType={isMovie ? "movie" : "tv"}
              />
            ))}
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="text-center py-24 text-zinc-500">
            <p>No titles found for this genre.</p>
          </div>
        )}
      </div>
    </div>
  );
}
