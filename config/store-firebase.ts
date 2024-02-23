import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FirebaseData {
  idToken: string | null;
}

interface FirebaseActions {
  setIdToken: (token: string) => void;
}

type FirebaseStore = FirebaseData & FirebaseActions;

export const useFirebaseStore = create<FirebaseStore>()(
  persist(
    (set) => ({
      
      idToken : "",

      setIdToken: (token: string) =>
        set((state) => {
          return {
            ...state,
            idToken: token,
          };
        }),

    }),
    {
      name: 'firebase',
    }),
);
