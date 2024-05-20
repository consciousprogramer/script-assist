import tmdbServices from '@/services/tmdbServices';
import { TFavoriteMoviesResponse, TWatchListMoviesResponse } from '@/types/tmdbApi.types';

export const fetchUserFavoritesAndWatchlist = async () => {
  const [userFavorites, userWatchlist] = await Promise.all([
    tmdbServices.user.loadFavorites(1),
    tmdbServices.user.loadWatchlist(1),
  ]);

  const allFavoriteIds = userFavorites.results.map((movie) => movie.id);
  const allWatchlistIds = userWatchlist.results.map((movie) => movie.id);

  const tmdbApiIterator = {
    totalFavoritePages: userFavorites.total_pages,
    totalWatchlistPages: userWatchlist.total_pages,
    currentFavoritesPage: 2,
    currentWatchlistPage: 2,
    hasFavoritesNextPage: true,
    hasWatchlistNextPage: true,
    [Symbol.asyncIterator]: async function* loader() {
      while (this.hasFavoritesNextPage || this.hasWatchlistNextPage) {
        const requestPrs: Promise<
          | { forReq: 'favorites'; data: TFavoriteMoviesResponse }
          | { forReq: 'watchlist'; data: TWatchListMoviesResponse }
        >[] = [];

        if (this.hasFavoritesNextPage) {
          requestPrs.push(
            tmdbServices.user.loadFavorites(this.currentFavoritesPage).then((data) => ({
              forReq: 'favorites',
              data,
            }))
          );
        }

        if (this.hasWatchlistNextPage) {
          requestPrs.push(
            tmdbServices.user.loadWatchlist(this.currentWatchlistPage).then((data) => ({
              forReq: 'watchlist',
              data,
            }))
          );
        }

        const result = await Promise.all(requestPrs);
        const favoritesData = result.find((item) => item.forReq === 'favorites');
        const watchlistData = result.find((item) => item.forReq === 'watchlist');

        if (favoritesData) {
          const { data } = favoritesData;
          this.totalFavoritePages = data.total_pages;
          this.hasFavoritesNextPage = data.page < data.total_pages;
          this.currentFavoritesPage += 1;
        }

        if (watchlistData) {
          const { data } = watchlistData;
          this.totalWatchlistPages = data.total_pages;
          this.hasWatchlistNextPage = data.page < data.total_pages;
          this.currentWatchlistPage += 1;
        }

        yield {
          favoritesData: favoritesData?.data.results,
          watchlistData: watchlistData?.data.results,
        };
      }
    },
  };

  if (userFavorites.total_pages > 1 || userWatchlist.total_pages > 1) {
    for await (const responses of tmdbApiIterator) {
      if (responses.favoritesData && Array.isArray(responses.favoritesData)) {
        allFavoriteIds.push(...responses.favoritesData.map((movie) => movie.id));
      }
      if (responses.watchlistData && Array.isArray(responses.watchlistData)) {
        allWatchlistIds.push(...responses.watchlistData.map((movie) => movie.id));
      }
    }
  }

  return {
    allFavoriteIds,
    allWatchlistIds,
  };
};
