import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MediaCard } from "./MediaCard";
import type { Media, MediaType } from "@/lib/tmdb";

interface MediaRowProps {
  title: string;
  items: Media[];
  mediaType?: MediaType;
}

export function MediaRow({ title, items, mediaType }: MediaRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({ left: dir === "right" ? 600 : -600, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <section className="mb-8">
      <h2 className="text-white font-semibold text-lg mb-3 px-4 md:px-0">{title}</h2>
      <div className="relative group/row">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-[#09090b]/80 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Scroll container */}
        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto no-scrollbar px-4 md:px-0 pb-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="shrink-0 w-36 md:w-40"
              style={{ scrollSnapAlign: "start" }}
            >
              <MediaCard item={item} mediaType={mediaType} />
            </div>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-[#09090b]/80 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </section>
  );
}
