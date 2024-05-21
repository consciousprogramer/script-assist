import { useCallback } from 'react';
import _ from 'lodash';
import toast from 'react-hot-toast';
import { TPageWiseNavigationActions } from '@/types/data.types';
import useRedirection from '../common/useRedirection';
import tmdbServices from '@/services/tmdbServices';
import useAppStore from '@/setup/store/app.store';

const useMovieDetails = ({ movieId }: { movieId: number }) => {
  const { checkSessionOrAuthenticate } = useRedirection<'moviesDetailPage'>();

  const { toggleFavorite, toggleWatchlist } = useAppStore((state) => ({
    toggleFavorite: state.toggleFavorite,
    toggleWatchlist: state.toggleWatchlist,
  }));

  const generateActionToastMessages = useCallback(
    (status: boolean, resource: 'favorites' | 'watchlist') => ({
      loading: status ? `Removing from ${resource}` : `Adding to ${resource}`,
      success: status ? `Removed from ${resource}` : `Added to ${resource}`,
      error: status ? `Failed to remove from ${resource}` : `Failed to add to ${resource}`,
    }),
    []
  );

  const userAuthedActionHandler = _.throttle(
    async (
      action: TPageWiseNavigationActions['moviesDetailPage'],
      status: boolean,
      resource: 'favorites' | 'watchlist'
    ) => {
      if (!checkSessionOrAuthenticate(action)) {
        return;
      }

      if (resource === 'favorites') {
        const { success } = await toast.promise(
          tmdbServices.user.addToFavorites(movieId, !status),
          generateActionToastMessages(status, resource)
        );

        if (success) toggleFavorite(movieId);
      } else if (resource === 'watchlist') {
        const { success } = await toast.promise(
          tmdbServices.user.addToWatchlist(movieId, !status),
          generateActionToastMessages(status, resource)
        );

        if (success) toggleWatchlist(movieId);
      }
    },
    1_000
  );

  return {
    userAuthedActionHandler,
  };
};

export default useMovieDetails;
