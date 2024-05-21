export type TLCUser = {
  id: string;
  name: string;
};

export type TLCSessionId = string | null;

export type TLCRequestToken = {
  token: string;
  expiresAt: string;
};

// =================== NAVIGATION ====================
export type TPageWiseNavigationActions = {
  moviesDetailPage: 'adding_movie_to_watchlist' | 'adding_movie_to_favorites' | 'none';
  trendingMoviesPage: 'viewing_a_movie' | 'none';
};

export type TNavigationPagesKey = keyof TPageWiseNavigationActions;

export type TNavigateToData = {
  navigateTo: {
    path: string;
  };
};
