import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storePersistenceStorageKey } from '@/constants/app.constants';

type TUserState = {
  sessionId: string | null;
  setSessionId: (sessionId: TUserState['sessionId']) => void;
  clearData: () => void;
};

const useUserStore = create<TUserState>()(
  persist(
    (set) => ({
      sessionId: null,
      setSessionId: (sessionData) => set({ sessionId: sessionData }),
      clearData: () => set({ sessionId: null }),
    }),
    {
      name: storePersistenceStorageKey.USER_STORE,
    }
  )
);

export default useUserStore;
