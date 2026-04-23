import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, Bookmark, Home, Tv, Film, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { MOVIE_GENRES, TV_GENRES } from "@/lib/constants";

export function Navbar() {
  const [loc, navigate] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [movieGenreOpen, setMovieGenreOpen] = useState(false);
  const [tvGenreOpen, setTvGenreOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setMovieGenreOpen(false);
    setTvGenreOpen(false);
    setMobileOpen(false);
  }, [loc]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  const isActive = (path: string) =>
    loc === path || loc.startsWith(path + "/") || loc.startsWith(path + "?");

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800"
          : "bg-gradient-to-b from-black/80 to-transparent"
      )}
    >
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center gap-2">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="text-[#e50914] font-bold text-xl tracking-tight shrink-0 mr-3"
        >
          STREAMIUM
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          <button
            onClick={() => navigate("/")}
            className={cn(
              "px-3 py-1.5 rounded text-sm font-medium transition-colors",
              isActive("/") && loc === "/" ? "text-white" : "text-zinc-400 hover:text-white"
            )}
          >
            Home
          </button>

          {/* Movies dropdown */}
          <div className="relative">
            <button
              onClick={() => { setMovieGenreOpen((o) => !o); setTvGenreOpen(false); }}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors",
                isActive("/movies") || isActive("/genre/movie")
                  ? "text-white"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              Movies <ChevronDown className={cn("w-3 h-3 transition-transform", movieGenreOpen && "rotate-180")} />
            </button>
            {movieGenreOpen && (
              <div className="absolute top-full left-0 mt-1 bg-zinc-900/98 border border-zinc-700 rounded-lg shadow-2xl w-48 py-1 backdrop-blur-md">
                <button
                  onClick={() => { navigate("/movies"); setMovieGenreOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  All Movies
                </button>
                <div className="border-t border-zinc-800 my-1" />
                {MOVIE_GENRES.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => { navigate(`/genre/movie/${g.id}`); setMovieGenreOpen(false); }}
                    className="w-full text-left px-4 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* TV dropdown */}
          <div className="relative">
            <button
              onClick={() => { setTvGenreOpen((o) => !o); setMovieGenreOpen(false); }}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors",
                isActive("/tv") || isActive("/genre/tv")
                  ? "text-white"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              TV Shows <ChevronDown className={cn("w-3 h-3 transition-transform", tvGenreOpen && "rotate-180")} />
            </button>
            {tvGenreOpen && (
              <div className="absolute top-full left-0 mt-1 bg-zinc-900/98 border border-zinc-700 rounded-lg shadow-2xl w-52 py-1 backdrop-blur-md">
                <button
                  onClick={() => { navigate("/tv"); setTvGenreOpen(false); }}
                  className="w-full text-left px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  All TV Shows
                </button>
                <div className="border-t border-zinc-800 my-1" />
                {TV_GENRES.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => { navigate(`/genre/tv/${g.id}`); setTvGenreOpen(false); }}
                    className="w-full text-left px-4 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/watchlist")}
            className={cn(
              "px-3 py-1.5 rounded text-sm font-medium transition-colors",
              isActive("/watchlist") ? "text-white" : "text-zinc-400 hover:text-white"
            )}
          >
            Watchlist
          </button>
        </div>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 ml-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, TV..."
              className="bg-zinc-800/60 border border-zinc-700 rounded-md pl-8 pr-3 py-1.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 w-48 transition-all focus:w-64"
            />
          </div>
        </form>

        {/* Mobile toggle */}
        <button
          className="md:hidden ml-auto text-zinc-300 hover:text-white"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#09090b]/98 border-b border-zinc-800 px-4 pb-4 pt-2 flex flex-col gap-1">
          <form onSubmit={handleSearch} className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, TV..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md pl-9 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
            />
          </form>
          {[
            { href: "/", label: "Home", icon: Home },
            { href: "/movies", label: "Movies", icon: Film },
            { href: "/tv", label: "TV Shows", icon: Tv },
            { href: "/watchlist", label: "Watchlist", icon: Bookmark },
          ].map(({ href, label, icon: Icon }) => (
            <button
              key={href}
              onClick={() => navigate(href)}
              className="flex items-center gap-3 px-3 py-2 rounded text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-colors"
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
          <div className="border-t border-zinc-800 mt-1 pt-2">
            <p className="text-zinc-600 text-xs px-3 mb-1">Movie Genres</p>
            <div className="flex flex-wrap gap-1.5 px-3">
              {MOVIE_GENRES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => navigate(`/genre/movie/${g.id}`)}
                  className="text-xs text-zinc-400 border border-zinc-700 rounded-full px-2.5 py-1 hover:text-white hover:border-zinc-500 transition-colors"
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <p className="text-zinc-600 text-xs px-3 mb-1">TV Genres</p>
            <div className="flex flex-wrap gap-1.5 px-3">
              {TV_GENRES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => navigate(`/genre/tv/${g.id}`)}
                  className="text-xs text-zinc-400 border border-zinc-700 rounded-full px-2.5 py-1 hover:text-white hover:border-zinc-500 transition-colors"
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
