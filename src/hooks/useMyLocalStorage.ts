import { useCallback } from 'react';
import { TLCRequestToken, TLCSessionId, TNavigateToData } from '@/types/data.types';

type TLocalStorageData = {
  // user: TLCUser;
  requestToken: TLCRequestToken;
  navigation: TNavigateToData | null;
  appStoreData: {
    state: { favorites: number[]; watchlist: number[] };
    version: number;
  };
  userStoreData: { state: { sessionId: TLCSessionId }; version: number };
};

type TLocalStorageKeys = keyof TLocalStorageData;

function useMyLocalStorage() {
  const getLocalStorage = useCallback(<K extends TLocalStorageKeys>(key: K) => {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as TLocalStorageData[K];
  }, []);

  const setLocalStorage = useCallback(
    <K extends TLocalStorageKeys>(key: K, value: TLocalStorageData[K]) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    []
  );

  const clearLocalStorageKey = useCallback(<K extends TLocalStorageKeys>(key: K) => {
    localStorage.removeItem(key);
  }, []);

  const clearLocalStorage = useCallback(() => {
    localStorage.clear();
  }, []);

  return {
    getLocalStorage,
    setLocalStorage,
    clearLocalStorageKey,
    clearLocalStorage,
  };
}

export default useMyLocalStorage;
