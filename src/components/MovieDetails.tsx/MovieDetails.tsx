import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useSearchParams } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import {
  ActionIcon,
  BackgroundImage,
  Badge,
  Box,
  Card,
  Group,
  Image,
  // JsonInput,
  Text,
  Tooltip,
} from '@mantine/core';
import {
  TbStarFilled,
  TbClock,
  TbBulbFilled,
  TbPlaylistAdd,
  TbRating18Plus,
  TbHeart,
  TbHeartFilled,
  TbPlaylist,
} from 'react-icons/tb';
import toast from 'react-hot-toast';
import _ from 'lodash';
import tmdbServices from '@/services/tmdbServices';
import tmdbApiConstants from '@/constants/tmdbApi.constants';
import useRedirection from '@/hooks/useRedirection';
import { TPageWiseNavigationActions } from '@/types/data.types';
import useAppStore from '@/setup/zustand/app.store';

const MovieDetailsLoader = () => (
  <Box className="p-2">
    <div className="w-full h-96 relative">
      <Skeleton className="w-full h-full" />
      <div className="absolute bottom-0 left-0 translate-x-1/3 translate-y-1/2 w-48 aspect-[2/3]">
        <Skeleton className="w-full h-full" />
      </div>
    </div>
    <div className="flex items-center gap-x-6 mt-11">
      <div className="w-64 flex-grow-0"></div>
      <div className="flex-grow h-14">
        <Skeleton className="w-full h-full" />
      </div>
    </div>
    <div className="flex-grow h-14 mt-16">
      <Skeleton className="w-full h-full" />
    </div>
  </Box>
);

const MovieDetails = () => {
  const { checkSessionOrAuthenticate, location } = useRedirection<'moviesDetailPage'>();

  const { movieId } = useParams<{ movieId: string }>();

  const [, setSearchParams] = useSearchParams();

  const { toggleFavorite, toggleWatchlist, isInFavorite, isInWatchlist } = useAppStore((state) => ({
    isInFavorite: state.isInFavorite,
    toggleFavorite: state.toggleFavorite,
    isInWatchlist: state.isInWatchlist,
    toggleWatchlist: state.toggleWatchlist,
  }));

  const isFavoriteMovie = isInFavorite(+movieId!);
  const isWatchlistMovie = isInWatchlist(+movieId!);

  const { data, isLoading } = useQuery({
    queryKey: [`movies:${movieId}`],
    queryFn: () => tmdbServices.movies.details(movieId!),
    refetchOnMount: false,
  });

  const { data: images } = useQuery({
    queryKey: [`movies:${movieId}:images`],
    queryFn: () => tmdbServices.movies.images(movieId!),
    refetchOnMount: false,
  });

  const { data: creditsData } = useQuery({
    queryKey: [`movies:${movieId}:credits`],
    queryFn: () => tmdbServices.movies.credits(movieId!),
    refetchOnMount: false,
  });

  const handleAddToFavorites = _.throttle(async () => {
    if (checkSessionOrAuthenticate('adding_movie_to_favorites')) {
      const { success } = await toast.promise(
        tmdbServices.user.addToFavorites(movieId!, !isFavoriteMovie),
        {
          loading: isFavoriteMovie ? 'Removing from favorites' : 'Adding to favorites',
          success: isFavoriteMovie ? 'Removed from favorites' : 'Added to favorites',
          error: isFavoriteMovie ? 'Failed to remove from favorites' : 'Failed to add to favorites',
        }
      );

      if (success) toggleFavorite(+movieId!);
    }
  }, 1_000);

  const handleAddToWatchlist = _.throttle(async () => {
    if (checkSessionOrAuthenticate('adding_movie_to_watchlist')) {
      const { success } = await toast.promise(
        tmdbServices.user.addToWatchlist(movieId!, !isWatchlistMovie),
        {
          loading: isWatchlistMovie ? 'Removing from watchlist' : 'Adding to watchlist',
          success: isWatchlistMovie ? 'Removed from watchlist' : 'Added to watchlist',
          error: isWatchlistMovie
            ? 'Failed to remove from watchlist'
            : 'Failed to add to watchlist',
        }
      );

      if (success) toggleWatchlist(+movieId!);
    }
  }, 1_000);

  useEffect(() => {
    (async () => {
      const pageSearchParams = new URLSearchParams(location.search);

      const isPendingRedirect = pageSearchParams.get('isPendingRedirect');
      if (isPendingRedirect === 'false') return;

      const action = pageSearchParams.get(
        'action'
      ) as TPageWiseNavigationActions['moviesDetailPage'];

      if (action === 'adding_movie_to_favorites') {
        await handleAddToFavorites();
        setSearchParams({});
      } else if (action === 'adding_movie_to_watchlist') {
        await handleAddToWatchlist();
        setSearchParams({});
      }
    })();
  }, []);

  return (
    <SkeletonTheme baseColor="#202020" highlightColor="#444">
      {isLoading && <MovieDetailsLoader />}
      {data && (
        <Box className="p-2">
          {/* Movie poster and banner */}
          <div className="w-full h-[500px] relative">
            <BackgroundImage
              className="w-full h-full relative"
              src={tmdbApiConstants.originalImage(data.backdrop_path)}
            />
            <div className="absolute bottom-0 left-0 translate-x-1/3 translate-y-1/2 w-48 aspect-[2/3] z-10">
              <Image
                className="w-full h-full"
                radius="md"
                src={tmdbApiConstants.w500Image(data.poster_path)}
              />
              <Group className="mt-3" justify="center">
                <Badge size="md" radius="sm" color="gray" variant="light">
                  {data.release_date}
                </Badge>
                <Badge
                  size="md"
                  color="gray"
                  variant="light"
                  leftSection={<TbClock className="" />}
                >
                  {Math.floor(data.runtime / 60)}h {data.runtime % 60}m
                </Badge>
              </Group>
            </div>
            <div className="h-full bg-gradient-to-t from-black/50 to-black/5 absolute inset-0"></div>
          </div>

          {/* Movie details */}
          <div className="flex items-center gap-x-6 m-3">
            <div className="w-64 flex-shrink-0"></div>
            <div className="flex-grow text-4xl font-semibold">
              <div className="font-montserrat">
                {data.title} ({new Date(data.release_date).getFullYear()})
              </div>
              {/* <div className="flex items-center justify-start mt-2 gap-x-2"></div> */}
              <Group justify="start" gap="sm" mt={12}>
                <Badge color="yellow" variant="light" size="sm" leftSection={<TbStarFilled />}>
                  Rating {data.vote_average.toFixed(1)} ({data.vote_count} votes)
                </Badge>
                <Badge color="lime" variant="light" size="sm" leftSection={<TbBulbFilled />}>
                  {data.genres.map((genre) => genre.name).join(' • ')}
                </Badge>

                {data.adult && (
                  <Badge
                    leftSection={
                      <ActionIcon variant="subtle" color="white" size="sm">
                        <TbRating18Plus />
                      </ActionIcon>
                    }
                    color="red"
                    variant="filled"
                    size="sm"
                  >
                    Adult
                  </Badge>
                )}
                <Badge size="xs" radius="xs" color="gray">
                  {data.original_language}
                </Badge>

                {/* Actions */}
                <Tooltip
                  label={isFavoriteMovie ? 'Remove from favorites' : 'Add to favorites'}
                  withArrow
                  position="top-end"
                >
                  <ActionIcon variant="light" color="red" size="sm" onClick={handleAddToFavorites}>
                    {isFavoriteMovie ? <TbHeartFilled /> : <TbHeart />}
                  </ActionIcon>
                </Tooltip>

                <Tooltip
                  label={isWatchlistMovie ? 'Remove from watchlist' : 'Add to watchlist'}
                  withArrow
                  position="top-end"
                >
                  <ActionIcon variant="light" color="lime" size="sm" onClick={handleAddToWatchlist}>
                    {isWatchlistMovie ? <TbPlaylist /> : <TbPlaylistAdd />}
                  </ActionIcon>
                </Tooltip>
              </Group>
              <Text mt={12} fw={300} className="font-roboto">
                {data.overview}
              </Text>
            </div>
          </div>

          {/* Movie Images */}
          <Card className="my-8" radius="md">
            <Text component="h3" className="font-montserrat text-xl font-semibold">
              Images
            </Text>
            {images && (
              <Box className="w-full flex justify-start items-center py-4 gap-x-3 overflow-x-auto no-scrollbar">
                {images.backdrops.map((item) => (
                  <Image
                    key={item.file_path}
                    src={tmdbApiConstants.w500Image(item.file_path)}
                    radius="md"
                    className="w-52"
                  />
                ))}
              </Box>
            )}
          </Card>

          {/* Cast Images */}
          <Card className="my-8" radius="md">
            <Text component="h3" className="font-montserrat text-xl font-semibold">
              Cast
            </Text>
            <div className="flex justify-start items-center flex-nowrap gap-x-3 py-4 w-full overflow-x-scroll no-scrollbar">
              {creditsData &&
                creditsData.cast.map((cast) => (
                  <BackgroundImage
                    key={cast.id}
                    src={tmdbApiConstants.w300Image(cast.profile_path!)}
                    className="w-32 relative aspect-[2/3] flex-shrink-0 group z-20 rounded-md"
                  >
                    <div className="absolute inset-0 group-hover:bg-black/50 z-0 transition-colors rounded-md"></div>
                    <div className="absolute inset-0 flex items-end justify-start p-1.5 z-10">
                      <Text className="font-roboto text-sm font-light text-white group-hover:font-medium">
                        {cast.name}
                      </Text>
                    </div>
                  </BackgroundImage>
                ))}
            </div>
          </Card>
        </Box>
      )}
    </SkeletonTheme>
  );
};

export default MovieDetails;
