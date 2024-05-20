/* eslint-disable object-shorthand */
/* eslint-disable react/no-this-in-sfc */
import { Loader, Paper, Stack, Text } from '@mantine/core';
import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { TbCheck } from 'react-icons/tb';
import useMyLocalStorage from '@/hooks/useMyLocalStorage';
import tmdbServices from '@/services/tmdbServices';
import useUserStore from '@/setup/zustand/user.store';
import useRedirection from '@/hooks/useRedirection';
import useAppStore from '@/setup/zustand/app.store';
import { fetchUserFavoritesAndWatchlist } from '@/utils/api.utils';

const TmdbAuthPage = () => {
  const [searchParams] = useSearchParams();

  const { checkAndExecutePendingRedirect } = useRedirection();

  const tmdbAuthResult = searchParams.get('approved');

  const { setSessionId, sessionId } = useUserStore();
  const { loadFavorites, loadWatchlist } = useAppStore();

  const { setLocalStorage, clearLocalStorageKey } = useMyLocalStorage();

  const startTMDBAuthProcess = async () => {
    // check if already having valid token
    if (sessionId) {
      return {
        success: true,
        message: 'Already authenticated with TMDB',
        action: 'proceedWithRequest',
      };
    }

    // fetch a request token
    const { request_token, expires_at, success } =
      await tmdbServices.authentication.getRequestToken();

    if (!success || !request_token) {
      throw new Error('Failed to authenticate with TMDB Services, Please retry');
    }

    setLocalStorage('requestToken', { token: request_token, expiresAt: expires_at });

    const authUrl = tmdbServices.constructUrl.tmdbAuthUrl(request_token);

    const redirectUrl = new URL('/auth/tmdb/user', window.location.origin);

    // redirectUrl.searchParams.set('tmdbAuthResult', 'success');
    // redirectUrl.searchParams.set('request_token', request_token);

    authUrl.searchParams.set('redirect_to', redirectUrl.toString());

    window.open(authUrl, '_parent');

    return {
      success: true,
      message: 'Initiated authentication with TMDB',
      action: 'waitForAuthResponse',
    };
  };

  const { mutateAsync: createSession } = useMutation({
    mutationKey: ['tmdbAuth'],
    mutationFn: tmdbServices.authentication.createSession,
  });

  useEffect(() => {
    (async () => {
      if (!tmdbAuthResult) {
        // this is the stage before TMDB auth, initiate auth
        const { action, message, success } = await startTMDBAuthProcess();
        console.info(`Action: ${action}, Message: ${message}, Success: ${success}`);
      } else if (tmdbAuthResult === 'true') {
        // TMDB auth successful, start session setup
        const requestToken = searchParams.get('request_token');
        if (!requestToken) {
          throw new Error('Request token not found, after tmdb redirect.');
        }

        const response = await createSession(requestToken);

        if (!response) {
          throw new Error('TMDB Session creation failed, please retry');
        }

        const { success, session_id } = response;
        setSessionId(session_id);
        if (success) {
          try {
            const { allFavoriteIds, allWatchlistIds } = await fetchUserFavoritesAndWatchlist();

            loadFavorites(allFavoriteIds);
            loadWatchlist(allWatchlistIds);
          } catch (error) {
            console.error(error);
          }

          clearLocalStorageKey('requestToken');
          checkAndExecutePendingRedirect();
        }
      }
    })();
  }, []);

  return !sessionId && tmdbAuthResult !== 'true' ? (
    <Paper className="py-10 px-4 m-4" bg="gray">
      <Stack align="center" justify="center" gap="xl">
        <Loader type="dots" size="xl" color="white" />
        <Text className="text-xl font-semibold text-white-800 font-montserrat">
          Redirecting to TMDB authentication page, hold one...
        </Text>
      </Stack>
    </Paper>
  ) : (
    <Paper className="py-10 px-4 m-4 bg-green-700/10">
      <Stack align="center" justify="center" gap="xl">
        <TbCheck className="text-5xl bg-green-600" />
        <Text className="text-xl font-semibold text-green-500 font-montserrat ">
          Successfully authenticated, Fetching account details...
        </Text>
        <Link to="/movies/trending" className="underline italic">
          View Trending Movies
        </Link>
      </Stack>
    </Paper>
  );
};

export default TmdbAuthPage;
