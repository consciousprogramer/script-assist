// =================== Get Request Token =================

export type TRequestTokenResponse = {
  success: boolean;
  expires_at: string;
  request_token: string;
};

// =================== Create Session =================
export type TCreateSessionResponse = {
  success: boolean;
  session_id: string;
};

// =================== Add To Favorites =================
export type TAddToFavoritesResponse = {
  success: boolean;
  status_code: number;
  status_message: string;
};

// =================== Add To Watchlist =================
export type TAddToWatchlistResponse = {
  success: boolean;
  status_code: number;
  status_message: string;
};

// =================== Get Favorite Movies =================
export type TFavoriteMoviesResponse = {
  page: number;
  results: TFavoriteMovies[];
  total_pages: number;
  total_results: number;
};

export type TFavoriteMovies = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

// =================== Get Watchlist Movies =================
export type TWatchListMoviesResponse = {
  page: number;
  results: TWatchListMovies[];
  total_pages: number;
  total_results: number;
};

export type TWatchListMovies = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

// =================== Movie Details =================
export type TDiscoverMoviesResponse = {
  page: number;
  results: TDiscoverMovies[];
  total_pages: number;
  total_results: number;
};

export type TDiscoverMovies = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

// TRENDING MOVIES RESPONSE DATA
export type TTrendingMoviesResponse = {
  page: number;
  results: TrendingMovie[];
  total_pages: number;
  total_results: number;
};

export type TrendingMovie = {
  backdrop_path: string;
  id: number;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: MediaType;
  adult: boolean;
  title: string;
  original_language: OriginalLanguage;
  genre_ids: number[];
  popularity: number;
  release_date: Date;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type MediaType = 'movie';

export type OriginalLanguage = 'en' | 'ja' | 'es';

// MOVIES DETAIL RESPONSE DATA
export type TMovieDetailsResponse = {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

export type Genre = {
  id: number;
  name: string;
};

export type ProductionCompany = {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
};

export type ProductionCountry = {
  iso_3166_1: string;
  name: string;
};

export type SpokenLanguage = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

// =================== Movie Images =================

export type TMovieImagesResponse = {
  backdrops: TMovieImages[];
  id: number;
  logos: TMovieImages[];
  posters: TMovieImages[];
};

export type TMovieImages = {
  aspect_ratio: number;
  height: number;
  iso_639_1: null | string;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
};

// =================== Movie Credits =================
export type TMovieCreditsResponse = {
  id: number;
  cast: CreditsPerson[];
  crew: CreditsPerson[];
};

export type CreditsPerson = {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: null | string;
  cast_id?: number;
  character?: string;
  credit_id: string;
  order?: number;
  department?: string;
  job?: string;
};
