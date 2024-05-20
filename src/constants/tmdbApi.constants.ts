const tmdbApiConstants = {
  baseUrl: 'https://api.themoviedb.org/3',
  apiKey: 'ed73c56f8a7227e3bb6f82da54e5c7e7',
  accountId: 9665025,
  authToken:
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZDczYzU2ZjhhNzIyN2UzYmI2ZjgyZGE1NGU1YzdlNyIsInN1YiI6IjVmNjFkNzljMTU2Y2M3MDAzNmRmNGVlZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nzo5C8jtlNHmk3psYbRhszawUhc4WukTNMvh3wRXrUk',
  originalImage: (imgPath: string) => `https://image.tmdb.org/t/p/original/${imgPath}`,
  w500Image: (imgPath: string) => `https://image.tmdb.org/t/p/w500/${imgPath}`,
  w300Image: (imgPath: string) => `https://image.tmdb.org/t/p/w300/${imgPath}`,
};

export default tmdbApiConstants;
