import React, { Suspense } from 'react';
import TrendingPageFallback from '@/components/Trending/Trending.fallback';
import Trending from '@/components/Trending/Trending';

const TrendingPage = () => (
  <Suspense fallback={<TrendingPageFallback />}>
    <Trending />
  </Suspense>
);
export default TrendingPage;
