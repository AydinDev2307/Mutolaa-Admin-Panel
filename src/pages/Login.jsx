import { Button, PasswordInput, Input, Container } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import { API } from '../centerAPI/API';
import { notifications } from '@mantine/notifications';
import { Notifications } from '@mantine/notifications';
import useAuthStore from '../store/authStore';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import '@mantine/notifications/styles.css';

const Login = () => {
  const { login, isAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  const { mutate: loginMut, isPending } = useMutation({
    mutationFn: async (body) => {
      console.log("📤 Yuborilayotgan ma'lumot:", body);

      // URL ni to'liq tekshirish
      const fullUrl = `${API.defaults.baseURL}/auth/login/`;
      console.log("🌐 To'liq URL:", fullUrl);

      try {
        const res = await API.post('/auth/login/', body);
        console.log('✅ API javob:', res.data);
        return res.data;
      } catch (error) {
        console.error('❌ API xatosi:', error);
        console.error('📋 Xato response:', error.response);
        throw error;
      }
    },
    onSuccess: (res) => {
      console.log('🎉 Login muvaffaqiyatli:', res);

      // Backend turli formatda javob qaytarishi mumkin, tekshiramiz
      // Format 1: { accessToken, refreshToken, user }
      // Format 2: { access_token, refresh_token, user }
      // Format 3: { access, refresh, user }
      // Format 4: { token, user }

      const userData = {
        accessToken:
          res.accessToken || res.access_token || res.access || res.token,
        refreshToken: res.refreshToken || res.refresh_token || res.refresh,
        user: res.user || res,
      };

      console.log("💾 Saqlanayotgan ma'lumot:", userData);

      if (!userData.accessToken) {
        console.error('⚠️ Token topilmadi!', res);
        notifications.show({
          title: 'Xato',
          message: 'Token topilmadi. Backend javobini tekshiring.',
          color: 'red',
        });
        return;
      }

      login(userData);
      notifications.show({
        title: 'Muvaffaqiyatli',
        message: 'Tizimga muvaffaqiyatli kirdingiz',
        color: 'green',
      });
    },
    onError: (err) => {
      console.error('❌ Login xatosi:', err);
      console.error('📄 Xato response:', err.response?.data);
      console.error('📊 Xato status:', err.response?.status);

      let errorMessage = 'Login yoki parol xato';

      if (err.response?.data) {
        // Turli xato formatlari
        errorMessage =
          err.response.data.message ||
          err.response.data.detail ||
          err.response.data.error ||
          (err.response.data.phone &&
            `Telefon: ${err.response.data.phone[0]}`) ||
          (err.response.data.password &&
            `Parol: ${err.response.data.password[0]}`) ||
          JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
      }

      notifications.show({
        title: 'Xato',
        message: errorMessage,
        color: 'red',
        autoClose: 5000,
      });
    },
  });

  if (isAuth) {
    console.log(
      "✅ Foydalanuvchi autentifikatsiya qilingan, bosh sahifaga yo'naltirish"
    );
    return <Navigate to="/" replace />;
  }

  const onSubmit = (data) => {
    console.log("📝 Form ma'lumotlari:", data);
    loginMut({
      phone: data.phone,
      password: data.password,
    });
  };

  return (
    <>
      <Notifications position="top-right" zIndex={1000} />
      <Container
        size="xs"
        py="xl"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
        }}>
        <div
          style={{
            width: '100%',
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '15px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}>
          <h1
            style={{
              textAlign: 'center',
              marginBottom: '30px',
              color: '#333',
            }}>
            Tizimga kirish
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              placeholder="Telefon raqam (masalan: +998901234567)"
              mb="md"
              size="md"
              {...register('phone', {
                required: 'Telefon raqam majburiy',
                pattern: {
                  value:
                    /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                  message: "Telefon raqam formati noto'g'ri",
                },
              })}
              error={errors.phone?.message}
            />
            <PasswordInput
              placeholder="Parol"
              mb="md"
              size="md"
              {...register('password', {
                required: 'Parol majburiy',
                minLength: {
                  value: 4,
                  message: "Parol kamida 4 ta belgidan iborat bo'lishi kerak",
                },
              })}
              error={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              loading={isPending}
              size="md"
              style={{ marginTop: '10px' }}>
              Kirish
            </Button>
          </form>
        </div>
      </Container>
    </>
  );
};

export default Login;
