import { Loader, LoadingOverlay } from '@mantine/core';
import React from 'react';

const MyLoader = () => (
  <div className="flex flex-col items-center justify-center">
    <Loader size="xl" color="cyan" type="oval" />
    <p className="mt-4 text-cyan-500 text-xl font-medium px-2 py-0.5 rounded bg-cyan-400/10">
      Loading Trending Movies...
    </p>
  </div>
);

const TrendingPageFallback = () => (
  <div className="relative w-full h-screen">
    <LoadingOverlay
      visible
      zIndex={1000}
      overlayProps={{ radius: 'sm', blur: 2 }}
      loaderProps={{ children: <MyLoader /> }}
      className="w-full h-full"
    />
  </div>
);

export default TrendingPageFallback;
