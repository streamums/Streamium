import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Play, Plus, Check, Info, Star } from "lucide-react";
import { img, getTitle, getYear, getMediaType, type Media } from "@/lib/tmdb";
import { useWatchlist } from "@/hooks/useWatchlist";

interface HeroSectionProps {
  items: Media[];
}

export function HeroSection({ items }: HeroSectionProps) {
  const [index, setIndex] = useState(0);
  const [, navigate] = useLocation();
  const { toggle, isInList } = useWatchlist();

  useEffect(() => {
    if (!items.length) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % Math.min(items.length, 6)), 8000);
    return () => clearInterval(t);
  }, [items.length]);

  const item = items[index];
  if (!item) return null;

  const backdrop = img(item.backdrop_path, "original");
  const title = getTitle(item);
  const year = getYear(item);
  const type = getMediaType(item);
  const inList = isInList(item.id);

  return (
    <div className="relative w-full h-[56vw] min-h-[340px] max-h-[600px] overflow-hidden">
      {/* Backdrop */}
      {backdrop && (
        <img
          key={item.id}
          src={backdrop}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700"
        />
      )}

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-black/20" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 p-6 md:p-10 max-w-xl">
        <h1 className="text-white text-2xl md:text-4xl font-bold leading-tight mb-2 drop-shadow-lg">
          {title}
        </h1>

        <div className="flex items-center gap-3 mb-3">
          {year && <span className="text-zinc-300 text-sm">{year}</span>}
          {item.vote_average > 0 && (
            <span className="flex items-center gap-1 text-yellow-400 text-sm">
              <Star className="w-3.5 h-3.5 fill-current" />
              {item.vote_average.toFixed(1)}
            </span>
          )}
          <span className="border border-zinc-500 text-zinc-400 text-xs px-1.5 py-0.5 rounded">
            {type === "movie" ? "Movie" : "TV Series"}
          </span>
        </div>

        {item.overview && (
          <p className="text-zinc-300 text-sm leading-relaxed line-clamp-3 mb-4 hidden md:block">
            {item.overview}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/${type}/${item.id}`)}
            className="flex items-center gap-2 bg-white text-black font-semibold px-5 py-2 rounded-md hover:bg-zinc-200 transition-colors text-sm"
          >
            <Play className="w-4 h-4 fill-current" />
            Play
          </button>
          <button
            onClick={() => toggle(item)}
            className="flex items-center gap-2 bg-zinc-700/70 text-white font-semibold px-4 py-2 rounded-md hover:bg-zinc-600 transition-colors text-sm backdrop-blur-sm"
          >
            {inList ? <Check className="w-4 h-4 text-green-400" /> : <Plus className="w-4 h-4" />}
            {inList ? "In List" : "My List"}
          </button>
          <button
            onClick={() => navigate(`/${type}/${item.id}`)}
            className="flex items-center gap-2 bg-zinc-700/70 text-white px-4 py-2 rounded-md hover:bg-zinc-600 transition-colors text-sm backdrop-blur-sm hidden md:flex"
          >
            <Info className="w-4 h-4" />
            More Info
          </button>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-4 right-4 flex gap-1.5">
        {items.slice(0, 6).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              i === index ? "bg-white w-4" : "bg-zinc-600"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
