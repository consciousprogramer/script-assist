import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useMyLocalStorage from './useMyLocalStorage';
import { TNavigationPagesKey, TPageWiseNavigationActions } from '@/types/data.types';
import useUserStore from '@/setup/store/user.store';

// DONE: add support for redirect and action resume
const useRedirection = <Page extends TNavigationPagesKey>() => {
  const location = useLocation();
  const navigate = useNavigate();
  const sessionId = useUserStore((state) => state.sessionId);
  const { setLocalStorage, getLocalStorage, clearLocalStorageKey } = useMyLocalStorage();

  const addRedirectUrl = useCallback(
    (
      action: TPageWiseNavigationActions[Page],
      redirectionParams?: URLSearchParams | Record<string, any>
    ) => {
      const searchParams = new URLSearchParams({
        ...redirectionParams,
        action,
        isPendingRedirect: 'true',
      });
      setLocalStorage('navigation', {
        navigateTo: {
          path: `${location.pathname}?${searchParams.toString()}`,
        },
      });
    },
    [location.pathname, setLocalStorage]
  );

  const checkAndExecutePendingRedirect = useCallback(() => {
    const navigationData = getLocalStorage('navigation');
    if (navigationData) {
      const { path } = navigationData.navigateTo;
      clearLocalStorageKey('navigation');
      navigate(path, {
        replace: true,
      });
    }
  }, [navigate, clearLocalStorageKey, getLocalStorage]);

  const checkSessionOrAuthenticate = useCallback(
    (
      action: TPageWiseNavigationActions[Page],
      redirectionParams?: URLSearchParams | Record<string, any>
    ) => {
      if (!sessionId) {
        addRedirectUrl(action, redirectionParams);
        navigate('/auth/tmdb/user');
        return false;
      }
      return true;
    },
    [navigate, addRedirectUrl, sessionId]
  );

  const autoExecuteAfterRedirectJob = async (
    actionExecutorMap: Record<TPageWiseNavigationActions[Page], Function>,
    afterWork: Function
  ) => {
    const pageSearchParams = new URLSearchParams(location.search);

    const isPendingRedirect = pageSearchParams.get('isPendingRedirect');
    if (!isPendingRedirect || isPendingRedirect === 'false') return;

    const action = pageSearchParams.get('action') as TPageWiseNavigationActions[Page];

    await { ...actionExecutorMap, none: () => Promise.resolve() }[action]();

    await afterWork();
  };

  return {
    addRedirectUrl,
    autoExecuteAfterRedirectJob,
    checkSessionOrAuthenticate,
    checkAndExecutePendingRedirect,
    navigate,
    location,
  };
};

export default useRedirection;
