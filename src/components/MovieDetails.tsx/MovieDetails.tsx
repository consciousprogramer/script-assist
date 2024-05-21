import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import { Affix, Box, Button, Transition } from '@mantine/core';
import { TbArrowLeft, TbLogin } from 'react-icons/tb';
import { useWindowScroll } from '@mantine/hooks';
import tmdbServices from '@/services/tmdbServices';
import useRedirection from '@/hooks/common/useRedirection';
import useAppStore from '@/setup/store/app.store';
import useUserStore from '@/setup/store/user.store';
import MovieDetailsSkeletonLoader from './MovieDetailsSkeletonLoader';
import useMovieDetails from '@/hooks/MovieDetails/useMovieDetails';
import MovieImages from './MovieImages';
import CastImages from './CastImages';
import MovieDetailsBannerSection from './MovieDetailsBannerSection';
import MovieMetaDataSection from './MovieMetaDataSection';

const MovieDetails = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { movieId: mId } = useParams<{ movieId: string }>();

  if (!mId) {
    throw new Error('Invalid URL movieId missing from the URL of movie details page');
  }

  const movieId = +mId;

  const [scroll] = useWindowScroll();

  const { checkSessionOrAuthenticate, autoExecuteAfterRedirectJob, navigate } =
    useRedirection<'moviesDetailPage'>();

  const { isInFavorite, isInWatchlist } = useAppStore((state) => ({
    isInFavorite: state.isInFavorite,
    isInWatchlist: state.isInWatchlist,
  }));

  const { userAuthedActionHandler } = useMovieDetails({ movieId });

  const isFavoriteMovie = isInFavorite(movieId);
  const isWatchlistMovie = isInWatchlist(movieId);
  const sessionId = useUserStore((state) => state.sessionId);

  const { data, isLoading } = useQuery({
    queryKey: [`movies:${movieId}`],
    queryFn: () => tmdbServices.movies.details(movieId),
    refetchOnMount: false,
  });

  const { data: images } = useQuery({
    queryKey: [`movies:${movieId}:images`],
    queryFn: () => tmdbServices.movies.images(movieId),
    refetchOnMount: false,
  });

  const { data: creditsData } = useQuery({
    queryKey: [`movies:${movieId}:credits`],
    queryFn: () => tmdbServices.movies.credits(movieId),
    refetchOnMount: false,
  });

  const handleAddToFavorites = () =>
    userAuthedActionHandler('adding_movie_to_favorites', isFavoriteMovie, 'favorites');

  const handleAddToWatchlist = () =>
    userAuthedActionHandler('adding_movie_to_watchlist', isWatchlistMovie, 'watchlist');

  useEffect(() => {
    autoExecuteAfterRedirectJob(
      {
        adding_movie_to_favorites: handleAddToFavorites,
        adding_movie_to_watchlist: handleAddToWatchlist,
        none: () => {},
      },
      () => setSearchParams({})
    );
  }, []);

  return (
    <>
      {(!data || isLoading) && <MovieDetailsSkeletonLoader />}
      {data && (
        <Box className="p-2">
          {/* Movie poster and banner */}
          <MovieDetailsBannerSection data={data} />

          {/* Movie details */}
          <MovieMetaDataSection
            data={data}
            handleAddToFavorites={handleAddToFavorites}
            handleAddToWatchlist={handleAddToWatchlist}
            isFavoriteMovie={isFavoriteMovie}
            isWatchlistMovie={isWatchlistMovie}
          />

          {images && <MovieImages images={images} />}

          {creditsData && <CastImages data={creditsData} />}

          {/* Affix */}
          <Affix position={{ top: 20, right: 20 }}>
            <Transition transition="slide-up" mounted={scroll.y >= 0}>
              {(transitionStyles) => (
                <Button
                  style={transitionStyles}
                  color="gray"
                  leftSection={<TbArrowLeft />}
                  onClick={() => {
                    const prevTrendingPage = searchParams.get('prevTrendingPage');
                    if (prevTrendingPage) {
                      navigate(`../trending?page=${prevTrendingPage}`);
                    } else {
                      navigate('../trending');
                    }
                  }}
                >
                  Back
                </Button>
              )}
            </Transition>
          </Affix>

          {sessionId === null && (
            <Affix position={{ top: 20, left: 20 }}>
              <Transition transition="slide-up" mounted={scroll.y >= 0}>
                {(transitionStyles) => (
                  <Button
                    style={transitionStyles}
                    color="green"
                    leftSection={<TbLogin />}
                    onClick={() => checkSessionOrAuthenticate('none')}
                  >
                    Login
                  </Button>
                )}
              </Transition>
            </Affix>
          )}
        </Box>
      )}
    </>
  );
};

export default MovieDetails;
