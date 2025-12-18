import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isAuth: !!localStorage.getItem('access_token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),

  login: (data) => {
    console.log("💾 Login ma'lumotlari saqlanmoqda:", data);

    const accessToken =
      data.accessToken || data.access_token || data.access || data.token;
    const refreshToken =
      data.refreshToken || data.refresh_token || data.refresh;
    const user = data.user || data;

    console.log(
      '🔑 Access Token:',
      accessToken ? `${accessToken.substring(0, 30)}...` : 'topilmadi'
    );
    console.log(
      '🔄 Refresh Token:',
      refreshToken ? `${refreshToken.substring(0, 30)}...` : 'topilmadi'
    );

    if (!accessToken) {
      console.error('⚠️ Access token topilmadi!');
      return;
    }

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

    console.log('✅ Login muvaffaqiyatli saqlandi');
  },

  logout: () => {
    console.log('🚪 Logout...');
    set({
      user: null,
      isAuth: false,
    });
    localStorage.clear();
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

    console.log('🔍 Auth tekshirilmoqda:', {
      hasToken: !!token,
      hasUser: !!user,
    });

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
