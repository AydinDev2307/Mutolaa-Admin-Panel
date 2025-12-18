import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const AuthStore = create(
  persist(
    (set) => ({
      user: null,
      access: null,
      isAuth: false,
      library: null,

      login: (user, access) =>
        set({
          user,
          access,
          isAuth: true,
        }),

      setUserData: (data) =>
        set({
          user: data.user,
          library: data.library,
          isAuth: true,
        }),

      logout: () =>
        set({
          user: null,
          access: null,
          isAuth: false,
          library: null,
        }),
    }),
    {
      name: 'auth-store',
    }
  )
);

export default AuthStore;
