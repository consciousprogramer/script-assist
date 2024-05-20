import { useCallback } from 'react';

type TSessionStorageData = {};

type TSessionStorageKeys = keyof TSessionStorageData;

function useMySessionStorage() {
  const getSessionStorage = useCallback(<K extends TSessionStorageKeys>(key: K) => {
    const item = sessionStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as TSessionStorageData[K];
  }, []);

  const setSessionStorage = useCallback(
    <K extends TSessionStorageKeys>(key: K, value: TSessionStorageData[K]) => {
      sessionStorage.setItem(key, JSON.stringify(value));
    },
    []
  );

  const clearSessionStorageKey = useCallback(<K extends TSessionStorageKeys>(key: K) => {
    sessionStorage.removeItem(key);
  }, []);

  const clearSessionStorage = useCallback(() => {
    sessionStorage.clear();
  }, []);

  return {
    getSessionStorage,
    setSessionStorage,
    clearSessionStorageKey,
    clearSessionStorage,
  };
}

export default useMySessionStorage;
