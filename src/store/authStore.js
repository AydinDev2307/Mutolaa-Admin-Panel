import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isAuth: !!localStorage.getItem('access_token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),

  login: (data) => {
    const accessToken =
      data.accessToken || data.access_token || data.access || data.token;
    const refreshToken =
      data.refreshToken || data.refresh_token || data.refresh;
    const user = data.user || data;

    set({
      user,
      isAuth: true,
    });

    localStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  },

  logout: () => {
    set({
      user: null,
      isAuth: false,
    });

    localStorage.clear();

    const favorites = localStorage.getItem('favorites');
    localStorage.clear();
    if (favorites) {
      localStorage.setItem('favorites', favorites);
    }

    console.log('✅ Logout: LocalStorage tozalandi');
  },

  updateUser: (user) => {
    set({
      user,
      isAuth: true,
    });
    localStorage.setItem('user', JSON.stringify(user));
  },

  setIsAuth: () => {
    set({
      isAuth: true,
    });
  },

  checkAuth: () => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');

    if (token) {
      set({
        isAuth: true,
        user: user ? JSON.parse(user) : null,
      });
      return true;
    } else {
      set({
        isAuth: false,
        user: null,
      });
      return false;
    }
  },
}));

export default useAuthStore;
