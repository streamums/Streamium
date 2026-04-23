import { Switch, Route, useLocation } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Home } from "@/pages/Home";
import { Search } from "@/pages/Search";
import { Movies } from "@/pages/Movies";
import { TVShows } from "@/pages/TVShows";
import { MovieDetail } from "@/pages/MovieDetail";
import { TVDetail } from "@/pages/TVDetail";
import { Watch } from "@/pages/Watch";
import { Watchlist } from "@/pages/Watchlist";
import { Genre } from "@/pages/Genre";

export function App() {
  const [loc] = useLocation();
  const isWatchPage = loc.includes("/watch");

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {!isWatchPage && <Navbar />}
      {isWatchPage && (
        <div className="fixed top-0 inset-x-0 z-50 h-14 bg-[#09090b] border-b border-zinc-800" />
      )}
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/search" component={Search} />
        <Route path="/movies" component={Movies} />
        <Route path="/tv" component={TVShows} />
        <Route path="/watchlist" component={Watchlist} />
        <Route path="/genre/movie/:id" component={Genre} />
        <Route path="/genre/tv/:id" component={Genre} />
        <Route path="/movie/:id" component={MovieDetail} />
        <Route path="/tv/:id" component={TVDetail} />
        <Route path="/movie/:id/watch" component={Watch} />
        <Route path="/tv/:id/watch" component={Watch} />
        <Route>
          <div className="min-h-screen flex items-center justify-center text-zinc-500 pt-14">
            <div className="text-center">
              <p className="text-6xl font-bold text-zinc-800 mb-4">404</p>
              <p className="text-zinc-500">Page not found</p>
            </div>
          </div>
        </Route>
      </Switch>
    </div>
  );
}
