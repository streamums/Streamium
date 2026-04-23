import { Bookmark, Trash2 } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { MediaCard } from "@/components/MediaCard";
import { getMediaType } from "@/lib/tmdb";

export function Watchlist() {
  const { list, remove } = useWatchlist();

  return (
    <div className="min-h-screen bg-[#09090b] pt-20 px-4">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Bookmark className="w-6 h-6 text-[#e50914]" />
          <h1 className="text-white text-2xl font-bold">My Watchlist</h1>
          {list.length > 0 && (
            <span className="bg-zinc-800 text-zinc-400 text-sm px-2.5 py-0.5 rounded-full">
              {list.length}
            </span>
          )}
        </div>

        {list.length === 0 ? (
          <div className="text-center py-24 text-zinc-500">
            <Bookmark className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg mb-1">Your watchlist is empty</p>
            <p className="text-sm text-zinc-600">
              Click the + button on any title to add it here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {list.map((item) => (
              <div key={item.id} className="group/wl relative">
                <MediaCard item={item} mediaType={getMediaType(item)} />
                <button
                  onClick={() => remove(item.id)}
                  className="absolute top-2 left-2 w-7 h-7 bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover/wl:opacity-100 transition-opacity hover:bg-red-900"
                >
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
