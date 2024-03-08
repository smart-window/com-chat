import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface APIData {
  apiKey: string | null;
}

interface APIActions {
  setAPIKey: (address: string) => void;
}

type APIStore = APIData & APIActions;

export const useAPIStore = create<APIStore>()(
  persist(
    (set) => ({

      apiKey: "",

      setAPIKey: (apiKey: string) =>
        set(() => {
          return {
            apiKey: apiKey,
          };
        }),

    }),
    {
      name: 'api',
    }),
);
