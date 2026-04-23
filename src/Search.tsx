import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { searchMulti, getTitle, getYear, getMediaType, img, type Media } from "@/lib/tmdb";
import { MediaCard } from "@/components/MediaCard";

function useSearchParam() {
  const [loc] = useLocation();
  const params = new URLSearchParams(loc.includes("?") ? loc.split("?")[1] : "");
  return params.get("q") || "";
}

export function Search() {
  const [, navigate] = useLocation();
  const initialQ = useSearchParam();
  const [query, setQuery] = useState(initialQ);
  const [submitted, setSubmitted] = useState(initialQ);

  useEffect(() => {
    setQuery(initialQ);
    setSubmitted(initialQ);
  }, [initialQ]);

  const { data, isFetching } = useQuery({
    queryKey: ["search", submitted],
    queryFn: () => searchMulti(submitted),
    enabled: submitted.trim().length > 0,
  });

  const results: Media[] = (data?.results || []).filter(
    (r: { media_type?: string }) => r.media_type !== "person"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSubmitted(query.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] pt-20 px-4">
      <div className="max-w-screen-xl mx-auto">
        <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto mb-10">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, TV shows..."
            autoFocus
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 text-base"
          />
        </form>

        {isFetching && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
          </div>
        )}

        {!isFetching && submitted && results.length === 0 && (
          <div className="text-center py-16 text-zinc-500">
            <SearchIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No results for "{submitted}"</p>
          </div>
        )}

        {!submitted && (
          <div className="text-center py-16 text-zinc-600">
            <SearchIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Start typing to search</p>
          </div>
        )}

        {results.length > 0 && (
          <>
            <p className="text-zinc-500 text-sm mb-4">
              {results.length} results for "{submitted}"
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
              {results.map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  mediaType={getMediaType(item)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
