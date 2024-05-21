import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { useRef } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import TrendingPage from '../../pages/Trending.page';
import MovieDetails from '../../components/MovieDetails.tsx/MovieDetails';
import TmdbAuthPage from '@/pages/TmdbAuth.page';
import useAppStore from '../store/app.store';
import useMyLocalStorage from '@/hooks/common/useMyLocalStorage';

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        path: '',
        element: <Navigate to="/movies/trending" />,
      },
      {
        path: 'movies',
        children: [
          {
            path: 'trending',
            element: <TrendingPage />,
          },
          {
            path: ':movieId',
            element: <MovieDetails />,
          },
        ],
      },
      {
        path: 'auth',
        children: [
          {
            path: 'tmdb',
            children: [
              {
                path: 'user',
                element: <TmdbAuthPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export function Router() {
  const storeInit = useAppStore((state) => state.init);
  const { getLocalStorage } = useMyLocalStorage();

  const userStoreData = getLocalStorage('userStoreData');

  const isEnabledRef = useRef(!!(userStoreData && userStoreData.state.sessionId !== null));

  useSuspenseQuery({
    queryKey: ['store:init'],
    queryFn: async () => {
      if (!isEnabledRef.current) {
        return 'dry';
      }
      await storeInit();
      isEnabledRef.current = false;
      return 'success';
    },
  });
  return <RouterProvider router={router} />;
}
