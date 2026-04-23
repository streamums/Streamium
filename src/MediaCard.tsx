import { useState } from "react";
import { useLocation } from "wouter";
import { Star, Plus, Check, Play } from "lucide-react";
import { img, getTitle, getYear, type Media, type MediaType } from "@/lib/tmdb";
import { useWatchlist } from "@/hooks/useWatchlist";
import { cn } from "@/lib/utils";

interface MediaCardProps {
  item: Media;
  mediaType?: MediaType;
  className?: string;
}

export function MediaCard({ item, mediaType, className }: MediaCardProps) {
  const [, navigate] = useLocation();
  const { toggle, isInList } = useWatchlist();
  const [imgError, setImgError] = useState(false);

  const type = mediaType || item.media_type || (item.title ? "movie" : "tv");
  const title = getTitle(item);
  const year = getYear(item);
  const poster = img(item.poster_path, "w342");
  const inList = isInList(item.id);

  const goToDetail = () => navigate(`/${type}/${item.id}`);

  return (
    <div
      className={cn(
        "group relative rounded-lg overflow-hidden bg-zinc-900 cursor-pointer transition-transform duration-200 hover:scale-105 hover:z-10",
        className
      )}
      onClick={goToDetail}
    >
      {/* Poster */}
      <div className="aspect-[2/3] bg-zinc-800">
        {poster && !imgError ? (
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs text-center px-2">
            {title}
          </div>
        )}
      </div>

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3 gap-2">
        <div>
          <p className="text-white font-semibold text-sm leading-tight line-clamp-2">{title}</p>
          <div className="flex items-center gap-2 mt-1">
            {year && <span className="text-zinc-400 text-xs">{year}</span>}
            {item.vote_average > 0 && (
              <span className="flex items-center gap-0.5 text-yellow-400 text-xs">
                <Star className="w-3 h-3 fill-current" />
                {item.vote_average.toFixed(1)}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); goToDetail(); }}
            className="flex-1 flex items-center justify-center gap-1 bg-white text-black rounded-md py-1.5 text-xs font-semibold hover:bg-zinc-200 transition-colors"
          >
            <Play className="w-3 h-3 fill-current" />
            Watch
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggle(item); }}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-zinc-700/80 hover:bg-zinc-600 transition-colors"
          >
            {inList ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Plus className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Rating badge */}
      {item.vote_average > 0 && (
        <div className="absolute top-1.5 right-1.5 bg-black/70 rounded px-1.5 py-0.5 flex items-center gap-0.5 text-xs text-yellow-400 opacity-0 group-hover:opacity-0">
          <Star className="w-2.5 h-2.5 fill-current" />
          {item.vote_average.toFixed(1)}
        </div>
      )}
    </div>
  );
}
