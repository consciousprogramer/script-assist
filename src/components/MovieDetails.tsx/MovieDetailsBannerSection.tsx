import { BackgroundImage, Badge, Group, Image } from '@mantine/core';
import React, { useMemo } from 'react';
import { TbClock } from 'react-icons/tb';
import { TMovieDetailsResponse } from '@/types/tmdbApi.types';
import { TBadgesRenderingData } from '@/types/ui.types';
import { tmdbImagePathConstructors } from '@/utils/api.utils';

const MovieDetailsBannerSection = ({ data }: { data: TMovieDetailsResponse }) => {
  const badgesData: TBadgesRenderingData<TMovieDetailsResponse> = useMemo(
    () => [
      {
        key: 'release_date',
        value: data.release_date,
        props: {
          color: 'gray',
          variant: 'light',
        },
      },
      {
        key: 'runtime',
        value: `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`,
        props: {
          color: 'gray',
          variant: 'light',
          leftSection: <TbClock className="" />,
        },
      },
    ],
    [data]
  );
  return (
    <div className="w-full h-[500px] relative">
      <BackgroundImage
        className="w-full h-full relative"
        src={tmdbImagePathConstructors.backdropImagePaths.original(data.backdrop_path)}
      />
      <div className="absolute bottom-0 left-0 translate-x-1/3 translate-y-1/2 w-48 aspect-[2/3] z-10">
        <Image
          className="w-full h-full"
          radius="md"
          src={tmdbImagePathConstructors.postImagePaths.w500(data.poster_path)}
        />
        <Group className="mt-3" justify="center">
          {badgesData.map(({ key, value, props }) => (
            <Badge key={key} {...props}>
              {value}
            </Badge>
          ))}
        </Group>
      </div>
      <div className="h-full bg-gradient-to-t from-black/50 to-black/5 absolute inset-0"></div>
    </div>
  );
};

export default MovieDetailsBannerSection;
