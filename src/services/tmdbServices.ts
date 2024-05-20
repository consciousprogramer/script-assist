import {
  TAddToFavoritesResponse,
  TAddToWatchlistResponse,
  TCreateSessionResponse,
  TDiscoverMoviesResponse,
  TFavoriteMoviesResponse,
  TMovieCreditsResponse,
  TMovieDetailsResponse,
  TMovieImagesResponse,
  TRequestTokenResponse,
  TTrendingMoviesResponse,
  TWatchListMoviesResponse,
} from '../types/tmdbApi.types';
import { tmdbAxios } from '../setup/axios/axios.setup';
import tmdbApiConstants from '@/constants/tmdbApi.constants';

const tmdbServices = {
  constructUrl: {
    tmdbAuthUrl: (requestToken: string) =>
      new URL(`https://www.themoviedb.org/authenticate/${requestToken}`),
  },
  authentication: {
    getRequestToken: async () => {
      const { data } = await tmdbAxios.get<TRequestTokenResponse>('authentication/token/new');
      return data;
    },
    createSession: async (requestToken: string) => {
      const { data } = await tmdbAxios.post<TCreateSessionResponse>('/authentication/session/new', {
        request_token: requestToken,
      });
      return data;
    },
  },
  user: {
    addToFavorites: async (movieId: number | string, value: boolean) => {
      const { data } = await tmdbAxios.post<TAddToFavoritesResponse>(
        `/account/${tmdbApiConstants.accountId}/favorite`,
        {
          media_type: 'movie',
          media_id: movieId,
          favorite: value,
        }
      );
      return data;
    },
    addToWatchlist: async (movieId: number | string, value: boolean) => {
      const { data } = await tmdbAxios.post<TAddToWatchlistResponse>(
        `/account/${tmdbApiConstants.accountId}/watchlist`,
        {
          media_type: 'movie',
          media_id: movieId,
          watchlist: value,
        }
      );
      return data;
    },
    loadFavorites: async (page: number) => {
      const { data } = await tmdbAxios.get<TFavoriteMoviesResponse>(
        `/account/${tmdbApiConstants.accountId}/favorite/movies`,
        {
          params: {
            page,
          },
        }
      );
      return data;
    },
    loadWatchlist: async (page: number) => {
      const { data } = await tmdbAxios.get<TWatchListMoviesResponse>(
        `/account/${tmdbApiConstants.accountId}/watchlist/movies`,
        {
          params: {
            page,
          },
        }
      );
      return data;
    },
  },
  movies: {
    discover: async (searchParams: Record<string, string | number>) => {
      const { data } = await tmdbAxios.get<TDiscoverMoviesResponse>('/discover/movie', {
        params: {
          ...searchParams,
        },
      });
      return data;
    },
    details: async (movieId: number | string) => {
      const { data } = await tmdbAxios.get<TMovieDetailsResponse>(`/movie/${movieId}`);
      return data;
    },
    images: async (movieId: number | string) => {
      const { data } = await tmdbAxios.get<TMovieImagesResponse>(`/movie/${movieId}/images`);
      return data;
    },
    credits: async (movieId: number | string) => {
      const { data } = await tmdbAxios.get<TMovieCreditsResponse>(`/movie/${movieId}/credits`);
      return data;
    },
    trending: async (
      window: 'day' | 'week',
      paginationParams: {
        page: number;
      }
    ) => {
      const { data } = await tmdbAxios.get<TTrendingMoviesResponse>(`/trending/movie/${window}`, {
        params: paginationParams,
      });
      return data;
    },
  },
};

export default tmdbServices;
