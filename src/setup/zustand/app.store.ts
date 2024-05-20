import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchUserFavoritesAndWatchlist } from '@/utils/api.utils';
import { storePersistenceStorageKey } from '@/constants/app.constants';

type TUserState = {
  favorites: number[];
  watchlist: number[];
  toggleFavorite: (movieId: number) => void;
  toggleWatchlist: (movieId: number) => void;
  isInFavorite: (movieId: number) => boolean;
  isInWatchlist: (movieId: number) => boolean;
  removeFromFavorite: (movieId: number) => void;
  removeFromWatchlist: (movieId: number) => void;
  loadFavorites: (movieIds: number[]) => void;
  loadWatchlist: (movieIds: number[]) => void;
  init: () => Promise<void>;
  clearData: () => void;
};

const useAppStore = create<TUserState>()(
  persist(
    (set, get) => ({
      favorites: [],
      watchlist: [],
      toggleFavorite: (movieId) =>
        set((state) => {
          if (state.favorites.includes(movieId)) {
            return { favorites: state.favorites.filter((id) => id !== movieId) };
          }
          return { favorites: [...state.favorites, movieId] };
        }),
      toggleWatchlist: (movieId) =>
        set((state) => {
          if (state.watchlist.includes(movieId)) {
            return { watchlist: state.watchlist.filter((id) => id !== movieId) };
          }
          return { watchlist: [...state.watchlist, movieId] };
        }),
      isInFavorite: (movieId) => get().favorites.includes(movieId),
      isInWatchlist: (movieId) => get().watchlist.includes(movieId),
      removeFromFavorite: (movieId) =>
        set((state) => ({ favorites: state.favorites.filter((id) => id !== movieId) })),
      removeFromWatchlist: (movieId) =>
        set((state) => ({ watchlist: state.watchlist.filter((id) => id !== movieId) })),
      loadFavorites: (movieIds) => set({ favorites: movieIds }),
      loadWatchlist: (movieIds) => set({ watchlist: movieIds }),
      init: async () => {
        try {
          console.log('Initializing app store 🔃');
          const { allFavoriteIds, allWatchlistIds } = await fetchUserFavoritesAndWatchlist();
          set({
            favorites: allFavoriteIds,
            watchlist: allWatchlistIds,
          });
          console.log('app store initialized ✅');
        } catch (error) {
          console.error('💀 Failed to initialize store :', error);
        }
      },
      clearData: () => set({ favorites: [], watchlist: [] }),
    }),
    {
      name: storePersistenceStorageKey.APP_STORE,
    }
  )
);

export default useAppStore;
