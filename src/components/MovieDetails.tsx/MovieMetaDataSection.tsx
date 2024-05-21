import { Badge, Group, Text } from '@mantine/core';
import React, { useMemo } from 'react';
import {
  TbBulbFilled,
  TbHeart,
  TbHeartFilled,
  TbLanguage,
  TbPlaylist,
  TbPlaylistAdd,
  TbStarFilled,
} from 'react-icons/tb';
import { TMovieDetailsResponse } from '@/types/tmdbApi.types';
import { TBadgesRenderingData } from '@/types/ui.types';
import MovieActionIcons from '../common/MovieActionIcons';

const MovieMetaDataSection = ({
  data,
  handleAddToFavorites,
  handleAddToWatchlist,
  isFavoriteMovie,
  isWatchlistMovie,
}: {
  data: TMovieDetailsResponse;
  isFavoriteMovie: boolean;
  isWatchlistMovie: boolean;
  handleAddToFavorites: () => void | Promise<void>;
  handleAddToWatchlist: () => void | Promise<void>;
}) => {
  const badgesData: TBadgesRenderingData<TMovieDetailsResponse> = useMemo(
    () => [
      {
        key: 'vote_average',
        value: `${data.vote_average.toFixed(1)} (${data.vote_count} votes)`,
        props: {
          color: 'yellow',
          variant: 'light',
          leftSection: <TbStarFilled />,
        },
      },
      {
        key: 'genres',
        value: data.genres.map((genre) => genre.name).join(' • '),
        props: {
          color: 'lime',
          variant: 'light',
          leftSection: <TbBulbFilled />,
        },
      },
      {
        key: 'original_language',
        value: data.original_language,
        props: {
          color: 'gray',
          leftSection: <TbLanguage />,
        },
      },
    ],
    [data]
  );
  return (
    <div className="flex items-center gap-x-6 m-3">
      <div className="w-64 flex-shrink-0"></div>
      <div className="flex-grow text-4xl font-semibold">
        <div className="font-montserrat">
          {data.title} ({new Date(data.release_date).getFullYear()})
        </div>
        <Group justify="start" gap="sm" mt={12}>
          {badgesData.map(({ key, value, props }) => (
            <Badge key={key} {...props}>
              {value}
            </Badge>
          ))}

          <MovieActionIcons
            flag={isFavoriteMovie}
            whenPresent={{
              icon: <TbHeartFilled />,
              msg: 'Remove to favorites',
              color: 'green',
            }}
            whenAbsent={{ icon: <TbHeart />, msg: 'Add to favorites', color: 'red' }}
            onClick={handleAddToFavorites}
          />

          <MovieActionIcons
            flag={isWatchlistMovie}
            whenPresent={{ icon: <TbPlaylist />, msg: 'Remove to watchlist', color: 'green' }}
            whenAbsent={{ icon: <TbPlaylistAdd />, msg: 'Add to watchlist', color: 'red' }}
            onClick={handleAddToWatchlist}
          />
        </Group>
        <Text mt={12} fw={300} className="font-roboto">
          {data.overview}
        </Text>
      </div>
    </div>
  );
};

export default MovieMetaDataSection;
