import { Image } from '@mantine/core';
import React from 'react';
import { TMovieImagesResponse } from '@/types/tmdbApi.types';
import SimpleImagesGallery from '../common/SimpleImagesGallery';
import { tmdbImagePathConstructors } from '@/utils/api.utils';

const MovieImages = ({ images }: { images: TMovieImagesResponse }) => (
  <SimpleImagesGallery
    title="Movie Images"
    data={images.backdrops}
    renderer={(item) => (
      <Image
        key={item.file_path}
        src={tmdbImagePathConstructors.stillImagePaths.w300(item.file_path)}
        radius="md"
        className="w-52"
      />
    )}
  />
);

export default MovieImages;
