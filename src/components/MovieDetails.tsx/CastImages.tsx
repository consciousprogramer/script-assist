import { BackgroundImage, Text } from '@mantine/core';
import React from 'react';
import SimpleImagesGallery from '../common/SimpleImagesGallery';
import { CreditsPerson, TMovieCreditsResponse } from '@/types/tmdbApi.types';
import { tmdbImagePathConstructors } from '@/utils/api.utils';

const CastImage = ({ cast }: { cast: CreditsPerson }) => (
  <BackgroundImage
    key={cast.id}
    src={tmdbImagePathConstructors.profileImagePaths.h632(cast.profile_path!)}
    className="w-32 relative aspect-[2/3] flex-shrink-0 group z-20 rounded-md"
  >
    <div className="absolute inset-0 group-hover:bg-black/50 z-0 transition-colors rounded-md"></div>
    <div className="absolute inset-0 flex items-end justify-start p-1.5 z-10">
      <Text className="font-roboto text-sm font-light text-white group-hover:font-medium">
        {cast.name}
      </Text>
    </div>
  </BackgroundImage>
);

const CastImages = ({ data }: { data: TMovieCreditsResponse }) => (
  <SimpleImagesGallery
    title="Cast Images"
    data={data.cast}
    renderer={(cast) => <CastImage key={cast.id} cast={cast} />}
  />
);

export default CastImages;
