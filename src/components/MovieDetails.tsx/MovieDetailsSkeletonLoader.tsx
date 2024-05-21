import { Box, Group } from '@mantine/core';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const MovieDetailsSkeletonLoader = () => (
  <SkeletonTheme baseColor="#202020" highlightColor="#444">
    <Box className="p-2">
      <div className="w-full h-96 relative">
        <Skeleton className="w-full h-full" />
        <div className="absolute bottom-0 left-0 translate-x-1/3 translate-y-1/2 w-48 aspect-[2/3]">
          <Skeleton className="w-full h-full" />
        </div>
      </div>
      <div className="flex items-center gap-x-6 mt-3">
        <div className="w-64 flex-grow-0"></div>
        <div className="flex-grow flex flex-col gap-y-2">
          <Skeleton className="w-1/2 h-10" />
          <Group gap="md">
            <Skeleton className="w-24 h-5 rounded-full" />
            <Skeleton className="w-24 h-5 rounded-full" />
            <Skeleton className="w-24 h-5 rounded-full" />
          </Group>
          <Skeleton className="w-full h-20" />
        </div>
      </div>
      <div className="mt-12 px-2">
        <Skeleton className="w-1/6 h-8" />
        <div className="flex justify-start items-center py-4 gap-x-3 overflow-x-auto no-scrollbar">
          {/* eslint-disable-next-line @typescript-eslint/no-shadow */}
          {new Array(Math.ceil(window.innerWidth / 208)).fill(0).map((_, index) => (
            <Skeleton key={index} className="w-52 h-32" />
          ))}
        </div>
      </div>
    </Box>
  </SkeletonTheme>
);

export default MovieDetailsSkeletonLoader;
