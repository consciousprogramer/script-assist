import { Image } from '@mantine/core';
import React from 'react';
import tmdbApiConstants from '@/constants/tmdbApi.constants';
import { TMovieImagesResponse } from '@/types/tmdbApi.types';
import SimpleImagesGallery from '../common/SimpleImagesGallery';

const MovieImages = ({ images }: { images: TMovieImagesResponse }) => (
  <SimpleImagesGallery
    title="Movie Images"
    data={images.backdrops}
    renderer={(item) => (
      <Image
        key={item.file_path}
        src={tmdbApiConstants.w500Image(item.file_path)}
        radius="md"
        className="w-52"
      />
    )}
  />
);

export default MovieImages;
